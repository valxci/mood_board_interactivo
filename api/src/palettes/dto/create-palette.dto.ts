import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator";
import { ColorDto } from "../../common/dto/color.dto";

export class CreatePaletteDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  family: string;

  @IsString()
  @MaxLength(120)
  name: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => ColorDto)
  colors: ColorDto[];
}
