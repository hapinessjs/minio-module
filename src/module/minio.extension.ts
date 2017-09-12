import { CoreModule, Extension, ExtensionWithConfig, OnExtensionLoad } from '@hapiness/core';

import { Observable } from 'rxjs/Observable';

import { MinioConfig } from './interfaces';
import { MinioManager } from './managers';

export class MinioExt implements OnExtensionLoad {

    public static setConfig(config: MinioConfig): ExtensionWithConfig {
        return {
            token: MinioExt,
            config
        };
    }

    /**
     * Initilization of the extension
     * Create the manager instance
     *
     * @param  {CoreModule} module
     * @param  {MinioConfig} config
     *
     * @returns Observable
     */
    onExtensionLoad(module: CoreModule, config: MinioConfig): Observable<Extension> {
        return Observable
            .of(new MinioManager(config))
            .map(_ => ({
                instance: this,
                token: MinioExt,
                value: _
            }));
    }
}
