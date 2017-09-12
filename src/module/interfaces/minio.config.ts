import { MinioConnect } from './minio.connect';

export interface MinioConfig {
    connection: MinioConnect;
    default_region?: string;
}
