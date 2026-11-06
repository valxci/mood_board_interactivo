import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePaletteDto } from "./dto/create-palette.dto";
import { PaletteEntity } from "./palette.entity";

@Injectable()
export class PalettesService {
  constructor(
    @InjectRepository(PaletteEntity)
    private readonly palettes: Repository<PaletteEntity>,
  ) {}

  findAll(): Promise<PaletteEntity[]> {
    return this.palettes.find({ order: { sortOrder: "ASC", createdAt: "ASC" } });
  }

  async create(dto: CreatePaletteDto): Promise<PaletteEntity> {
    const highest = await this.palettes.maximum("sortOrder");
    const palette = this.palettes.create({
      family: dto.family.trim(),
      name: dto.name.trim(),
      colors: dto.colors.map((color) => ({
        name: color.name.trim(),
        hex: color.hex.toUpperCase(),
      })),
      sortOrder: (highest ?? 0) + 1,
    });

    return this.palettes.save(palette);
  }

  async remove(id: string): Promise<{ ok: true }> {
    const palette = await this.palettes.findOne({ where: { id } });
    if (!palette) {
      throw new NotFoundException("No encontramos esa paleta.");
    }
    await this.palettes.remove(palette);
    return { ok: true };
  }
}
