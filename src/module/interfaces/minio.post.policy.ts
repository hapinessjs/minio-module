export interface MinioPostPolicy {
    policy: {
        conditions: any[];
        expiration: string;
    };
    formData: any;

    setExpires(date: Date): void;
    setKey(objectName: string): void;
    setKeyStartsWith(prefix: string): void;
    setBucket(bucketName: string): void;
    setContentType(type: string): void;
    setContentLengthRange(min: number, max: number): void;
}
