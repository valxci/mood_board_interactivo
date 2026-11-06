import { Body, Controller, Get, HttpCode, Post, UseGuards } from "@nestjs/common";
import { IsString, MaxLength, MinLength } from "class-validator";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";

class LoginDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  password: string;
}

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me() {
    return { ok: true };
  }
}
