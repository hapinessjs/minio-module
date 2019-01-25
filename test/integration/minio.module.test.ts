
/**
 * @see https://github.com/pana-cc/mocha-typescript
 */
import { test, suite } from 'mocha-typescript';

/**
 * @see http://unitjs.com/
 */
import * as unit from 'unit.js';

import { Hapiness, HapinessModule, OnStart } from '@hapiness/core';

import { MinioExt, MinioModule, MinioService } from '../../src';

@suite('- Integration tests of MinioModule')
export class MinioModuleIntegrationTest {

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
     * Test if `MinioModule` is correctly integrated and has functions
     */
    @test('- Test if `MinioModule` is correctly integrated and has functions')
    testMinioModule(done) {
        @HapinessModule({
            version: '1.0.0',
            providers: [],
            imports: [MinioModule]
        })
        class MinioModuleTest implements OnStart {
            constructor(
                private _minio: MinioService
            ) { }

            onStart(): void {
                unit.function(this._minio.newMinioCopyCondition);
                unit.function(this._minio.newPostPolicy);
                unit.function(this._minio.makeBucket);
                unit.function(this._minio.bucketExists);
                unit.function(this._minio.listBuckets);
                unit.function(this._minio.listObjects);
                unit.function(this._minio.listObjectsV2);
                unit.function(this._minio.listIncompleteUploads);
                unit.function(this._minio.getObject);
                unit.function(this._minio.getPartialObject);
                unit.function(this._minio.fGetObject);
                unit.function(this._minio.putObject);
                unit.function(this._minio.fPutObject);
                unit.function(this._minio.copyObject);
                unit.function(this._minio.statObject);
                unit.function(this._minio.removeObject);
                unit.function(this._minio.removeIncompleteUpload);
                unit.function(this._minio.presignedGetObject);
                unit.function(this._minio.presignedPutObject);
                unit.function(this._minio.presignedPostPolicy);
                unit.function(this._minio.getBucketNotification);
                unit.function(this._minio.setBucketNotification);
                unit.function(this._minio.removeAllBucketNotification);
                unit.function(this._minio.listenBucketNotification);
                unit.function(this._minio.getBucketPolicy);
                unit.function(this._minio.setBucketPolicy);

                done();
            }
        }

        Hapiness.bootstrap(MinioModuleTest, [
            MinioExt.setConfig(
                {
                    connection: {
                        endPoint: '127.0.0.1',
                        accessKey: '',
                        secretKey: '',
                        port: 9000,
                        useSSL: false
                    }
                }
            )
        ]);
    }
}
