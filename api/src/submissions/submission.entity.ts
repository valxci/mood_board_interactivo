import type {
  PaletteSnapshot,
  ReferenceSnapshot,
  SubmissionAnalysis,
  SubmissionAnswer,
} from "../common/types";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "submissions" })
export class SubmissionEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 120 })
  brandName: string;

  @Column({ type: "varchar", length: 120 })
  personName: string;

  @Column({ type: "jsonb" })
  selectedReferences: ReferenceSnapshot[];

  @Column({ type: "jsonb" })
  selectedPalettes: PaletteSnapshot[];

  @Column({ type: "boolean" })
  wantsMascot: boolean;

  @Column({ type: "jsonb" })
  mascotReferences: ReferenceSnapshot[];

  @Column({ type: "jsonb" })
  answers: SubmissionAnswer[];

  @Column({ type: "jsonb" })
  analysis: SubmissionAnalysis;

  @Column({ type: "text", default: "" })
  adminNotes: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;
}
