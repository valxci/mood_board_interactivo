import { resolve } from "node:path";

export const uploadsDir =
  process.env.UPLOADS_DIR && process.env.UPLOADS_DIR.trim().length > 0
    ? resolve(process.env.UPLOADS_DIR)
    : resolve(process.cwd(), "uploads");

export const uploadsPublicPath = "/uploads";

export function toUploadUrl(filename: string): string {
  return `${uploadsPublicPath}/${filename}`;
}
