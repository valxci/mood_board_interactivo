import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { ContentModule } from "./content/content.module";
import { PalettesModule } from "./palettes/palettes.module";
import { ReferencesModule } from "./references/references.module";
import { SeedModule } from "./seed/seed.module";
import { SubmissionsModule } from "./submissions/submissions.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>("DATABASE_URL")?.trim();
        const useSsl =
          (config.get<string>("DB_SSL") ?? "false").toLowerCase() === "true";

        return {
          type: "postgres" as const,
          ...(databaseUrl
            ? { url: databaseUrl }
            : {
                host: config.get<string>("DB_HOST") ?? "localhost",
                port: Number(config.get<string>("DB_PORT") ?? 5432),
                username: config.get<string>("DB_USER") ?? "moodboard",
                password: config.get<string>("DB_PASSWORD") ?? "moodboard",
                database: config.get<string>("DB_NAME") ?? "moodboard",
              }),
          ssl: useSsl ? { rejectUnauthorized: false } : false,
          autoLoadEntities: true,
          synchronize: (config.get<string>("DB_SYNC") ?? "true") === "true",
          retryAttempts: 15,
          retryDelay: 3000,
        };
      },
    }),
    AuthModule,
    ContentModule,
    SubmissionsModule,
    ReferencesModule,
    PalettesModule,
    SeedModule,
  ],
})
export class AppModule {}
