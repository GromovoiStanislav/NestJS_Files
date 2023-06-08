import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "node:path";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "upload", "avatar")
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async () =>
        ({
          type: "postgres",
          host: process.env.HOST_DATABASE,
          port: Number(process.env.POSTGRES_PORT),
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DB,
          autoLoadEntities: true,
          synchronize: true
        })
    }),
    UserModule
  ]
})
export class AppModule {
}
