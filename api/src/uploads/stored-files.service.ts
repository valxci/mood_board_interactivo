import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StoredFileEntity } from "./stored-file.entity";

@Injectable()
export class StoredFilesService {
  constructor(
    @InjectRepository(StoredFileEntity)
    private readonly files: Repository<StoredFileEntity>,
  ) {}

  save(
    filename: string,
    mimeType: string,
    data: Buffer,
  ): Promise<StoredFileEntity> {
    return this.files.save(
      this.files.create({
        filename,
        mimeType,
        data,
      }),
    );
  }

  find(filename: string): Promise<StoredFileEntity | null> {
    return this.files.findOne({ where: { filename } });
  }

  async remove(filename: string): Promise<void> {
    await this.files.delete({ filename });
  }
}
