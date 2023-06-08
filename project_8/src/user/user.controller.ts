import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res, ParseUUIDPipe
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { HelperFile } from "src/shared/helper";
import { Response } from "express";


@Controller("users")
export class UserController {

  constructor(
    private readonly userService: UserService
  ) {
  }


  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }


  @Get()
  async findAll() {
    return this.userService.findAll();
  }


  @Get(":id")
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }


  @Patch(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }


  @Delete(":id")
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }


  @Patch(":id/avatar")
  @UseInterceptors(
    FileInterceptor("avatar", {
      storage: diskStorage({
        destination: "./upload/avatar",
        filename: HelperFile.customFilename
      }),
      limits: {
        fileSize: 1024 * 1024 * 5
      }
    })
  )
  async updateAvatar(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.userService.updateAvatar(id, file.path, file.filename);
  }


  @Get("profile-image/:imagename")
  async findProfileImage(
    @Param("imagename") imagename: string,
    @Res() res: Response
  ) {
    return res.sendFile(imagename, {
      root: "./upload/avatar"
    });
  }

}
