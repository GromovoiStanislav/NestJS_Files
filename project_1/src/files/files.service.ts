import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { FileElementResponse } from "./dto/file-element.response";
import { format } from "date-fns";
import { join } from "node:path";
import { ensureDir, writeFile } from "fs-extra";
import * as sharp from "sharp";
import { MFile } from "./dto/mfile.class";
import * as fs from "node:fs";

import { randomUUID } from "node:crypto";
import { v4 } from "uuid";
import { ulid } from "ulid";


export enum FileType {
  AUDIO = "audio",
  IMAGE = "image"
}

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


  async createThumb(file: Buffer) {
    return sharp(file).resize(100, 100, {
      kernel: sharp.kernel.nearest,
      fit: "contain", //"cover" | "contain" | "fill"
      background: { r: 0, g: 0, b: 0, alpha: 1.0 },
      position: "center" // "center" | "top" | "bottom" | "right top" ...
    })
      //.toFormat('png')
      .png()
      .toBuffer();
  }

  async createThumbWithFile(file: Buffer) {
    const fileName = join(process.cwd(), "uploads", `${ulid()}.png`);
    await sharp(file).resize(100, 100, {
      kernel: sharp.kernel.nearest,
      fit: "contain",//"cover" | "contain" | "fill"
      background: { r: 0, g: 0, b: 0, alpha: 1.0 },
      position: "center" // "center" | "top" | "bottom" | "right top" ...
    })
      //.toFormat('png')
      .png()
      //.toFile(`uploads/${fileName}.png`)
      .toFile(fileName);
    return fileName;
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

  async createFile(type: FileType, file): Promise<string> {
    try {
      const fileExtension = file.originalname.split(".").pop();
      //const fileExtension: string = path.parse(file.originalname).ext;
      //const fileExtension: string = path.extname(file.originalname);
      const fileName = randomUUID() + "." + fileExtension;
      //const filePath = join(__dirname, "..", "uploads", type);
      const filePath = join(process.cwd(), "uploads", type);
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(join(filePath, fileName), file.buffer);
      return type + "/" + fileName;
    } catch (e) {
      throw new InternalServerErrorException("Произошла ошибка при записи файла");
      //throw new InternalServerErrorException(e.message);
    }
  }


}