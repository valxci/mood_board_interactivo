import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaletteEntity } from "../palettes/palette.entity";
import { ReferenceEntity } from "../references/reference.entity";
import { SeedService } from "./seed.service";

@Module({
  imports: [TypeOrmModule.forFeature([ReferenceEntity, PaletteEntity])],
  providers: [SeedService],
})
export class SeedModule {}
