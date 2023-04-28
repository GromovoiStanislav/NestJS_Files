import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AwsS3Module } from "src/aws-s3/s3.module";
import { Product } from "./entity/product";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    TypeOrmModule.forFeature([Product]),
    AwsS3Module
  ],
  exports: [TypeOrmModule]
})
export class ProductModule {
}