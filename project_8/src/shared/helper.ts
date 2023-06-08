import { Request } from "express";
import { extname } from "node:path";
import { promisify } from "node:util";
import { unlink } from "node:fs";

const unlinkAsync = promisify(unlink);

export class HelperFile {

  static customFilename(req: Request, file: Express.Multer.File, cb: any) {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    return cb(null, `${randomName}${extname(file.originalname)}`);
  }

  static async removeFile(file: string) {
    try {
      await unlinkAsync(file);
    } catch (err) {
      // throw new NotFoundException('file not found');
    }
    return true;
  }

}
