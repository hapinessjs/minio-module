import * as minio from 'minio';

import { MinioConfig } from '../interfaces';

export class MinioManager {

    private _client: any;
    private _config: MinioConfig;

    constructor(config: MinioConfig) {
        this._client = new minio.Client(config.connection);
        this._config = config;
    }

    get minio(): any {
        return minio;
    }

    get client(): any {
        return this._client;
    }

    get config(): MinioConfig {
        return this._config;
    }
}
