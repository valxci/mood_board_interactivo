import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseUUIDPipe,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateReferenceDto } from "./dto/create-reference.dto";
import {
  MAX_IMAGE_SIZE,
  referenceUploadOptions,
} from "./upload.config";
import { ReferencesService } from "./references.service";

@UseGuards(JwtAuthGuard)
@Controller("admin/references")
export class AdminReferencesController {
  constructor(private readonly references: ReferencesService) {}

  @Get()
  findAll() {
    return this.references.findAll();
  }

  @Post()
  @UseInterceptors(FileInterceptor("file", referenceUploadOptions))
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_IMAGE_SIZE }),
          new FileTypeValidator({
            fileType: /^image\/(png|jpeg|webp)$/,
            // Con diskStorage el archivo llega sin buffer; el mimetype ya se
            // valida también en el fileFilter de Multer.
            skipMagicNumbersValidation: true,
          }),
        ],
        exceptionFactory: () =>
          new BadRequestException(
            "La imagen debe ser PNG, JPG o WebP y pesar menos de 8 MB.",
          ),
      }),
    )
    file: Express.Multer.File,
    @Body() dto: CreateReferenceDto,
  ) {
    return this.references.create(file, dto);
  }

  @Delete(":id")
  remove(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.references.remove(id);
  }
}
