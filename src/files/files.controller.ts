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
      const webP = await this.filesService.convertToWebp(file.buffer);
      files.push(new MFile({
        originalname: `${file.originalname.split(".")[0]}.webp`,
        buffer: webP
      }));
    }

    return this.filesService.saveFiles(files);
  }


  @Get("download/:dirname/:filename")
  getFile(@Param("dirname") dirname: string,
          @Param("filename") filename: string,
          @Res({ passthrough: true }) res: Response): StreamableFile {

    const file = createReadStream(join(process.cwd(), "uploads",dirname, filename));

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
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="package.json"')
  getPackageJson(): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    return new StreamableFile(file);
  }


}
