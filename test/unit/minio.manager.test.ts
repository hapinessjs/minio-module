
/**
 * @see https://github.com/pana-cc/mocha-typescript
 */
import { test, suite } from 'mocha-typescript';

/**
 * @see http://unitjs.com/
 */
import * as unit from 'unit.js';
import * as minio from 'minio';

import { MinioManager } from '../../src';

@suite('- Unit tests of MinioManager')
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
     * Test if `MinioManager` is correctly integrated and has functions
     */
    @test('- Test if `MinioModule` is correctly instanciated')
    testMinioManagerCorrectlyInstanciated() {
        class Fake { constructor() { } }

        const mock = unit.mock(minio);

        mock
            .expects('Client')
            .withArgs({ endPoint: 'my_endpoint', accessKey: 'accessKey', secretKey: 'secretKey' })
            .returns(new Fake());

        mock
            .expects('CopyConditions')
            .returns(new Fake());

        const instance = new MinioManager({ connection: { endPoint: 'my_endpoint', accessKey: 'accessKey', secretKey: 'secretKey' } });

        unit.bool(instance.client instanceof Fake).isTrue();
        unit.bool(new (instance.minio).CopyConditions() instanceof Fake).isTrue();
        unit.object(instance.config).is({ connection: { endPoint: 'my_endpoint', accessKey: 'accessKey', secretKey: 'secretKey' } });

        mock.verify();
        mock.restore();
    }
}
