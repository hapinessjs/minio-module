<img src="http://bit.ly/2mxmKKI" width="500" alt="Hapiness" />

<div style="margin-bottom:20px;">
<div style="line-height:60px">
    <a href="https://travis-ci.org/hapinessjs/minio-module.svg?branch=master">
        <img src="https://travis-ci.org/hapinessjs/minio-module.svg?branch=master" alt="build" />
    </a>
    <a href="https://coveralls.io/github/hapinessjs/minio-module?branch=master">
        <img src="https://coveralls.io/repos/github/hapinessjs/minio-module/badge.svg?branch=master" alt="coveralls" />
    </a>
    <a href="https://david-dm.org/hapinessjs/minio-module">
        <img src="https://david-dm.org/hapinessjs/minio-module.svg" alt="dependencies" />
    </a>
    <a href="https://david-dm.org/hapinessjs/minio-module?type=dev">
        <img src="https://david-dm.org/hapinessjs/minio-module/dev-status.svg" alt="devDependencies" />
    </a>
</div>
<div>
    <a href="https://www.typescriptlang.org/docs/tutorial.html">
        <img src="https://cdn-images-1.medium.com/max/800/1*8lKzkDJVWuVbqumysxMRYw.png"
             align="right" alt="Typescript logo" width="50" height="50" style="border:none;" />
    </a>
    <a href="http://reactivex.io/rxjs">
        <img src="http://reactivex.io/assets/Rx_Logo_S.png"
             align="right" alt="ReactiveX logo" width="50" height="50" style="border:none;" />
    </a>
    <a href="http://hapijs.com">
        <img src="http://bit.ly/2lYPYPw"
             align="right" alt="Hapijs logo" width="75" style="border:none;" />
    </a>
</div>
</div>

# Minio Module

`Minio` module for the Hapiness framework.

## Table of contents


* [Using your module inside Hapiness application](#using-your-module-inside-hapiness-application)
	* [`yarn` or `npm` it in your `package.json`](#yarn-or-npm-it-in-your-package)
	* [Importing `MinioModule` from the library](#importing-miniomodule-from-the-library)
	* [Using `Minio` inside your application](#using-minio-inside-your-application)
* [Contributing](#contributing)
* [Change History](#change-history)
* [Maintainers](#maintainers)
* [License](#license)

## Using your module inside Hapiness application


### `yarn` or `npm` it in your `package.json`

```bash
$ npm install --save @hapiness/core @hapiness/minio rxjs

or

$ yarn add @hapiness/core @hapiness/minio rxjs
```

```typescript
"dependencies": {
    "@hapiness/core": "^1.3.0",
    "@hapiness/minio": "^1.0.0",
    "rxjs": "^5.5.5"
    //...
}
//...
```

[Back to top](#table-of-contents)


### Importing `MinioModule` from the library

This module provide an Hapiness extension for Minio.
To use it, simply register it during the `bootstrap` step of your project and provide the `MinioExt` with its config

```typescript
@HapinessModule({
    version: '1.0.0',
    providers: [],
    declarations: [],
    imports: [MinioModule]
})
class MyApp implements OnStart {
    constructor() {}
    onStart() {}
}

Hapiness
    .bootstrap(
        MyApp,
        [
            /* ... */
            MinioExt.setConfig(
                {
                    connection: {
                      endPoint: 'minio.mydomain.com',
                      port: 443,
                      useSSL: true,
                      accessKey: 'access_key',
                      secretKey: 'secret_key',
                      region: 'us-east-1'
                    },
                }
            )
        ]
    )
    .catch(err => {
        /* ... */
    });
```

You need to provide the connection information under the `connection` key in the config object. If you dont provide a `region` in the `connection` object, nor when calling functions that could use one, the value `us-east-1` will be used.

Allowed region values are:

- us-east-1
- us-west-1
- us-west-2
- eu-west-1
- eu-central-1
- ap-southeast-1
- ap-southeast-2
- ap-northeast-1
- sa-east-1
- cn-north-1

[Back to top](#table-of-contents)

### Using `Minio` inside your application

To use `minio`, you need to inject inside your providers the `MinioService`.

**NOTE:** all functions in the api return `rxjs` Observable

```typescript
class FooProvider {
    constructor(private _minio: MinioService) {}

    createBucketIfNotExists(bucketName: string): Observable<boolean> {
    	return this
            ._minio
            .bucketExists(bucketName)
            .switchMap(
                _ => !!_ ?
                    Observable.of(false) :
                    this._minio.makeBucket(bucketName)
            );
    }
}
```

[Back to top](#table-of-contents)


## `MinioService` documentation

**NOTES:**

- All functions in the api return `rxjs` Observable
- We followed the `minio` `nodejs` lib, so for more information, please refer to [the official documentation](https://docs.minio.io/docs/javascript-client-api-reference)

```typescript
/* Get a new Copy Condition instance */
public newMinioCopyCondition(): minio.CopyConditions;

/* Get a new Post Policy instance */
public newMinioPostPolicy(): minio.PostPolicy;

/* Create a bucket */
public makeBucket(bucketName: string, region?: minio.Region): Observable<boolean>;

/* Check if a bucket already exists */
public bucketExists(bucketName: string): Observable<boolean>;

/* List all buckets */
public listBuckets(): Observable<minio.BucketItemFromList[]>;

/* Remove a bucket given a bucketName */
public removeBucket(bucketName: string): Observable<boolean>;

/* Lists all objects in a bucket */
public listObjects(bucketName: string, prefix: string = '', recursive: boolean = false): Observable<minio.BucketItem>;

/* Lists all objects in a bucket using S3 listing objects V2 API */
public listObjectsV2(bucketName: string, prefix: string = '', recursive: boolean = false): Observable<minio.BucketItem>;

/* Lists partially uploaded objects in a bucket */
public listIncompleteUploads(bucketName: string, prefix: string = '', recursive: boolean = false):
        Observable<minio.IncompleteUploadedBucketItem>;

/* Downloads an object as a stream */
public getObject(bucketName: string, objectName: string): Observable<Stream>;

/* Downloads the specified range bytes of an object as a stream */
public getPartialObject(bucketName: string, objectName: string, offset: number, length: number = 0):
        Observable<Stream>;

/* Downloads and saves the object as a file in the local filesystem */
public fGetObject(bucketName: string, objectName: string, filePath: string): Observable<boolean>;

/* Uploads an object from a stream/Buffer */
public putObject(bucketName: string, objectName: string, stream: Readable | string | Buffer, size?: number, metadata?: minio.ItemBucketMetadata | string): Observable<string>;

/* Uploads contents from a file to objectName */
public fPutObject(bucketName: string, objectName: string, filePath: string, metadata?: minio.ItemBucketMetadata | string): Observable<string>;

/* Copy a source object into a new object in the specied bucket */
public copyObject(bucketName: string, objectName: string, sourceObject: string, conditions: minio.CopyConditions):
        Observable<minio.BucketItemCopy>;

/* Gets metadata of an object */
public statObject(bucketName: string, objectName: string): Observable<minio.BucketItemStat>;

/* Removes an object */
public removeObject(bucketName: string, objectName: string): Observable<boolean>;

/* Remove multiple objects of a bucket */
public removeObjects(bucketName: string, objectNames: string[]): Observable<boolean>;

/* Removes a partially uploaded object */
public removeIncompleteUpload(bucketName: string, objectName: string): Observable<boolean>;

/*
 * Generate a presigned URLs for temporary download/upload access to private objects.
 * Generates a presigned URL for the provided HTTP method, 'httpMethod'.
 * Browsers/Mobile clients may point to this URL to directly download objects even if the bucket is private.
 * This presigned URL can have an associated expiration time in seconds after which the URL is no longer valid.
 * The default value is 7 days.
 */
public presignedUrl(httpMethod: string, bucketName: string, objectName: string, expiry: number = 604800, reqParams?: { [key: string]: any; }): Observable<string>;

/*
 * Generates a presigned URL for HTTP GET operations.
 * Browsers/Mobile clients may point to this URL to directly download objects even if the bucket is private.
 * This presigned URL can have an associated expiration time in seconds after which the URL is no longer valid.
 * The default expiry is set to 7 days
 */
public presignedGetObject(bucketName: string, objectName: string, expiry: number = 604800): Observable<string>;

/*
 * Generates a presigned URL for HTTP PUT operations.
 * Browsers/Mobile clients may point to this URL to upload objects directly to a bucket even if it is private.
 * This presigned URL can have an associated expiration time in seconds after which the URL is no longer valid.
 * The default expiry is set to 7 days
 */
public presignedPutObject(bucketName: string, objectName: string, expiry: number = 604800): Observable<string>;

/*
 * Allows setting policy conditions to a presigned URL for POST operations.
 * Policies such as bucket name to receive object uploads, key name prefixes, expiry policy may be set
 */
public presignedPostPolicy(policy: minio.PostPolicy): Observable<minio.PostPolicyResult>;

/*
 * Fetch the notification configuration stored in the S3 provider and that belongs to
 * the specified bucket name
 */
public getBucketNotification(bucketName: string): Observable<minio.NotificationConfig>;

/*
 * Upload a user-created notification configuration and associate it to the specified bucket name
 */
public setBucketNotification(bucketName: string, bucketNotificationConfig: any): Observable<boolean>;

/*
 * Remove the bucket notification configuration associated to the specified bucket
 */
public removeAllBucketNotification(bucketName: string): Observable<boolean>;

/*
 * Listen for notifications on a bucket.
 * Additionally one can provider filters for prefix, suffix and events.
 * There is no prior set bucket notification needed to use this API.
 * This is an Minio extension API where unique identifiers are regitered and unregistered
 * by the server automatically based on incoming requests
 */
public listenBucketNotification(bucketName: string, prefix: string, suffix: string, events: string[]): EventEmitter;

/*
 * Get the bucket policy associated with the specified bucket.
 * If objectPrefix is not empty, the bucket policy will be filtered based on object permissions as well.
 */
public getBucketPolicy(bucketName: string): Observable<string>;

/*
 * Set the bucket policy associated with the specified bucket.
 * If objectPrefix is not empty, the bucket policy will only be assigned to objects that fit the given prefix
 */
public setBucketPolicy(bucketName: string, bucketPolicy: string): Observable<boolean>;
```

[Back to top](#table-of-contents)

## Contributing

To set up your development environment:

1. clone the repo to your workspace,
2. in the shell `cd` to the main folder,
3. hit `npm or yarn install`,
4. run `npm or yarn run test`.
    * It will lint the code and execute all tests.
    * The test coverage report can be viewed from `./coverage/lcov-report/index.html`.
    
[Back to top](#table-of-contents)

## Change History

* v2.0.1 (2019-01-29)
    * fixed 'content-type' key in metadata.
* v2.0.0 (2018-10-16)
    * Upgraded minio to 7.0.1
    * Now use "useSSL" instead of "secure"
    * Integrated minio's types
    * Added Functions:
        * removeBucket()
        * removeObjects()
        * PresignedUrl()
    * Renamed newMinioPostPolicy() to newPostPolicy()
    * Updated README
* v1.0.0 (2017-12-14)
    * `MinIO` module implementation
    * Related tests
    * Documentation

[Back to top](#table-of-contents)

## Maintainers

<table>
    <tr>
        <td colspan="5" align="center"><a href="https://www.tadaweb.com"><img src="http://bit.ly/2xHQkTi" width="117" alt="tadaweb" /></a></td>
    </tr>
    <tr>
        <td align="center"><a href="https://github.com/Juneil"><img src="https://avatars3.githubusercontent.com/u/6546204?v=3&s=117" width="117"/></a></td>
        <td align="center"><a href="https://github.com/antoinegomez"><img src="https://avatars3.githubusercontent.com/u/997028?v=3&s=117" width="117"/></a></td>
        <td align="center"><a href="https://github.com/reptilbud"><img src="https://avatars3.githubusercontent.com/u/6841511?v=3&s=117" width="117"/></a></td>
        <td align="center"><a href="https://github.com/njl07"><img src="https://avatars3.githubusercontent.com/u/1673977?v=3&s=117" width="117"/></a></td>
        <td align="center"><a href="https://github.com/xmaIIoc"><img src="https://avatars3.githubusercontent.com/u/1898461?v=4&s=117" width="117"/></a></td>
    </tr>
    <tr>
        <td align="center"><a href="https://github.com/Juneil">Julien Fauville</a></td>
        <td align="center"><a href="https://github.com/antoinegomez">Antoine Gomez</a></td>
        <td align="center"><a href="https://github.com/reptilbud">Sébastien Ritz</a></td>
        <td align="center"><a href="https://github.com/njl07">Nicolas Jessel</a></td>
        <td align="center"><a href="https://github.com/xmaIIoc">Florent Bennani</a></td>
    </tr>
</table>

[Back to top](#table-of-contents)

## License

Copyright (c) 2017 **Hapiness** Licensed under the [MIT license](https://github.com/hapinessjs/minio-module/blob/master/LICENSE.md).

[Back to top](#table-of-contents)
