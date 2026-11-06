import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaletteEntity } from "./palette.entity";
import { AdminPalettesController } from "./palettes.controller";
import { PalettesService } from "./palettes.service";

@Module({
  imports: [TypeOrmModule.forFeature([PaletteEntity])],
  controllers: [AdminPalettesController],
  providers: [PalettesService],
  exports: [PalettesService],
})
export class PalettesModule {}
