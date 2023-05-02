import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";


import * as fs from "node:fs";
import * as FileType from "file-type";
import * as path from "node:path";
import { from, Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";


const validFileExtensions: string[] = ["png", "jpg", "jpeg"];
const validMimeTypes: string[] = [
  "image/png",
  "image/jpg",
  "image/jpeg"
];

export const saveImageToStorage = {
  storage: diskStorage({
    destination: "./images",
    filename: (req, file, cb) => {
      const fileExtension: string = path.extname(file.originalname);
      const fileName: string = uuidv4() + fileExtension;
      cb(null, fileName);
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes: string[] = validMimeTypes;
    allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  }
};

export const isFileExtensionSafe = (
  fullFilePath: string
): Observable<boolean> => {
  return from(FileType.fromFile(fullFilePath)).pipe(
    switchMap(
      (fileExtensionAndMimeType: {
        ext: string, mime: string;
      }) => {

        if (!fileExtensionAndMimeType) return of(false);

        const isFileTypeLegit = validFileExtensions.includes(
          fileExtensionAndMimeType.ext
        );
        const isMimeTypeLegit = validMimeTypes.includes(
          fileExtensionAndMimeType.mime
        );
        const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
        return of(isFileLegit);
      }
    )
  );
};

export const removeFile = (fullFilePath: string): void => {
  try {
    fs.unlinkSync(fullFilePath);
  } catch (err) {
    console.error(err);
  }
};