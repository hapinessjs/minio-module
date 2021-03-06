
/**
 * @see https://github.com/pana-cc/mocha-typescript
 */
import { test, suite } from 'mocha-typescript';

/**
 * @see http://unitjs.com/
 */
import * as unit from 'unit.js';
import * as fs from 'fs';

import { Observable } from 'rxjs/Observable';

import { MinioService, MinioPolicy } from '../../src';

@suite('- Unit tests of MinioService')
export class MinioServiceTest {

    /**
     * Function executed before the suite
     */
    static before() { }

    /**
     * Function executed after the suite
     */
    static after() { }

    /**
     * Class constructor
     * New lifecycle
     */
    constructor() { }

    /**
     * Function executed before each test
     */
    before() { }

    /**
     * Function executed after each test
     */
    after() { }

    /**
     * Test `MinioService` function _defaultRegion
     */
    @test('- Test `MinioService` function _defaultRegion')
    testMinioServiceDefaultRegion() {
        class MinioServiceExtanded extends MinioService {
            constructor(manager: any) {
                super(manager);
            }

            defaultRegion() {
                return this._defaultRegion();
            }
        }

        const instance1 = new MinioServiceExtanded({ client: {}, config: { connection: {} } });
        const instance2 = new MinioServiceExtanded({ client: {}, config: { connection: { region: '' } } });
        const instance3 = new MinioServiceExtanded({ client: {}, config: { connection: { region: 'cn-north-1' } } });

        unit.string(instance1.defaultRegion()).is('us-east-1');

        unit.string(instance2.defaultRegion()).is('us-east-1');

        unit.string(instance3.defaultRegion()).is('cn-north-1');
    }

    /**
     * Test `MinioService` function newMinioCopyCondition
     */
    @test('- Test `MinioService` function newMinioCopyCondition')
    testMinioServiceNewMinioCopyCondition() {
        const stub = unit.stub().returns({ etag: 'etag' });
        const service = new MinioService(<any>{ minio: { CopyConditions: stub }, config: {} });

        const copyCondition = service.newMinioCopyCondition();

        unit.object(copyCondition).is({ etag: 'etag' });
        unit.number(stub.callCount).is(1);
        unit.bool(stub.getCall(0).calledWithNew()).isTrue();
    }

    /**
     * Test `MinioService` function newMinioPostPolicy
     */
    @test('- Test `MinioService` function newMinioPostPolicy')
    testMinioServiceNewMinioPostPolicy() {
        const stub = unit.stub().returns({ policy: {} });
        const service = new MinioService(<any>{ client: { newPostPolicy: stub }, config: {} });

        const postPolicy = service.newPostPolicy();

        unit.object(postPolicy).is({ policy: {} });
        unit.number(stub.callCount).is(1);
    }

    /**
     * Test `MinioService` function makeBucket without specifying a region
     */
    @test('- Test `MinioService` function makeBucket without specifying a region')
    testMinioServiceMakeBucketWithoutRegion(done) {
        const stub = unit.stub().returns(Observable.of(true));
        const service = new MinioService(<any>{ client: { makeBucket: stub }, config: { connection: {} } });

        service
            .makeBucket('bucket_name')
            .subscribe(
                _ => {
                    unit.bool(_).isTrue();
                    unit.number(stub.callCount).is(1);
                    unit.string(stub.getCall(0).args[0]).is('bucket_name');
                    unit.string(stub.getCall(0).args[1]).is('us-east-1');

                    done();
                },
                err => done(err)
            );
    }

    /**
     * Test `MinioService` function makeBucket inside a region
     */
    @test('- Test `MinioService` function makeBucket inside a region')
    testMinioServiceMakeBucketWithRegion(done) {
        const stub = unit.stub().returns(Observable.of(true));
        const service = new MinioService(<any>{ client: { makeBucket: stub }, config: { connection: {} } });

        service
            .makeBucket('bucket_name', 'cn-north-1')
            .subscribe(
                _ => {
                    unit.bool(_).isTrue();
                    unit.number(stub.callCount).is(1);
                    unit.string(stub.getCall(0).args[0]).is('bucket_name');
                    unit.string(stub.getCall(0).args[1]).is('cn-north-1');

                    done();
                },
                err => done(err)
            );
    }

    /**
     * Test `MinioService` function bucketExists
     */
    @test('- Test `MinioService` function bucketExists')
    testMinioServiceBucketExists(done) {
        const stub = unit.stub().returns(Promise.resolve(true));
        const service = new MinioService(<any>{ client: { bucketExists: stub }, config: {} });

        service
            .bucketExists('bucket_name')
            .subscribe(
                _ => {
                    unit.bool(_).isTrue();
                    unit.number(stub.callCount).is(1);
                    unit.string(stub.getCall(0).args[0]).is('bucket_name');

                    done();
                },
                err => done(err)
            );
    }

    /**
     * Test `MinioService` function bucketExists error with NoSuchBucket code
     */
    @test('- Test `MinioService` function bucketExists error with NoSuchBucket code')
    testMinioServiceBucketExistsErrorNoSuchBucketCode(done) {
        const stub = unit.stub().returns(Promise.reject(false));

        const service = new MinioService(<any>{ client: { bucketExists: stub }, config: {} });

        service
            .bucketExists('bucket_name')
            .subscribe(
                _ => {
                    unit.bool(_).isFalse();
                    unit.number(stub.callCount).is(1);
                    unit.string(stub.getCall(0).args[0]).is('bucket_name');

                    done();
                },
                e => done(e)
            );
    }

    /**
     * Test `MinioService` function bucketExists error
     */
    @test('- Test `MinioService` function bucketExists error')
    testMinioServiceBucketExistsError(done) {
        const stub = unit.stub().returns(Promise.resolve(false));

        const service = new MinioService(<any>{ client: { bucketExists: stub }, config: {} });

        service
            .bucketExists('bucket_name')
            .subscribe(
                _ => {
                    unit.number(stub.callCount).is(1);
                    unit.bool(_).isFalse();
                    done();
                },
                e => done(e)
            );
    }

    /**
     * Test `MinioService` function listBuckets
     */
    @test('- Test `MinioService` function listBuckets')
    testMinioServiceListBuckets(done) {
        const stub = unit.stub().returns(Promise.resolve([]));

        const service = new MinioService(<any>{ client: { listBuckets: stub }, config: {} });

        service
            .listBuckets()
            .subscribe(
                _ => {
                    unit.array(_).is([]);
                    done();
                },
                e => done(e)
            );
    }

    /**
     * Test `MinioService` function removeBucket
     */
    @test('- Test `MinioService` function removeBucket')
    testMinioServiceRemoveBucket(done) {
        const stub = unit.stub().returns(Promise.resolve([]));

        const service = new MinioService(<any>{ client: { removeBucket: stub }, config: {} });

        service
            .removeBucket('bucket_name')
            .subscribe(
                _ => {
                    unit.bool(_).isTrue();
                    done();
                },
                e => done(e)
            );
    }

    /**
     * Test `MinioService` function listObjects
     */
    @test('- Test `MinioService` function listObjects')
    testMinioServiceListObjects(done) {
        const stub = unit.stub().returns(fs.createReadStream(`${__dirname}/minio.manager.test.ts`, { encoding: 'utf8' }));

        const service = new MinioService(<any>{ client: { listObjects: stub }, config: {} });

        service
            .listObjects('bucket_name')
            .subscribe(
                _ => {},
                e => done(e),
                () => {
                    unit.number(stub.callCount).is(1);
                    unit.string(stub.getCall(0).args[0]).is('bucket_name');
                    unit.string(stub.getCall(0).args[1]).is('');
                    unit.bool(stub.getCall(0).args[2]).isFalse();

                    done();
                }
            );
    }

    /**
     * Test `MinioService` function listObjects error in stream
     */
    @test('- Test `MinioService` function listObjects error in stream')
    testMinioServiceListObjectsErrorInStream(done) {
        const stub = unit.stub().returns(fs.createReadStream(`${__dirname}/unexisting_file.ts`, { encoding: 'utf8' }));

        const service = new MinioService(<any>{ client: { listObjects: stub }, config: {} });

        service
            .listObjects('bucket_name', 'test', true)
            .subscribe(
                _ => {},
                e => {
                    unit.number(stub.callCount).is(1);
                    unit.string(stub.getCall(0).args[0]).is('bucket_name');
                    unit.string(stub.getCall(0).args[1]).is('test');
                    unit.bool(stub.getCall(0).args[2]).isTrue();

                    done();
                },
                () => done(new Error('Should not be there'))
            );
    }

    /**
     * Test `MinioService` function listObjectsV2
     */
    @test('- Test `MinioService` function listObjectsV2')
    testMinioServiceListObjectsV2(done) {
        const stub = unit.stub().returns(fs.createReadStream(`${__dirname}/minio.manager.test.ts`, { encoding: 'utf8' }));

        const service = new MinioService(<any>{ client: { listObjectsV2: stub }, config: {} });

        service
            .listObjectsV2('bucket_name')
            .subscribe(
                _ => {},
                e => done(e),
                () => {
                    unit.number(stub.callCount).is(1);
                    unit.string(stub.getCall(0).args[0]).is('bucket_name');
                    unit.string(stub.getCall(0).args[1]).is('');
                    unit.bool(stub.getCall(0).args[2]).isFalse();

                    done();
                }
            );
    }

    /**
     * Test `MinioService` function listObjectsV2 error in stream
     */
    @test('- Test `MinioService` function listObjectsV2 error in stream')
    testMinioServiceListObjectsV2ErrorInStream(done) {
        const stub = unit.stub().returns(fs.createReadStream(`${__dirname}/unexisting_file.ts`, { encoding: 'utf8' }));

        const service = new MinioService(<any>{ client: { listObjectsV2: stub }, config: {} });

        service
            .listObjectsV2('bucket_name', 'test', true)
            .subscribe(
                _ => {},
                e => {
                    unit.number(stub.callCount).is(1);
                    unit.string(stub.getCall(0).args[0]).is('bucket_name');
                    unit.string(stub.getCall(0).args[1]).is('test');
                    unit.bool(stub.getCall(0).args[2]).isTrue();

                    done();
                },
                () => done(new Error('Should not be there'))
            );
    }

    /**
     * Test `MinioService` function listIncompleteUploads
     */
    @test('- Test `MinioService` function listIncompleteUploads')
    testMinioServiceListIncompleteUploads(done) {
        const stub = unit.stub().returns(fs.createReadStream(`${__dirname}/minio.manager.test.ts`, { encoding: 'utf8' }));

        const service = new MinioService(<any>{ client: { listIncompleteUploads: stub }, config: {} });

        service
            .listIncompleteUploads('bucket_name')
            .subscribe(
                _ => {},
                e => done(e),
                () => {
                    unit.number(stub.callCount).is(1);
                    unit.string(stub.getCall(0).args[0]).is('bucket_name');
                    unit.string(stub.getCall(0).args[1]).is('');
                    unit.bool(stub.getCall(0).args[2]).isFalse();

                    done();
                }
            );
    }

    /**
     * Test `MinioService` function listIncompleteUploads error in stream
     */
    @test('- Test `MinioService` function listIncompleteUploads error in stream')
    testMinioServiceListIncompleteUploadsErrorInStream(done) {
        const stub = unit.stub().returns(fs.createReadStream(`${__dirname}/unexisting_file.ts`, { encoding: 'utf8' }));

        const service = new MinioService(<any>{ client: { listIncompleteUploads: stub }, config: {} });

        service
            .listIncompleteUploads('bucket_name', 'test', true)
            .subscribe(
                _ => {},
                e => {
                    unit.number(stub.callCount).is(1);
                    unit.string(stub.getCall(0).args[0]).is('bucket_name');
                    unit.string(stub.getCall(0).args[1]).is('test');
                    unit.bool(stub.getCall(0).args[2]).isTrue();

                    done();
                },
                () => done(new Error('Should not be there'))
            );
    }

    /**
     * Test `MinioService` function getObject
     */
    @test('- Test `MinioService` function getObject')
    testMinioServiceGetObject(done) {
        const stub = unit.stub().returns(Promise.resolve());

        const service = new MinioService(<any>{ client: { getObject: stub }, config: {} });

        service
            .getObject('bucket_name', 'object_name')
            .subscribe(
                _ => {
                    unit.string(stub.getCall(0).args[0]).is('bucket_name');
                    unit.string(stub.getCall(0).args[1]).is('object_name');

                    done();
                },
                e => done(e)
            );
    }

    /**
     * Test `MinioService` function getPartialObject without specifying a length
     */
    @test('- Test `MinioService` function getPartialObject without specifying a length')
    testMinioServiceGetPartialObject(done) {
        const stub = unit.stub().returns(Promise.resolve());

        const service = new MinioService(<any>{ client: { getPartialObject: stub }, config: {} });

        service
            .getPartialObject('bucket_name', 'object_name', 10)
            .subscribe(
                _ => {
                    unit.string(stub.getCall(0).args[0]).is('bucket_name');
                    unit.string(stub.getCall(0).args[1]).is('object_name');
                    unit.number(stub.getCall(0).args[2]).is(10);
                    unit.number(stub.getCall(0).args[3]).is(0);

                    done();
                },
                e => done(e)
            );
    }

    /**
     * Test `MinioService` function getPartialObject specifying a length
     */
    @test('- Test `MinioService` function getPartialObject specifying a length')
    testMinioServiceGetPartialObjectWithLength(done) {
        const stub = unit.stub().returns(Promise.resolve());

        const service = new MinioService(<any>{ client: { getPartialObject: stub }, config: {} });

        service
            .getPartialObject('bucket_name', 'object_name', 10, 10)
            .subscribe(
                _ => {
                    unit.string(stub.getCall(0).args[0]).is('bucket_name');
                    unit.string(stub.getCall(0).args[1]).is('object_name');
                    unit.number(stub.getCall(0).args[2]).is(10);
                    unit.number(stub.getCall(0).args[3]).is(10);

                    done();
                },
                e => done(e)
            );
    }

    /**
     * Test `MinioService` function fGetObject
     */
    @test('- Test `MinioService` function fGetObject')
    testMinioServiceFGetObject(done) {
        const stub = unit.stub().returns(Promise.resolve());

        const service = new MinioService(<any>{ client: { fGetObject: stub }, config: {} });

        service
            .fGetObject('bucket_name', 'object_name', 'file_path')
            .subscribe(
                _ => {
                    unit.bool(_).isTrue();

                    unit.string(stub.getCall(0).args[0]).is('bucket_name');
                    unit.string(stub.getCall(0).args[1]).is('object_name');
                    unit.string(stub.getCall(0).args[2]).is('file_path');

                    done();
                },
                e => done(e)
            );
    }

    /**
     * Test `MinioService` function putObject with string
     */
    @test('- Test `MinioService` function putObject with string')
    testMinioServicePutObjectWithString(done) {
        const stub = unit.stub().returns(Promise.resolve('OK'));

        const service = new MinioService(<any>{ client: { putObject: stub }, config: {} });

        service
            .putObject('bucket_name', 'object_name', 'stream', null, 'text/plain')
            .subscribe(
                _ => {
                    unit.string(_).is('OK');

                    unit.string(stub.getCall(0).args[0]).is('bucket_name');
                    unit.string(stub.getCall(0).args[1]).is('object_name');
                    unit.string(stub.getCall(0).args[2]).is('stream');

                    done();
                },
                e => done(e)
            );
    }

    /**
     * Test `MinioService` function putObject with buffer
     */
    @test('- Test `MinioService` function putObject with buffer')
    testMinioServicePutObjectWithBuffer(done) {
        const stub = unit.stub().returns(Promise.resolve('OK'));

        const service = new MinioService(<any>{ client: { putObject: stub }, config: {} });

        service
            .putObject('bucket_name', 'object_name', Buffer.from('stream'), null, { contentType: 'application/octet-stream'})
            .subscribe(
                _ => {
                    unit.string(_).is('OK');

                    unit.string(stub.getCall(0).args[0]).is('bucket_name');
                    unit.string(stub.getCall(0).args[1]).is('object_name');
                    unit.bool(stub.getCall(0).args[2] instanceof Buffer).isTrue();

                    done();
                },
                e => done(e)
            );
    }

    /**
     * Test `MinioService` function putObject with ReadableStream
     */
    @test('- Test `MinioService` function putObject with ReadableStream')
    testMinioServicePutObjectWithReadableStream(done) {
        const stub = unit.stub().returns(Promise.resolve('OK'));

        const service = new MinioService(<any>{ client: { putObject: stub }, config: {} });

        service
            .putObject('bucket_name', 'object_name', fs.createReadStream(`${__dirname}/minio.manager.test.ts`))
            .subscribe(
                _ => {
                    unit.string(_).is('OK');

                    unit.string(stub.getCall(0).args[0]).is('bucket_name');
                    unit.string(stub.getCall(0).args[1]).is('object_name');
                    unit.undefined(stub.getCall(0).args[3]);
                    unit.object(stub.getCall(0).args[4]).is({ 'content-type': 'application/octet-stream' });

                    done();
                },
                e => done(e)
            );
    }

    /**
     * Test `MinioService` function fPutObject
     */
    @test('- Test `MinioService` function fPutObject')
    testMinioServiceFPutObject(done) {
        const stub = unit.stub().returns(Promise.resolve('OK'));

        const service = new MinioService(<any>{ client: { fPutObject: stub }, config: {} });

        service
            .fPutObject('bucket_name', 'object_name', 'file_path', 'application/octet-stream')
            .subscribe(
                _ => {
                    unit.string(_).is('OK');

                    unit.string(stub.getCall(0).args[0]).is('bucket_name');
                    unit.string(stub.getCall(0).args[1]).is('object_name');
                    unit.string(stub.getCall(0).args[2]).is('file_path');
                    unit.object(stub.getCall(0).args[3]).is({ contentType: 'application/octet-stream' });

                    done();
                },
                e => done(e)
            );
    }

    /**
     * Test `MinioService` function fPutObject
     */
    @test('- Test `MinioService` function fPutObject')
    testMinioServiceFPutObjectWithMedata(done) {
        const stub = unit.stub().returns(Promise.resolve('OK'));

        const service = new MinioService(<any>{ client: { fPutObject: stub }, config: {} });

        service
            .fPutObject('bucket_name', 'object_name', 'file_path', { meta1: 'meta1' })
            .subscribe(
                _ => {
                    unit.string(_).is('OK');

                    unit.string(stub.getCall(0).args[0]).is('bucket_name');
                    unit.string(stub.getCall(0).args[1]).is('object_name');
                    unit.string(stub.getCall(0).args[2]).is('file_path');
                    unit.object(stub.getCall(0).args[3]).is({ contentType: 'application/octet-stream', meta1: 'meta1' });

                    done();
                },
                e => done(e)
            );
    }

    /**
     * Test `MinioService` function copyObject
     */
    @test('- Test `MinioService` function copyObject')
    testMinioServiceCopyObject(done) {
        const stub = unit.stub().returns(Promise.resolve());

        const service = new MinioService(<any>{ client: { copyObject: stub }, config: {} });

        service
            .copyObject('bucket_name', 'object_name', 'source_object', <any>{})
            .subscribe(
                _ => {
                    unit.string(stub.getCall(0).args[0]).is('bucket_name');
                    unit.string(stub.getCall(0).args[1]).is('object_name');
                    unit.string(stub.getCall(0).args[2]).is('source_object');
                    unit.object(stub.getCall(0).args[3]).is({});

                    done();
                },
                e => done(e)
            );
    }

    /**
     * Test `MinioService` function statObject
     */
    @test('- Test `MinioService` function statObject')
    testMinioServiceStatObject(done) {
        const stub = unit.stub().returns(Promise.resolve());

        const service = new MinioService(<any>{ client: { statObject: stub }, config: {} });

        service
            .statObject('bucket_name', 'object_name')
            .subscribe(
                _ => {
                    unit.string(stub.getCall(0).args[0]).is('bucket_name');
                    unit.string(stub.getCall(0).args[1]).is('object_name');

                    done();
                },
                e => done(e)
            );
    }

    /**
     * Test `MinioService` function removeObject
     */
    @test('- Test `MinioService` function removeObject')
    testMinioServiceRemoveObject(done) {
        const stub = unit.stub().returns(Promise.resolve());

        const service = new MinioService(<any>{ client: { removeObject: stub }, config: {} });

        service
            .removeObject('bucket_name', 'object_name')
            .subscribe(
                _ => {
                    unit.bool(_).isTrue();

                    unit.string(stub.getCall(0).args[0]).is('bucket_name');
                    unit.string(stub.getCall(0).args[1]).is('object_name');

                    done();
                },
                e => done(e)
            );
    }

    /**
     * Test `MinioService` function removeObjects
     */
    @test('- Test `MinioService` function removeObjects')
    testMinioServiceRemoveObjects(done) {
        const stub = unit.stub().returns(Promise.resolve());

        const service = new MinioService(<any>{ client: { removeObjects: stub }, config: { connection: {} } });

        service
            .removeObjects('bucket_name', ['object_name1', 'object_name2', 'object_name3'])
            .subscribe(
                _ => {
                    unit.bool(_).isTrue();

                    unit.string(stub.getCall(0).args[0]).is('bucket_name');
                    unit.array(stub.getCall(0).args[1]).is(['object_name1', 'object_name2', 'object_name3']);

                    done();
                },
                e => done(e)
            );
    }

    /**
     * Test `MinioService` function removeIncompleteUpload
     */
    @test('- Test `MinioService` function removeIncompleteUpload')
    testMinioServiceRemoveIncompleteUpload(done) {
        const stub = unit.stub().returns(Promise.resolve());

        const service = new MinioService(<any>{ client: { removeIncompleteUpload: stub }, config: {} });

        service
            .removeIncompleteUpload('bucket_name', 'object_name')
            .subscribe(
                _ => {
                    unit.bool(_).isTrue();

                    unit.string(stub.getCall(0).args[0]).is('bucket_name');
                    unit.string(stub.getCall(0).args[1]).is('object_name');

                    done();
                },
                e => done(e)
            );
    }

    /**
     * Test `MinioService` function presignedGetObject
     */
    @test('- Test `MinioService` function presignedGetObject')
    testMinioServicePresignedGetObject(done) {
        const stub = unit.stub().returns(Promise.resolve());

        const service = new MinioService(<any>{ client: { presignedGetObject: stub }, config: {} });

        service
            .presignedGetObject('bucket_name', 'object_name')
            .subscribe(
                _ => {
                    unit.string(stub.getCall(0).args[0]).is('bucket_name');
                    unit.string(stub.getCall(0).args[1]).is('object_name');
                    unit.number(stub.getCall(0).args[2]).is(604800);

                    done();
                },
                e => done(e)
            );
    }

    /**
     * Test `MinioService` function presignedUrl
     */
    @test('- Test `MinioService` function presignedUrl')
    testMinioServicePresignedUrl(done) {
        const stub = unit.stub().returns(Promise.resolve());

        const service = new MinioService(<any>{ client: { presignedUrl: stub }, config: {} });

        service
            .presignedUrl('GET', 'bucket_name', 'object_name')
            .subscribe(
                _ => {
                    unit.string(stub.getCall(0).args[0]).is('GET')
                    unit.string(stub.getCall(0).args[1]).is('bucket_name');
                    unit.string(stub.getCall(0).args[2]).is('object_name');
                    unit.number(stub.getCall(0).args[3]).is(604800);

                    done();
                },
                e => done(e)
            );
    }

    /**
     * Test `MinioService` function presignedPutObject
     */
    @test('- Test `MinioService` function presignedPutObject')
    testMinioServicePresignedPutObject(done) {
        const stub = unit.stub().returns(Promise.resolve());

        const service = new MinioService(<any>{ client: { presignedPutObject: stub }, config: {} });

        service
            .presignedPutObject('bucket_name', 'object_name')
            .subscribe(
                _ => {
                    unit.string(stub.getCall(0).args[0]).is('bucket_name');
                    unit.string(stub.getCall(0).args[1]).is('object_name');
                    unit.number(stub.getCall(0).args[2]).is(604800);

                    done();
                },
                e => done(e)
            );
    }

    /**
     * Test `MinioService` function presignedPostPolicy
     */
    @test('- Test `MinioService` function presignedPostPolicy')
    testMinioServicePresignedPostPolicy(done) {
        const stub = unit.stub().returns(Promise.resolve());

        const service = new MinioService(<any>{ client: { presignedPostPolicy: stub }, config: {} });

        service
            .presignedPostPolicy(<any>{})
            .subscribe(
                _ => {
                    unit.object(stub.getCall(0).args[0]).is({});
                    done();
                },
                e => done(e)
            );
    }

    /**
     * Test `MinioService` function getBucketNotification
     */
    @test('- Test `MinioService` function getBucketNotification')
    testMinioServiceGetBucketNotification(done) {
        const stub = unit.stub().returns(Promise.resolve());

        const service = new MinioService(<any>{ client: { getBucketNotification: stub }, config: {} });

        service
            .getBucketNotification('bucket_name')
            .subscribe(
                _ => {
                    unit.string(stub.getCall(0).args[0]).is('bucket_name');
                    done();
                },
                e => done(e)
            );
    }

    /**
     * Test `MinioService` function setBucketNotification
     */
    @test('- Test `MinioService` function setBucketNotification')
    testMinioServiceSetBucketNotification(done) {
        const stub = unit.stub().returns(Promise.resolve());

        const service = new MinioService(<any>{ client: { setBucketNotification: stub }, config: {} });

        service
            .setBucketNotification('bucket_name', {})
            .subscribe(
                _ => {
                    unit.bool(_).isTrue();

                    unit.string(stub.getCall(0).args[0]).is('bucket_name');
                    unit.object(stub.getCall(0).args[1]).is({});

                    done();
                },
                e => done(e)
            );
    }

    /**
     * Test `MinioService` function removeAllBucketNotification
     */
    @test('- Test `MinioService` function removeAllBucketNotification')
    testMinioServiceRemoveAllBucketNotification(done) {
        const stub = unit.stub().returns(Promise.resolve());

        const service = new MinioService(<any>{ client: { removeAllBucketNotification: stub }, config: {} });

        service
            .removeAllBucketNotification('bucket_name')
            .subscribe(
                _ => {
                    unit.bool(_).isTrue();

                    unit.string(stub.getCall(0).args[0]).is('bucket_name');

                    done();
                },
                e => done(e)
            );
    }

    /**
     * Test `MinioService` function listenBucketNotification
     */
    @test('- Test `MinioService` function listenBucketNotification')
    testMinioServiceListenBucketNotification() {
        const stub = unit.stub().returns();

        const service = new MinioService(<any>{ client: { listenBucketNotification: stub }, config: {} });

        service.listenBucketNotification('bucket_name', 'prefix', 'suffix', ['event:one']);

        unit.string(stub.getCall(0).args[0]).is('bucket_name');
        unit.string(stub.getCall(0).args[1]).is('prefix');
        unit.string(stub.getCall(0).args[2]).is('suffix');
        unit.array(stub.getCall(0).args[3]).is(['event:one']);
    }

    /**
     * Test `MinioService` function getBucketPolicy
     */
    @test('- Test `MinioService` function getBucketPolicy')
    testMinioServiceGetBucketPolicy(done) {
        const stub = unit.stub().returns(Promise.resolve());

        const service = new MinioService(<any>{ client: { getBucketPolicy: stub }, config: {} });

        service
            .getBucketPolicy('bucket_name')
            .subscribe(
                _ => {
                    unit.string(stub.getCall(0).args[0]).is('bucket_name');

                    done();
                },
                e => done(e)
            );
    }

    /**
     * Test `MinioService` function setBucketPolicy
     */
    @test('- Test `MinioService` function setBucketPolicy')
    testMinioServiceSetBucketPolicy(done) {
        const stub = unit.stub().returns(Promise.resolve());

        const service = new MinioService(<any>{ client: { setBucketPolicy: stub }, config: { connection: {} } });

        service
            .setBucketPolicy('bucket_name', MinioPolicy.NONE)
            .subscribe(
                _ => {
                    unit.bool(_).isTrue();

                    unit.string(stub.getCall(0).args[0]).is('bucket_name');
                    unit.string(stub.getCall(0).args[1]).is(MinioPolicy.NONE);

                    done();
                },
                e => done(e)
            );
    }
}
