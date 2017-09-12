import { HapinessModule } from '@hapiness/core';
import { MinioService } from './services';

@HapinessModule({
    version: '1.0.0-rc.7',
    declarations: [],
    providers: [],
    exports: [MinioService]
})
export class MinioModule {}
