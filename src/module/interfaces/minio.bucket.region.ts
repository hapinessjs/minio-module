export enum MinioBucketRegion {
    US_EAST_1 = 'us-east-1',
    US_WEST_1 = 'us-west-1',
    US_WEST_2 = 'us-west-2',
    EU_WEST_1 = 'eu-west-1',
    EU_CENTRAL_1 = 'eu-central-1',
    AP_SOUTHEAST_1 = 'ap-southeast-1',
    AP_SOUTHEAST_2 = 'ap-southeast-2',
    AP_NORTHEAST_1 = 'ap-northeast-1',
    SA_EAST_1 = 'sa-east-1',
    CN_NORTH_1 = 'cn-north-1'
}

export function stringToMinioBucketRegion(value: string): MinioBucketRegion {
    switch (value) {
        case 'us-east-1': return MinioBucketRegion.US_EAST_1;
        case 'us-west-1': return MinioBucketRegion.US_WEST_1;
        case 'us-west-2': return MinioBucketRegion.US_WEST_2;
        case 'eu-west-1': return MinioBucketRegion.EU_WEST_1;
        case 'eu-central-1': return MinioBucketRegion.EU_CENTRAL_1;
        case 'ap-southeast-1': return MinioBucketRegion.AP_SOUTHEAST_1;
        case 'ap-southeast-2': return MinioBucketRegion.AP_SOUTHEAST_2;
        case 'ap-northeast-1': return MinioBucketRegion.AP_NORTHEAST_1;
        case 'sa-east-1': return MinioBucketRegion.SA_EAST_1;
        case 'cn-north-1': return MinioBucketRegion.CN_NORTH_1;
        /* DEFAULT REGION */
        default: return MinioBucketRegion.US_EAST_1;
    }
}
