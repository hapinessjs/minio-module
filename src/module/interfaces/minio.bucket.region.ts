import { Region } from 'minio';
export enum MinioBucketRegion {
    'us-east-1',
    'us-west-1',
    'us-west-2',
    'eu-west-1',
    'eu-central-1',
    'ap-southeast-1',
    'ap-southeast-2',
    'ap-northeast-1',
    'sa-east-1',
    'cn-north-1'
}

export function stringToMinioBucketRegion(value: string): Region {
    if (value && value in MinioBucketRegion) {
        return value;
    }
    return 'us-east-1';
}
