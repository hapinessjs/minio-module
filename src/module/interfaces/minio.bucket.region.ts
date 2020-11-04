import { Region } from 'minio';

export enum MinioBucketRegion {
    'us-east-1',
    'us-east-2',
    'us-west-1',
    'us-west-2',

    'af-south-1',

    'ap-east-1',
    'ap-south-1',
    'ap-northeast-1',
    'ap-northeast-2',
    'ap-northeast-3',
    'ap-southeast-1',
    'ap-southeast-2',

    'ca-central-1',

    'cn-north-1',
    'cn-northwest-1',

    'eu-central-1',
    'eu-west-1',
    'eu-west-2',
    'eu-south-1',
    'eu-west-3',
    'eu-north-1',

    'me-south-1',
    'sa-east-1'
}

export function stringToMinioBucketRegion(value: string): Region {
    if (value && value in MinioBucketRegion) {
        return value;
    }
    return 'us-east-1';
}
