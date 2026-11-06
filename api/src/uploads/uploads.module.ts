import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StoredFileEntity } from "./stored-file.entity";
import { StoredFilesService } from "./stored-files.service";
import { UploadsController } from "./uploads.controller";

@Module({
  imports: [TypeOrmModule.forFeature([StoredFileEntity])],
  controllers: [UploadsController],
  providers: [StoredFilesService],
  exports: [StoredFilesService],
})
export class UploadsModule {}
