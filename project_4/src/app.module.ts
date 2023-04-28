import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AwsS3Module } from "./aws-s3/s3.module";
import { ProductModule } from "./product/product.module";


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: ":memory:",
      autoLoadEntities: true,
      synchronize: true,
    }),
    AwsS3Module,
    ProductModule
  ],
})
export class AppModule {}
