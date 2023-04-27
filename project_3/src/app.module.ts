import {Module} from '@nestjs/common';
import {UsersModule} from './users/users.module';
import {FilesModule} from './files/files.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserEntity} from './users/entities/user.entity';
import {FileEntity} from './files/entities/file.entity';
import {ConfigModule} from '@nestjs/config';
import {AuthModule} from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        // TypeOrmModule.forRoot({
        //   type: 'postgres',
        //   host: process.env.DB_HOST,
        //   port: Number(process.env.DB_PORT) || 5432,
        //   username: process.env.DB_USER,
        //   password: process.env.DB_PASSWORD,
        //   database: process.env.DB_NAME,
        //   entities: [UserEntity, FileEntity],
        //   synchronize: true,
        // }),
        TypeOrmModule.forRoot({
            type: "sqlite",
            database: ":memory:",
            entities: [UserEntity, FileEntity],
            synchronize: true,
        }),
        UsersModule,
        FilesModule,
        AuthModule,
    ],
})
export class AppModule {
}
