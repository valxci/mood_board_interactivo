import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import express from "express";
import { AppModule } from "./src/app.module";

const expressApp = express();
let readyPromise: Promise<void> | null = null;

async function createApp() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
    logger: ["error", "warn", "log"],
  });

  app.setGlobalPrefix("api", { exclude: ["uploads/{*path}"] });

  const origins = (process.env.WEB_ORIGIN ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({ origin: origins.length > 0 ? origins : true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  await app.init();
}

export default async function handler(request: any, response: any) {
  const pathname = String(request.url ?? "").split("?")[0];

  if (pathname === "/health" || pathname === "/api/health") {
    response.status(200).json({ ok: true, service: "moodboard-api" });
    return;
  }

  if (!readyPromise) {
    readyPromise = createApp();
  }

  await readyPromise;
  return expressApp(request, response);
}
