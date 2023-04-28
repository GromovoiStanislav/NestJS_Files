import { Body, Controller, Get, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ProductDto } from "./dto/product.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { ProductService } from "./product.service";


@Controller('product')
export class ProductController{

  constructor(private productService: ProductService) {}


  @Get()
  async getAllProducts() {
    return await this.productService.getAllProducts();
  }


  @Post()
  async createProduct(@Body() productDto: ProductDto) {
    return await this.productService.createProduct(productDto);
  }


  @UseInterceptors(FileInterceptor('file'))
  @Post('/:id/upload-file')
  async addImageToProduct(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.productService.addFileToProduct(file, id);
  }

}