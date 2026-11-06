import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator";
import { ColorDto } from "../../common/dto/color.dto";

export class ReferenceSnapshotDto {
  @IsString()
  @MaxLength(120)
  id: string;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  src: string;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  alt: string;

  @IsIn(["style", "mascot"])
  kind: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  category?: string | null;
}

export class PaletteSnapshotDto {
  @IsString()
  @MaxLength(120)
  id: string;

  @IsString()
  @MinLength(1)
  @MaxLength(120)
  family: string;

  @IsString()
  @MaxLength(120)
  name: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(12)
  @ValidateNested({ each: true })
  @Type(() => ColorDto)
  colors: ColorDto[];
}

export class AnswerDto {
  @IsString()
  @MaxLength(120)
  id: string;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  question: string;

  @IsString()
  @MaxLength(4000)
  answer: string;
}

export class CreateSubmissionDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  brandName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(120)
  personName: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(200)
  @ValidateNested({ each: true })
  @Type(() => ReferenceSnapshotDto)
  selectedReferences: ReferenceSnapshotDto[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => PaletteSnapshotDto)
  selectedPalettes: PaletteSnapshotDto[];

  @IsBoolean()
  wantsMascot: boolean;

  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => ReferenceSnapshotDto)
  mascotReferences: ReferenceSnapshotDto[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}
