import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSenhaPadraoToEquipment1694960001000 implements MigrationInterface {
  name = 'AddSenhaPadraoToEquipment1694960001000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'equipment' AND column_name = 'senha_padrao'
        ) THEN
          ALTER TABLE equipment ADD COLUMN senha_padrao VARCHAR(255);
        END IF;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'equipment' AND column_name = 'senha_padrao'
        ) THEN
          ALTER TABLE equipment DROP COLUMN senha_padrao;
        END IF;
      END
      $$;
    `);
  }
}
