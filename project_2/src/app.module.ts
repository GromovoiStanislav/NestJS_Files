import {Module} from '@nestjs/common';
import {UploadModule} from './upload/upload.module';
import {ConfigModule} from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        UploadModule,
    ],
})
export class AppModule {
}
