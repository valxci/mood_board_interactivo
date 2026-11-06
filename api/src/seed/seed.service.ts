import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PaletteEntity } from "../palettes/palette.entity";
import { ReferenceEntity } from "../references/reference.entity";
import {
  seedMascotReferences,
  seedPalettes,
  seedStyleReferences,
} from "./seed-data";

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(ReferenceEntity)
    private readonly references: Repository<ReferenceEntity>,
    @InjectRepository(PaletteEntity)
    private readonly palettes: Repository<PaletteEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedReferences();
    await this.seedPalettes();
  }

  private async seedReferences(): Promise<void> {
    const styleCount = await this.references.count({
      where: { kind: "style" },
    });

    if (styleCount === 0) {
      await this.references.save(
        seedStyleReferences.map((src, index) =>
          this.references.create({
            kind: "style",
            src,
            alt: `Referencia visual ${index + 1}`,
            category: null,
            sortOrder: index,
          }),
        ),
      );
      this.logger.log(`Cargadas ${seedStyleReferences.length} referencias de estilo.`);
    }

    const mascotCount = await this.references.count({
      where: { kind: "mascot" },
    });

    if (mascotCount === 0) {
      await this.references.save(
        seedMascotReferences.map((src, index) =>
          this.references.create({
            kind: "mascot",
            src,
            alt: `Referencia de mascota ${index + 1}`,
            category: null,
            sortOrder: index,
          }),
        ),
      );
      this.logger.log(`Cargadas ${seedMascotReferences.length} referencias de mascota.`);
    }
  }

  private async seedPalettes(): Promise<void> {
    const count = await this.palettes.count();
    if (count > 0) {
      return;
    }

    await this.palettes.save(
      seedPalettes.map((palette, index) =>
        this.palettes.create({
          family: palette.family,
          name: palette.name,
          colors: palette.colors,
          sortOrder: index,
        }),
      ),
    );

    this.logger.log(`Cargadas ${seedPalettes.length} paletas de color.`);
  }
}
