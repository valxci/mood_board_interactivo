import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "stored_files" })
export class StoredFileEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, unique: true })
  filename: string;

  @Column({ type: "varchar", length: 100 })
  mimeType: string;

  @Column({ type: "bytea" })
  data: Buffer;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;
}
