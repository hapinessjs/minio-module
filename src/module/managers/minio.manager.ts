import * as minio from 'minio';

import { MinioConfig } from '../interfaces';

export class MinioManager {

    private _client: any;
    private _config: MinioConfig;

    constructor(config: MinioConfig) {
        this._client = new minio.Client(config.connection);
        this._config = config;
    }

    get minio(): typeof minio {
        return minio;
    }

    get client(): minio.Client {
        return this._client;
    }

    get config(): MinioConfig {
        return this._config;
    }
}
