import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateReferenceDto {
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  alt: string;

  @IsIn(["style", "mascot"])
  kind: "style" | "mascot";

  @IsOptional()
  @IsString()
  @MaxLength(120)
  category?: string;
}
