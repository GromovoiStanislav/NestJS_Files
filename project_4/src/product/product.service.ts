import { S3Service } from "../aws-s3/s3.service";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entity/product";
import { Repository } from "typeorm";
import { ProductDto } from "./dto/product.dto";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private s3Service: S3Service,
  ) {
  }


  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.find();
  }


  async createProduct(productDto: ProductDto): Promise<Product> {
    return this.productRepository.save(productDto);
  }


  async addFileToProduct(file: Express.Multer.File, id: number) {
    const bucketKey = `${file.fieldname}${Date.now()}`;
    const fileUrl = await this.s3Service.uploadFile(file, bucketKey);
    await this.productRepository.update({ id }, { image: fileUrl });
  }

}