import { BadRequestException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { diskStorage } from "multer";
import { extname } from "node:path";
import { uploadsDir } from "../common/uploads";

export const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

const allowedMimeTypes = new Map<string, string>([
  ["image/png", ".png"],
  ["image/jpeg", ".jpg"],
  ["image/webp", ".webp"],
]);

mkdirSync(uploadsDir, { recursive: true });

export const referenceUploadOptions = {
  storage: diskStorage({
    destination: uploadsDir,
    filename: (_request, file, callback) => {
      const extension =
        allowedMimeTypes.get(file.mimetype) ||
        extname(file.originalname).toLowerCase() ||
        ".png";
      callback(null, `${randomUUID()}${extension}`);
    },
  }),
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter: (
    _request: unknown,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(
        new BadRequestException("Solo se permiten imágenes PNG, JPG o WebP."),
        false,
      );
      return;
    }
    callback(null, true);
  },
};
