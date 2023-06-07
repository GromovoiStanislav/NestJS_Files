import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res, StreamableFile,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { join } from "path";
import { Storage } from "../infrastructure/services/storage.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { IImage } from "./interface/image.interface";
import { ProductsService } from "./products.service";
import { createReadStream } from "fs";

@Controller("products")
export class ProductsController {

  constructor(
    private readonly productsService: ProductsService
  ) {
  }


  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }


  @Get()
  async findAll() {
    return this.productsService.findAll();
  }


  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.productsService.findOne(id);
  }


  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update(id, updateProductDto);
  }


  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.productsService.remove(id);
  }


  @Patch("upload/:id")
  @UseInterceptors(FileInterceptor("file", new Storage().getConfig()))
  async uploadFile(
    @UploadedFile("file") file: IImage,
    @Param("id") id: string
  ): Promise<IImage> {
    await this.productsService.updateProductImage(id, file.filename);
    return file;
  }


  @Get("product/:image")
  async getImage(
    @Param("image") imageName: string,
    @Res() response
  ) {
    const imageNameSearch = await this.productsService.imageSearch(imageName);
    return response.sendFile(join(process.cwd(), "uploads/market-images/" , imageNameSearch));
  }

}
