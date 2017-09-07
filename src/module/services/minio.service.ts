import { ReadStream } from 'fs';
import { EventEmitter } from 'events';
import { Injectable, Inject } from '@hapiness/core';

import { Observable } from 'rxjs';

import { MinioExt } from '../minio.extension';
import {
    MinioConnect,
    MinioBucketRegion, stringToMinioBucketRegion,
    MinioBucket,
    MinioBucketObject,
    MinioBucketIncompleteUpload,
    MinioCopyResult,
    MinioCopyCondition,
    MinioPresignedPostPolicyResult,
    MinioPostPolicy,
    MinioStatObject,
    MinioPolicy
} from '../interfaces';

import { MinioManager } from '../managers';


@Injectable()
export class MinioService {

    /**
     * For better documentation, you can check online at
     * https://docs.minio.io/docs/javascript-client-api-reference
     */
    private _minioClient: any;

    constructor(@Inject(MinioExt) private _manager: MinioManager) {
        this._minioClient = _manager.client;
    }

    /**
     *
     * @return Return the default bucket region
     *
     */
    protected _defaultRegion(): MinioBucketRegion {
        return stringToMinioBucketRegion(this._manager.config.default_region);
    }

    /**
     *
     * @description Return a copy condition object instance
     *
     */
    public newMinioCopyCondition(): MinioCopyCondition {
        return new (this._manager.minio).CopyConditions();
    }

    /**
     *
     * @description Return a new post policy instance
     *
     */
    public newMinioPostPolicy(): MinioPostPolicy {
        return new (this._manager.minio).newPostPolicy();
    }

    /**
     * @description Create a bucket
     *
     * @param bucketName Name of the bucket
     * @param region Region where the bucket is created. Default value is us-east-1
     *
     * @return Observable of true if all went well
     *
     */
    public makeBucket(bucketName: string, region?: MinioBucketRegion): Observable<boolean> {
        return Observable
            .of(region)
            .filter(_ => !!_)
            .defaultIfEmpty(this._defaultRegion())
            .switchMap(_ => this._minioClient.makeBucket(bucketName, _))
            .map(_ => true);
    }

    /**
     *
     * @description Check if a bucket already exists
     *
     * @param bucketName Name of the bucket
     *
     * @return Observable of boolean: true if bucket exists, false if it does not, error in all other cases
     *
     */
    public bucketExists(bucketName: string): Observable<boolean> {
        return Observable
            .fromPromise(this._minioClient.bucketExists(bucketName))
            .map(_ => true)
            .catch(_ => _.code === 'NoSuchBucket' ? Observable.of(false) : Observable.throw(_));
    }

    /**
     *
     * List all buckets
     *
     * @return Observable of bucket information
     *
     */
    public listBuckets(): Observable<MinioBucket[]> {
        return Observable
            .fromPromise(this._minioClient.listBuckets());
    }

    /**
     *
     * @description Lists all objects in a bucket
     *
     * @param bucketName Name of the bucket
     * @param prefix The prefix of the objects that should be listed (optional, default '')
     * @param recursive True indicates recursive style listing and False indicates directory style listing delimited by '/'.
     *                  (optional, default false).
     *
     * @return Observable emitting the objects in the bucket
     *
     */
    public listObjects(bucketName: string, prefix: string = '', recursive: boolean = false): Observable<MinioBucketObject> {
        return Observable
            .create(
                observer => {
                    const stream = this._minioClient.listObjects(bucketName, prefix, recursive);

                    stream.on('data', (obj: MinioBucketObject) => observer.next(obj));
                    stream.on('error', (err) => observer.error(err));
                    stream.on('end', (err) => observer.complete());
                }
            );
    }

    /**
     *
     * @description Lists all objects in a bucket using S3 listing objects V2 API
     *
     * @param bucketName Name of the bucket
     * @param prefix The prefix of the objects that should be listed (optional, default '')
     * @param recursive True indicates recursive style listing and False indicates directory style listing delimited by '/'.
     *                  (optional, default false).
     *
     * @return Observable emitting the objects in the bucket
     *
     */
    public listObjectsV2(bucketName: string, prefix: string = '', recursive: boolean = false): Observable<MinioBucketObject> {
        return Observable
            .create(
                observer => {
                    const stream = this._minioClient.listObjectsV2(bucketName, prefix, recursive);

                    stream.on('data', (obj: MinioBucketObject) => observer.next(obj));
                    stream.on('error', (err) => observer.error(err));
                    stream.on('end', (err) => observer.complete());
                }
            );
    }

    /**
     *
     * @description Lists partially uploaded objects in a bucket
     *
     * @param bucketName Name of the bucket
     * @param prefix The prefix of the objects that should be listed (optional, default '')
     * @param recursive True indicates recursive style listing and False indicates directory style listing delimited by '/'.
     *                  (optional, default false).
     *
     * @return Observable emitting the incomplete upload objects in the bucket
     *
     */
    public listIncompleteUploads(bucketName: string, prefix: string = '', recursive: boolean = false):
        Observable<MinioBucketIncompleteUpload> {
        return Observable
            .create(
                observer => {
                    const stream = this._minioClient.listIncompleteUploads(bucketName, prefix, recursive);

                    stream.on('data', (obj: MinioBucketObject) => observer.next(obj));
                    stream.on('error', (err) => observer.error(err));
                    stream.on('end', (err) => observer.complete());
                }
            );
    }

    /**
     *
     * @description Downloads an object as a stream
     *
     * @param bucketName Name of the bucket
     * @param objectName Name of the object
     *
     * @return Observable of stream representing the object content stream
     *
     */
    public getObject(bucketName: string, objectName: string): Observable<ReadableStream> {
        return Observable
            .fromPromise(this._minioClient.getObject(bucketName, objectName));
    }

    /**
     *
     * @description Downloads the specified range bytes of an object as a stream
     *
     * @param bucketName Name of the bucket
     * @param objectName Name of the object
     * @param offset Offset of the object from where the stream will start
     * @param length Length of the object that will be read in the stream
     * (optional, if not specified we read the rest of the file from the offset)
     *
     * @return Observable of stream representing the partial object content stream
     *
     */
    public getPartialObject(bucketName: string, objectName: string, offset: number, length: number = 0):
        Observable<ReadableStream> {
        return Observable
            .fromPromise(this._minioClient.getPartialObject(bucketName, objectName, offset, length));
    }

    /**
     *
     * @description Downloads and saves the object as a file in the local filesystem
     *
     * @param bucketName Name of the bucket
     * @param objectName Name of the object
     * @param filePath Path on the local filesystem to which the object data will be written
     *
     * @return true if all went well
     *
     */
    public fGetObject(bucketName: string, objectName: string, filePath: string): Observable<boolean> {
        return Observable
            .fromPromise(this._minioClient.fGetObject(bucketName, objectName, filePath))
            .map(_ => true);
    }

    /**
     *
     * @description Uploads an object from a stream/Buffer
     *
     * @param bucketName Name of the bucket
     * @param objectName Name of the object
     * @param stream Readable stream
     * @param size Size of the object (optional)
     * @param contentType Content-Type of the object (optional, default application/octet-stream)
     *
     *
     * The maximum size of a single object is limited to 5TB.
     * putObject transparently uploads objects larger than 5MiB in multiple parts.
     * This allows failed uploads to resume safely by only uploading the missing parts.
     * Uploaded data is carefully verified using MD5SUM signatures.
     *
     * @return ETAG of the uploaded object
     *
     */
    public putObject(
        bucketName: string,
        objectName: string,
        stream: ReadStream | string | Buffer,
        size?: number,
        contentType: string = 'application/octet-stream'
    ): Observable<string> {
        if (typeof stream === 'string' || stream instanceof Buffer) {
            return Observable
                .fromPromise(this._minioClient.putObject(bucketName, objectName, stream));
        }

        return Observable
            .fromPromise(this._minioClient.putObject(bucketName, objectName, stream, size, contentType));
    }

    /**
     *
     * @description Uploads contents from a file to objectName
     *
     * @param bucketName Name of the bucket
     * @param objectName Name of the object
     * @param filePath Path of the file to be uploaded
     * @param contentType Content-Type of the object
     *
     * The maximum size of a single object is limited to 5TB.
     * fPutObject transparently uploads objects larger than 5MiB in multiple parts.
     * This allows failed uploads to resume safely by only uploading the missing parts.
     * Uploaded data is carefully verified using MD5SUM signatures
     *
     * @return Observable of string representing the etag of the object uploaded
     *
     */
    public fPutObject(
        bucketName: string,
        objectName: string,
        filePath: string,
        contentType: string = 'application/octet-stream'
    ): Observable<string> {
        return Observable
            .fromPromise(this._minioClient.fPutObject(bucketName, objectName, filePath, contentType));
    }

    /**
     *
     * @description Copy a source object into a new object in the specied bucket
     *
     * @param bucketName Name of the bucket
     * @param objectName Name of the object
     * @param sourceObject Path of the file to be copied
     * @param conditions Conditions to be satisfied before allowing object copy
     *
     * The maximum size of a single object is limited to 5TB.
     * fPutObject transparently uploads objects larger than 5MiB in multiple parts.
     * This allows failed uploads to resume safely by only uploading the missing parts.
     * Uploaded data is carefully verified using MD5SUM signatures
     *
     * @return Observable of etag string and lastModified Date of the object newly copied object
     *
     */
    public copyObject(bucketName: string, objectName: string, sourceObject: string, conditions: MinioCopyCondition):
        Observable<MinioCopyResult> {
        return Observable
            .fromPromise(this._minioClient.copyObject(bucketName, objectName, sourceObject, conditions));
    }

    /**
     *
     * @description Gets metadata of an object
     *
     * @param bucketName Name of the bucket
     * @param objectName Name of the object
     *
     * @return Observable of the object information
     *
     */
    public statObject(bucketName: string, objectName: string): Observable<MinioStatObject> {
        return Observable
            .fromPromise(this._minioClient.statObject(bucketName, objectName));
    }

    /**
     *
     * @description Removes an object
     *
     * @param bucketName Name of the bucket
     * @param objectName Name of the object
     *
     * @return Observable of true if all went well
     *
     */
    public removeObject(bucketName: string, objectName: string): Observable<boolean> {
        return Observable
            .fromPromise(this._minioClient.removeObject(bucketName, objectName))
            .map(_ => true);
    }

    /**
     *
     * @description Removes a partially uploaded object
     *
     * @param bucketName Name of the bucket
     * @param objectName Name of the object
     *
     * @return Observable of true if all went well
     *
     */
    public removeIncompleteUpload(bucketName: string, objectName: string): Observable<boolean> {
        return Observable
            .fromPromise(this._minioClient.removeIncompleteUpload(bucketName, objectName))
            .map(_ => true);
    }

    /**
     *
     * @description Generates a presigned URL for HTTP GET operations.
     * Browsers/Mobile clients may point to this URL to directly download objects even if the bucket is private.
     * This presigned URL can have an associated expiration time in seconds after which the URL is no longer valid.
     * The default expiry is set to 7 days
     *
     * @param bucketName Name of the bucket
     * @param objectName Name of the object
     * @param expiry Expiry in seconds. Default expiry is set to 7 days
     *
     * @return Observable of the URL using which the object can be downloaded using GET request
     *
     */
    public presignedGetObject(bucketName: string, objectName: string, expiry: number = 604800): Observable<string> {
        return Observable
            .fromPromise(this._minioClient.presignedGetObject(bucketName, objectName, expiry));
    }

    /**
     *
     * @description Generates a presigned URL for HTTP PUT operations.
     * Browsers/Mobile clients may point to this URL to upload objects directly to a bucket even if it is private.
     * This presigned URL can have an associated expiration time in seconds after which the URL is no longer valid.
     * The default expiry is set to 7 days
     *
     * @param bucketName Name of the bucket
     * @param objectName Name of the object
     * @param expiry Expiry in seconds. Default expiry is set to 7 days
     *
     * @return Observable of the URL using which the object can be uploaded using PUT request
     *
     */
    public presignedPutObject(bucketName: string, objectName: string, expiry: number = 604800): Observable<string> {
        return Observable
            .fromPromise(this._minioClient.presignedPutObject(bucketName, objectName, expiry));
    }

    /**
     *
     * @description Allows setting policy conditions to a presigned URL for POST operations.
     * Policies such as bucket name to receive object uploads, key name prefixes, expiry policy may be set
     *
     * @param policy Policy object created by minioClient.newPostPolicy()
     *
     * @return Observable of an object where postURL will be the URL using which the object can be uploaded using POST request,
     * and formData is the object having key/value pairs for the Form data of POST body
     *
     */
    public presignedPostPolicy(policy: MinioPostPolicy): Observable<MinioPresignedPostPolicyResult> {
        return Observable
            .fromPromise(this._minioClient.presignedPostPolicy(policy));
    }

    /**
     *
     * @description Fetch the notification configuration stored in the S3 provider and that belongs to
     * the specified bucket name
     *
     * @param bucketName Name of the bucket
     *
     * @return Observable of the object that carries all notification configurations associated to bucketName
     *
     */
    public getBucketNotification(bucketName: string): Observable<any> {
        return Observable
            .fromPromise(this._minioClient.getBucketNotification(bucketName));
    }

    /**
     *
     * @description Upload a user-created notification configuration and associate it to the specified bucket name
     *
     * @param bucketName Name of the bucket
     * @param bucketNotificationConfig Javascript object that carries the notification configuration
     *
     * @return Observable of true if all went well
     *
     */
    public setBucketNotification(bucketName: string, bucketNotificationConfig: any): Observable<boolean> {
        return Observable
            .fromPromise(this._minioClient.setBucketNotification(bucketName, bucketNotificationConfig))
            .map(_ => true);
    }

    /**
     *
     * @description Remove the bucket notification configuration associated to the specified bucket
     *
     * @param bucketName Name of the bucket
     *
     * @return Observable of true if all went well
     *
     */
    public removeAllBucketNotification(bucketName: string): Observable<boolean> {
        return Observable
            .fromPromise(this._minioClient.removeAllBucketNotification(bucketName))
            .map(_ => true);
    }

    /**
     *
     * @description Listen for notifications on a bucket.
     * Additionally one can provider filters for prefix, suffix and events.
     * There is no prior set bucket notification needed to use this API.
     * This is an Minio extension API where unique identifiers are regitered and unregistered
     * by the server automatically based on incoming requests
     *
     * @param bucketName Name of the bucket
     * @param prefix Object key prefix to filter notifications for
     * @param suffix Object key suffix to filter notifications for
     * @param events Enables notifications for specific event types
     *
     * @return an EventEmitter, which will emit a notification event carrying the record
     * (NOTE: To stop listening, call .stop() on the returned EventEmitter)
     *
     */
    public listenBucketNotification(bucketName: string, prefix: string, suffix: string, events: string[]): EventEmitter {
        return this
            ._minioClient
            .listenBucketNotification(bucketName, prefix, suffix, events);
    }

    /**
     *
     * @description Get the bucket policy associated with the specified bucket.
     * If objectPrefix is not empty, the bucket policy will be filtered based on object permissions as well.
     *
     * @param bucketName Name of the bucket
     * @param objectPrefix Prefix of objects in the bucket with which to filter permissions off of
     * (use '' for entire bucket)
     *
     * @return an Observable of the policy. The policy will be the string representation of the bucket policy
     * ( MinioPolicy.NONE, MinioPolicy.READONLY, MinioPolicy.WRITEONLY, or MinioPolicy.READWRITE )
     *
     */
    public getBucketPolicy(bucketName: string, objectPrefix: string = ''): Observable<MinioPolicy> {
        return Observable
            .of(this._minioClient.getBucketPolicy(bucketName, objectPrefix));
    }

    /**
     *
     * @description Set the bucket policy associated with the specified bucket.
     * If objectPrefix is not empty, the bucket policy will only be assigned to objects that fit the given prefix
     *
     * @param bucketName Name of the bucket
     * @param bucketPolicy The bucket policy
     * (This can be: MinioPolicy.NONE, MinioPolicy.READONLY, MinioPolicy.WRITEONLY, MinioPolicy.READWRITE)
     * @param objectPrefix Prefix of objects in the bucket with which to filter permissions off of (use '' for entire bucket)
     *
     * @return an Observable of true if all went well
     *
     */
    public setBucketPolicy(bucketName: string, bucketPolicy: MinioPolicy, objectPrefix: string = ''): Observable<boolean> {
        return Observable
            .of(this._minioClient.setBucketPolicy(bucketName, objectPrefix, bucketPolicy))
            .map(_ => true);
    }
}
