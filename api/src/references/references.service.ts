import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "node:crypto";
import { basename } from "node:path";
import { Repository } from "typeorm";
import { toUploadUrl, uploadsPublicPath } from "../common/uploads";
import { StoredFilesService } from "../uploads/stored-files.service";
import { CreateReferenceDto } from "./dto/create-reference.dto";
import { ReferenceEntity } from "./reference.entity";
import { extensionForMimeType } from "./upload.config";

@Injectable()
export class ReferencesService {
  constructor(
    @InjectRepository(ReferenceEntity)
    private readonly references: Repository<ReferenceEntity>,
    private readonly files: StoredFilesService,
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

    const filename = `${randomUUID()}${extensionForMimeType(file.mimetype)}`;
    await this.files.save(filename, file.mimetype, file.buffer);

    const highest = await this.references.maximum("sortOrder");
    const reference = this.references.create({
      kind: dto.kind,
      src: toUploadUrl(filename),
      alt: dto.alt.trim(),
      category:
        dto.kind === "style" && dto.category?.trim()
          ? dto.category.trim()
          : null,
      sortOrder: (highest ?? 0) + 1,
    });

    try {
      return await this.references.save(reference);
    } catch (error) {
      await this.files.remove(filename).catch(() => {
        // Si falla la limpieza, la imagen queda huerfana pero no rompe la API.
      });
      throw error;
    }
  }

  async remove(id: string): Promise<{ ok: true }> {
    const reference = await this.references.findOne({ where: { id } });
    if (!reference) {
      throw new NotFoundException("No encontramos esa imagen.");
    }

    await this.references.remove(reference);

    if (reference.src.startsWith(`${uploadsPublicPath}/`)) {
      await this.files.remove(basename(reference.src)).catch(() => {
        // La imagen ya no existe: la referencia igual se elimina.
      });
    }

    return { ok: true };
  }
}
