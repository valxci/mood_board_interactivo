import { BadRequestException } from "@nestjs/common";
import { memoryStorage } from "multer";

export const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

const allowedMimeTypes = new Map<string, string>([
  ["image/png", ".png"],
  ["image/jpeg", ".jpg"],
  ["image/webp", ".webp"],
]);

export function extensionForMimeType(mimetype: string): string {
  return allowedMimeTypes.get(mimetype) ?? ".png";
}

export const referenceUploadOptions = {
  storage: memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter: (
    _request: unknown,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(
        new BadRequestException("Solo se permiten imagenes PNG, JPG o WebP."),
        false,
      );
      return;
    }
    callback(null, true);
  },
};
