import "reflect-metadata";
import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { mkdirSync } from "node:fs";
import { AppModule } from "./app.module";
import { uploadsDir } from "./common/uploads";

async function bootstrap(): Promise<void> {
  mkdirSync(uploadsDir, { recursive: true });

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");

  const origins = (process.env.WEB_ORIGIN ?? "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({ origin: origins });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );
  app.enableShutdownHooks();

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port, "0.0.0.0");

  Logger.log(`API escuchando en http://localhost:${port}/api`, "Bootstrap");
  Logger.log(`Archivos subidos en ${uploadsDir}`, "Bootstrap");
}

void bootstrap();
