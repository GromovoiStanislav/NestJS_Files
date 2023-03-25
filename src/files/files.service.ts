import { Injectable } from "@nestjs/common";
import { FileElementResponse } from "./dto/file-element.response";
import { format } from "date-fns";
import { join } from "node:path";
import { ensureDir, writeFile } from "fs-extra";
import * as sharp from "sharp";
import { MFile } from "./dto/mfile.class";

@Injectable()
export class FilesService {

  async saveFiles(files: MFile[]): Promise<FileElementResponse[]> {
    const dateFolder = format(new Date(), "yyyy-MM-dd");
    const uploadFolder = join(process.cwd(),'uploads',dateFolder);
    await ensureDir(uploadFolder);

    const res: FileElementResponse[] = [];

    for (const file of files) {
      await writeFile(join(uploadFolder,file.originalname), file.buffer);
      res.push({ url: `${dateFolder}/${file.originalname}`, name: file.originalname });
    }

    return res;
  }

  convertToWebp(file: Buffer): Promise<Buffer> {
    return sharp(file).webp().toBuffer();
  }


}