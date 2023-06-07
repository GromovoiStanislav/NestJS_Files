import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as fs from "node:fs";
import { Repository } from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "./entities/product.entity";

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>
  ) {
  }


  async create(data: CreateProductDto) {
    const isProductExists = await this.productRepository.findOneBy({ productName: data.productName });
    if (isProductExists) {
      throw new ConflictException("Product Exists");
    }
    const createProduct = this.productRepository.create(data);
    return this.productRepository.save(createProduct);
  }


  async findAll() {
    return this.productRepository.find();
  }


  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException("Product not Exists");
    }
    return product;
  }


  async update(id: string, data: UpdateProductDto) {
    await this.productRepository.update(id, data);
    return this.findOne(id);
  }


  async remove(id: string) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException("Product not Exists");
    }

    if (product.productImage !== "" || product.productImage !== null) {
      const linkFile = `${process.cwd()}/uploads/market-images/${product.productImage}`;
      fs.unlink(linkFile, (err) => {
        if (err) return err;
      });
    }

    await this.productRepository.delete(id);

    return product;
    // return {
    //   message: `Product ${product.productName} successfully removed`
    // };
  }


  async updateProductImage(id: string, filename: string) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException("Product not Exists");
    }

    if (product.productImage === "" || product.productImage === null) {
      await this.productRepository.update(id, {
        productImage: filename
      });
    } else {
      const linkFile = `${process.cwd()}/uploads/market-images/${product.productImage}`;
      fs.unlink(linkFile, (err) => {
        if (err) return err;
      });
      await this.productRepository.update(id, { productImage: filename });
    }

    return this.findOne(id);
  }


  async imageSearch(filename: string) {
    const product = await this.productRepository.findOneBy({ productImage: filename });

    if (!product) {
      throw new NotFoundException("Product not Exists");
    }

    return product.productImage;
  }

}
