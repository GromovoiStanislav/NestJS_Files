import {
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
import { FilesService } from "./files.service";
import { MFile } from "./dto/mfile.class";
import { createReadStream } from "node:fs";
import { join } from "node:path";
import { Response } from "express";



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

    return res

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
