import { Controller, Get, Module } from "@nestjs/common";
import { PalettesModule } from "../palettes/palettes.module";
import { PalettesService } from "../palettes/palettes.service";
import { ReferencesModule } from "../references/references.module";
import { ReferencesService } from "../references/references.service";

@Controller()
export class ContentController {
  constructor(
    private readonly references: ReferencesService,
    private readonly palettes: PalettesService,
  ) {}

  @Get("content")
  async getContent() {
    const [references, palettes] = await Promise.all([
      this.references.findAll(),
      this.palettes.findAll(),
    ]);

    return { references, palettes };
  }
}

@Module({
  imports: [ReferencesModule, PalettesModule],
  controllers: [ContentController],
})
export class ContentModule {}
