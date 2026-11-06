import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Res,
  StreamableFile,
} from "@nestjs/common";
import type { Response } from "express";
import { StoredFilesService } from "./stored-files.service";

const SAFE_FILENAME = /^[a-f0-9-]{36}\.(png|jpg|webp)$/i;

@Controller("uploads")
export class UploadsController {
  constructor(private readonly files: StoredFilesService) {}

  @Get(":filename")
  async findOne(
    @Param("filename") filename: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    if (!SAFE_FILENAME.test(filename)) {
      throw new NotFoundException("No encontramos esa imagen.");
    }

    const file = await this.files.find(filename);
    if (!file) {
      throw new NotFoundException("No encontramos esa imagen.");
    }

    response.set({
      "Content-Type": file.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    });

    return new StreamableFile(file.data);
  }
}
