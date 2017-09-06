
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

import { MinioManager } from '../../src';

@suite('- Unit tests of MinioManager')
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
     * Test if `MinioManager` is correctly integrated and has functions
     */
    @test('- Test if `MinioModule` is correctly instanciated')
    testMinioManagerCorrectlyInstanciated() {
        class Fake { constructor() { } }

        const mock = unit.mock(minio);

        mock
            .expects('Client')
            .withArgs({ endPoint: 'my_endpoint' })
            .returns(new Fake());

        mock
            .expects('CopyConditions')
            .returns(new Fake());

        const instance = new MinioManager({ connection: { endPoint: 'my_endpoint' } });

        unit.bool(instance.client instanceof Fake).isTrue();
        unit.bool(new (instance.minio).CopyConditions() instanceof Fake).isTrue();
        unit.object(instance.config).is({ connection: { endPoint: 'my_endpoint' } });

        mock.verify();
        mock.restore();
    }
}
