import { CoreModule, Extension, ExtensionWithConfig, OnExtensionLoad } from '@hapiness/core';

import { Observable } from 'rxjs/Observable';

import { MinioConfig } from './interfaces';
import { MinioManager } from './managers';

function stringToBool(value: string | boolean): boolean {
    if (!value) {
        return false;
    }

    if (typeof value === 'string') {
        return value === 'true';
    }

    return value;
}

function stringToNumber(value: string | number): number {
    if (typeof value === 'string') {
        return parseInt(value, 10);
    }

    return value;
}

function parseMinioConfig(config: MinioConfig): MinioConfig {
    return {
        connection: {
            ...config.connection,
            useSSL: stringToBool(config.connection.useSSL),
            port: stringToNumber(config.connection.port),
        },
    }
}

export class MinioExt implements OnExtensionLoad {

    public static setConfig(config: MinioConfig): ExtensionWithConfig {
        return {
            token: MinioExt,
            config: parseMinioConfig(config)
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
            .of(new MinioManager(parseMinioConfig(config)))
            .map(_ => ({
                instance: this,
                token: MinioExt,
                value: _
            }));
    }
}
