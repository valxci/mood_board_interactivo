import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubmissionEntity } from "./submission.entity";
import {
  AdminSubmissionsController,
  PublicSubmissionsController,
} from "./submissions.controller";
import { SubmissionsService } from "./submissions.service";

@Module({
  imports: [TypeOrmModule.forFeature([SubmissionEntity])],
  controllers: [PublicSubmissionsController, AdminSubmissionsController],
  providers: [SubmissionsService],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
