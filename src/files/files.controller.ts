import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileElementResponse } from "./dto/file-element.response";
import { FilesService, FileType } from "./files.service";
import { MFile } from "./dto/mfile.class";
import { createReadStream } from "node:fs";
import { extname, join } from "node:path";
import { Response } from "express";
import { diskStorage } from "multer";
import * as path from "node:path";
import { randomUUID } from "node:crypto";


export const storage = {
  storage: diskStorage({
    destination: "./uploads/profileimages",
    filename: (req, file, cb) => {
      const filename: string = path.parse(file.originalname).name.replace(/\s/g, "") + randomUUID();
      const extension: string = path.parse(file.originalname).ext;
      //const extension: string = path.extname(file.originalname);
      cb(null, `${filename}${extension}`);
    }
  }),
  limits: {
    fileSize: 1e7, // the max file size in bytes, here it's 100MB,
    files: 1,
  },
};


@Controller("files")
export class FilesController {

  constructor(private filesService: FilesService) {
  }

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<FileElementResponse[]> {

    const files: MFile[] = [new MFile(file)];

    if (file.mimetype.includes("image")) {
      let webP = await this.filesService.convertToWebp(file.buffer);
      const webP200 = await this.filesService.resizeTo(webP, 200);

      files.push(new MFile({
        originalname: `${file.originalname.split(".")[0]}.webp`,
        buffer: webP
      }));

      files.push(new MFile({
        originalname: `${file.originalname.split(".")[0]}_200x200.webp`,
        buffer: webP200
      }));

    }

    return this.filesService.saveFiles(files);
  }


  @Post("upload2")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFileAndResize2(@UploadedFile() file: Express.Multer.File): Promise<FileElementResponse[]> {

    const files: MFile[] = [new MFile(file)];
    const sizes = ["25X25", "50X50", "50X50", "200X200", "400X400", "900X900"];
    const [, ext] = file.mimetype.split("/");

    if (["jpeg", "jpg", "png"].includes(ext)) {

      // for (const s of sizes) {
      //   const [size] = s.split("X");
      //   const resisedFile = await this.filesService.resizeTo(file.buffer, Number(size));
      //   files.push(new MFile({
      //     originalname: `${file.originalname.split(".")[0]}_${s}.${ext}`,
      //     buffer: resisedFile
      //   }));
      // }

      await Promise.all(sizes.map(async (s) => {
        const [size] = s.split("X");
        const resisedFile = await this.filesService.resizeTo(file.buffer, Number(size));
        files.push(new MFile({
          originalname: `${file.originalname.split(".")[0]}_${s}.${ext}`,
          buffer: resisedFile
        }));
      }));

    }

    return this.filesService.saveFiles(files);
  }


  @Post("upload3")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFileAndResize3(@UploadedFile() file: Express.Multer.File): Promise<FileElementResponse[]> {

    let res: FileElementResponse[] = [];

    const [, ext] = file.mimetype.split("/");
    if (["jpeg", "jpg", "png"].includes(ext)) {
      res = await this.filesService.ResizeAndSaveFile(file.buffer, ext);
    }

    return res;

  }


  @Post("/upload-fileS3")
  @UseInterceptors(FileInterceptor("file"))
  async addImageToRecipe(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    const bucketKey = `${file.fieldname}${Date.now()}`;
    // const fileUrl = await this.s3Service.uploadFile(file, bucketKey);
    //await this.recipeRepository.update({ id }, { image: fileUrl });
    return { bucketKey };
  }


  @Post("profile-image")
  @UseInterceptors(FileInterceptor("file", storage))
  profileImage(@UploadedFile() file: Express.Multer.File) {
    return { filename: file.filename };
  }

  @Get("profile-image/:imagename")
  findProfileImage(@Param("imagename") imagename, @Res() res: Response) {
    return res.sendFile(path.join(process.cwd(), "uploads/profileimages", imagename));
  }


  @Post("/upload-file")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        }
      }),
      limits: {
        fileSize: 1e7, // the max file size in bytes, here it's 100MB,
        files: 1,
      },
    })
  )
  handleUpload(@UploadedFile() file: Express.Multer.File) {
    //console.log("file", file);
    return { ...file, path: file.destination + "/" + file.filename };
  }


  @Post("post")
  @UseInterceptors(FileInterceptor("image"))
  async createPost(@Body() dto: any, @UploadedFile() image) {
    console.log(dto);
    //return this.postService.create( dto, image);
    const fileName = await this.filesService.createFile(FileType.IMAGE,image);
    //return await this.postRepository.create({ ...dto, image: fileName });
    return { body: dto, fileName };
  }


  @Get("download/:dirname/:filename")
  getFile(@Param("dirname") dirname: string,
          @Param("filename") filename: string,
          @Res({ passthrough: true }) res: Response): StreamableFile {

    const file = createReadStream(join(process.cwd(), "uploads", dirname, filename));

    const fileExtension: string = filename.split(".").pop();
    //const fileExtension: string = path.parse(filename).ext;
    //const fileExtension: string = path.extname(filename);

    res.set({
      "Content-Type": `image/${fileExtension}`,
      "Content-Disposition": `attachment; filename="${filename}"`
    });

    // file.pipe(res);
    return new StreamableFile(file);
  }


  @Get("download")
  @Header("Content-Type", "application/json")
  @Header("Content-Disposition", "attachment; filename=\"package.json\"")
  getPackageJson(): StreamableFile {
    const file = createReadStream(join(process.cwd(), "package.json"));
    return new StreamableFile(file);
  }


}
