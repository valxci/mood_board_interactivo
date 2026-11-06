import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UploadsModule } from "../uploads/uploads.module";
import { ReferenceEntity } from "./reference.entity";
import { AdminReferencesController } from "./references.controller";
import { ReferencesService } from "./references.service";

@Module({
  imports: [TypeOrmModule.forFeature([ReferenceEntity]), UploadsModule],
  controllers: [AdminReferencesController],
  providers: [ReferencesService],
  exports: [ReferencesService],
})
export class ReferencesModule {}
