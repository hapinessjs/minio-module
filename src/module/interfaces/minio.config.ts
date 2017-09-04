import { MinioConnect } from './minio.connect';
import { MinioBucketRegion } from './minio.bucket.region';

export interface MinioConfig {
    connection: MinioConnect;
    default_region?: MinioBucketRegion;
}
