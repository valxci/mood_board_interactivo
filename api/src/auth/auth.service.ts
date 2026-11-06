import {
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  login(password: string): { token: string } {
    const expected = this.config.get<string>("ADMIN_PASSWORD");

    if (!expected) {
      throw new UnauthorizedException(
        "Falta configurar ADMIN_PASSWORD en el servidor.",
      );
    }

    if (password !== expected) {
      throw new UnauthorizedException("La contraseña no es correcta.");
    }

    return {
      token: this.jwt.sign({ role: "admin" }),
    };
  }
}
