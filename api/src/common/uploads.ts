export const uploadsPublicPath = "/uploads";

export function toUploadUrl(filename: string): string {
  return `${uploadsPublicPath}/${filename}`;
}
