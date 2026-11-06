import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreatePaletteDto } from "./dto/create-palette.dto";
import { PalettesService } from "./palettes.service";

@UseGuards(JwtAuthGuard)
@Controller("admin/palettes")
export class AdminPalettesController {
  constructor(private readonly palettes: PalettesService) {}

  @Get()
  findAll() {
    return this.palettes.findAll();
  }

  @Post()
  create(@Body() dto: CreatePaletteDto) {
    return this.palettes.create(dto);
  }

  @Delete(":id")
  remove(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.palettes.remove(id);
  }
}
