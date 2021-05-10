
/**
 * @see https://github.com/pana-cc/mocha-typescript
 */
import { test, suite } from 'mocha-typescript';

/**
 * @see http://unitjs.com/
 */
import * as unit from 'unit.js';

import { stringToMinioBucketRegion } from '../../src';

@suite('- Unit tests of MinioBucketRegion')
export class MinioManagerTest {

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
        unit.string(stringToMinioBucketRegion('us-east-1')).is('us-east-1');
        unit.string(stringToMinioBucketRegion('us-west-1')).is('us-west-1');
        unit.string(stringToMinioBucketRegion('us-west-2')).is('us-west-2');
        unit.string(stringToMinioBucketRegion('eu-west-1')).is('eu-west-1');
        unit.string(stringToMinioBucketRegion('eu-central-1')).is('eu-central-1');
        unit.string(stringToMinioBucketRegion('ap-southeast-1')).is('ap-southeast-1');
        unit.string(stringToMinioBucketRegion('ap-southeast-2')).is('ap-southeast-2');
        unit.string(stringToMinioBucketRegion('ap-northeast-1')).is('ap-northeast-1');
        unit.string(stringToMinioBucketRegion('sa-east-1')).is('sa-east-1');
        unit.string(stringToMinioBucketRegion('cn-north-1')).is('cn-north-1');

        unit.string(stringToMinioBucketRegion(undefined)).is('us-east-1');
        unit.string(stringToMinioBucketRegion('')).is('us-east-1');
    }
}
