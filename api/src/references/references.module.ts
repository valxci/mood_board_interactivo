import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReferenceEntity } from "./reference.entity";
import { AdminReferencesController } from "./references.controller";
import { ReferencesService } from "./references.service";

@Module({
  imports: [TypeOrmModule.forFeature([ReferenceEntity])],
  controllers: [AdminReferencesController],
  providers: [ReferencesService],
  exports: [ReferencesService],
})
export class ReferencesModule {}
