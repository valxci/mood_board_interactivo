import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { IsString, MaxLength } from "class-validator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateSubmissionDto } from "./dto/create-submission.dto";
import { SubmissionsService } from "./submissions.service";

class UpdateNotesDto {
  @IsString()
  @MaxLength(4000)
  notes: string;
}

@Controller("submissions")
export class PublicSubmissionsController {
  constructor(private readonly submissions: SubmissionsService) {}

  @Post()
  create(@Body() dto: CreateSubmissionDto) {
    return this.submissions.create(dto);
  }
}

@UseGuards(JwtAuthGuard)
@Controller("admin/submissions")
export class AdminSubmissionsController {
  constructor(private readonly submissions: SubmissionsService) {}

  @Get()
  findAll() {
    return this.submissions.findAll();
  }

  @Get(":id")
  findOne(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.submissions.findOne(id);
  }

  @Patch(":id")
  updateNotes(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateNotesDto,
  ) {
    return this.submissions.updateNotes(id, dto.notes);
  }

  @Delete(":id")
  remove(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.submissions.remove(id);
  }
}
