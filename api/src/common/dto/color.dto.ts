import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class ColorDto {
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  name: string;

  @Matches(/^#[0-9a-fA-F]{6}$/, {
    message: "Cada color debe tener un hex válido (#RRGGBB).",
  })
  hex: string;
}
