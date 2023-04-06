import { Injectable } from "@nestjs/common";
import { FileElementResponse } from "./dto/file-element.response";
import { format } from "date-fns";
import { join } from "node:path";
import { ensureDir, writeFile } from "fs-extra";
import * as sharp from "sharp";
import { MFile } from "./dto/mfile.class";
import { v4 } from "uuid";


@Injectable()
export class FilesService {

  async saveFiles(files: MFile[]): Promise<FileElementResponse[]> {
    const dateFolder = format(new Date(), "yyyy-MM-dd");
    const uploadFolder = join(process.cwd(), "uploads", dateFolder);
    await ensureDir(uploadFolder);

    const res: FileElementResponse[] = [];

    for (const file of files) {
      await writeFile(join(uploadFolder, file.originalname), file.buffer);
      res.push({ url: `${dateFolder}/${file.originalname}`, name: file.originalname });
    }

    return res;
  }

  async convertToWebp(file: Buffer): Promise<Buffer> {
    return sharp(file).webp().toBuffer();
  }

  async resizeTo(file: Buffer, size: number): Promise<Buffer> {
    return sharp(file).resize(size, size).toBuffer();
  }

  async ResizeAndSaveFile(file: Buffer, ext: string): Promise<FileElementResponse[]> {
    const sizes = ["25X25", "50X50", "50X50", "200X200", "400X400", "900X900"];
    const filename = `${v4()}.${ext}`;
    const uploadFolder = join(process.cwd(), "uploads");

    const res: FileElementResponse[] = [];

    for (const s of sizes) {
      await ensureDir(`${uploadFolder}/${s}`);
      const [size] = s.split("X");
      await sharp(file)
        .resize(+size, +size)
        .toFile(
          `${uploadFolder}/${s}/${filename}`
          //`${__dirname}/../../public/uploads/${s}/${filename}`,
        );
      res.push({ url: `${s}/${filename}`, name: filename });
    }
    return res;

  }
}