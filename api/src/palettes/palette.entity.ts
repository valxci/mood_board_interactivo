import type { ColorSwatch } from "../common/types";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "palettes" })
export class PaletteEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 120 })
  family: string;

  @Column({ type: "varchar", length: 120, default: "" })
  name: string;

  @Column({ type: "jsonb" })
  colors: ColorSwatch[];

  @Column({ type: "int", default: 0 })
  sortOrder: number;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;
}
