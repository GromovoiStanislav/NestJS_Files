import { diskStorage, Options, StorageEngine } from 'multer';
import * as path from 'node:path';
import { v4 as uuidv4 } from 'uuid';

export class Storage {

  private storage(): StorageEngine {
    return diskStorage({
      destination: './uploads/market-images',
      filename: (req, file, callback) => {
        const stringDate = new Date();
        let filename: string = this.stringToBase64(stringDate.toDateString());
        filename = `${filename}-${uuidv4()}`;
        const extension: string = path.parse(file.originalname).ext;
        callback(null, `${filename}${extension}`);
      },
    });
  }

  getConfig(): Options {
    return {
      storage: this.storage(),
    };
  }

  private stringToBase64(filename: string) {
    //return btoa(unescape(encodeURIComponent(filename)));
    return Buffer.from(decodeURI(encodeURIComponent(filename))).toString('base64');
  }

}
