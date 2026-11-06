import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "references" })
export class ReferenceEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 20 })
  kind: string;

  @Column({ type: "varchar", length: 500 })
  src: string;

  @Column({ type: "varchar", length: 300 })
  alt: string;

  @Column({ type: "varchar", length: 120, nullable: true })
  category: string | null;

  @Column({ type: "int", default: 0 })
  sortOrder: number;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;
}
