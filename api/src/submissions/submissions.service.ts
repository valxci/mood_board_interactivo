import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { buildAnalysis } from "./analysis";
import type { CreateSubmissionDto } from "./dto/create-submission.dto";
import { SubmissionEntity } from "./submission.entity";

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(SubmissionEntity)
    private readonly submissions: Repository<SubmissionEntity>,
  ) {}

  async create(dto: CreateSubmissionDto): Promise<SubmissionEntity> {
    if (dto.wantsMascot && dto.mascotReferences.length === 0) {
      throw new BadRequestException(
        "Si la marca tendrá mascota, debes elegir al menos una referencia.",
      );
    }

    const answers = dto.answers.filter(
      (answer) => answer.answer.trim().length > 0,
    );

    const normalized: CreateSubmissionDto = {
      ...dto,
      brandName: dto.brandName.trim(),
      personName: dto.personName.trim(),
      wantsMascot: dto.wantsMascot,
      mascotReferences: dto.wantsMascot ? dto.mascotReferences : [],
      answers,
    };

    const submission = this.submissions.create({
      brandName: normalized.brandName,
      personName: normalized.personName,
      selectedReferences: dto.selectedReferences,
      selectedPalettes: dto.selectedPalettes,
      wantsMascot: normalized.wantsMascot,
      mascotReferences: normalized.mascotReferences,
      answers: normalized.answers,
      analysis: buildAnalysis(normalized),
      adminNotes: "",
    });

    return this.submissions.save(submission);
  }

  findAll(): Promise<SubmissionEntity[]> {
    return this.submissions.find({ order: { createdAt: "DESC" } });
  }

  async findOne(id: string): Promise<SubmissionEntity> {
    const submission = await this.submissions.findOne({ where: { id } });
    if (!submission) {
      throw new NotFoundException("No encontramos esa solicitud.");
    }
    return submission;
  }

  async updateNotes(id: string, notes: string): Promise<SubmissionEntity> {
    const submission = await this.findOne(id);
    submission.adminNotes = notes.slice(0, 4000);
    return this.submissions.save(submission);
  }

  async remove(id: string): Promise<{ ok: true }> {
    const submission = await this.findOne(id);
    await this.submissions.remove(submission);
    return { ok: true };
  }
}
