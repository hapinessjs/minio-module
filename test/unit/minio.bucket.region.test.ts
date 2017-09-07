
/**
 * @see https://github.com/pana-cc/mocha-typescript
 */
import { test, suite, only } from 'mocha-typescript';

/**
 * @see http://unitjs.com/
 */
import * as unit from 'unit.js';
import * as minio from 'minio';

import { extractMetadata } from '@hapiness/core/core';
import { Hapiness, HapinessModule, OnStart, Inject } from '@hapiness/core';
import { HttpServerExt, Server } from '@hapiness/core/extensions/http-server';

import { Observable } from 'rxjs/Observable';

import { MinioBucketRegion, stringToMinioBucketRegion } from '../../src';

@suite('- Unit tests of MinioBucketRegion')
class MinioManagerTest {

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
     * Test `stringToMinioBucketRegion` function in `MinioBucketRegion` file
     */
    @test('- Test `stringToMinioBucketRegion` function in `MinioBucketRegion` file')
    testMinioManagerCorrectlyInstanciated() {
        unit.string(stringToMinioBucketRegion('us-east-1')).is(MinioBucketRegion.US_EAST_1);
        unit.string(stringToMinioBucketRegion('us-west-1')).is(MinioBucketRegion.US_WEST_1);
        unit.string(stringToMinioBucketRegion('us-west-2')).is(MinioBucketRegion.US_WEST_2);
        unit.string(stringToMinioBucketRegion('eu-west-1')).is(MinioBucketRegion.EU_WEST_1);
        unit.string(stringToMinioBucketRegion('eu-central-1')).is(MinioBucketRegion.EU_CENTRAL_1);
        unit.string(stringToMinioBucketRegion('ap-southeast-1')).is(MinioBucketRegion.AP_SOUTHEAST_1);
        unit.string(stringToMinioBucketRegion('ap-southeast-2')).is(MinioBucketRegion.AP_SOUTHEAST_2);
        unit.string(stringToMinioBucketRegion('ap-northeast-1')).is(MinioBucketRegion.AP_NORTHEAST_1);
        unit.string(stringToMinioBucketRegion('sa-east-1')).is(MinioBucketRegion.SA_EAST_1);
        unit.string(stringToMinioBucketRegion('cn-north-1')).is(MinioBucketRegion.CN_NORTH_1);

        unit.string(stringToMinioBucketRegion('unknown')).is(MinioBucketRegion.US_EAST_1);
    }
}