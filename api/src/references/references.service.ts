import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { unlink } from "node:fs/promises";
import { basename, join } from "node:path";
import { Repository } from "typeorm";
import { toUploadUrl, uploadsDir, uploadsPublicPath } from "../common/uploads";
import { CreateReferenceDto } from "./dto/create-reference.dto";
import { ReferenceEntity } from "./reference.entity";

@Injectable()
export class ReferencesService {
  constructor(
    @InjectRepository(ReferenceEntity)
    private readonly references: Repository<ReferenceEntity>,
  ) {}

  findAll(): Promise<ReferenceEntity[]> {
    return this.references.find({
      order: { sortOrder: "ASC", createdAt: "ASC" },
    });
  }

  async create(
    file: Express.Multer.File | undefined,
    dto: CreateReferenceDto,
  ): Promise<ReferenceEntity> {
    if (!file) {
      throw new BadRequestException("Adjunta una imagen para subir.");
    }

    const highest = await this.references.maximum("sortOrder");
    const reference = this.references.create({
      kind: dto.kind,
      src: toUploadUrl(file.filename),
      alt: dto.alt.trim(),
      category:
        dto.kind === "style" && dto.category?.trim()
          ? dto.category.trim()
          : null,
      sortOrder: (highest ?? 0) + 1,
    });

    return this.references.save(reference);
  }

  async remove(id: string): Promise<{ ok: true }> {
    const reference = await this.references.findOne({ where: { id } });
    if (!reference) {
      throw new NotFoundException("No encontramos esa imagen.");
    }

    await this.references.remove(reference);

    if (reference.src.startsWith(`${uploadsPublicPath}/`)) {
      await unlink(join(uploadsDir, basename(reference.src))).catch(() => {
        // El archivo ya no existe: la referencia igual se elimina.
      });
    }

    return { ok: true };
  }
}
