import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1694960000000 implements MigrationInterface {
  name = 'InitialSchema1694960000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // user table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        id SERIAL PRIMARY KEY,
        nome_completo VARCHAR NOT NULL,
        email VARCHAR NOT NULL UNIQUE,
        senha VARCHAR NOT NULL,
        empresa VARCHAR NOT NULL,
        telefone VARCHAR NOT NULL,
        setor VARCHAR NOT NULL,
        cargo VARCHAR NOT NULL,
        data_nascimento DATE NOT NULL,
        data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        status BOOLEAN NOT NULL DEFAULT true
      );
    `);

    // sistema table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "sistema" (
        id SERIAL PRIMARY KEY,
        nome VARCHAR NOT NULL,
        empresa VARCHAR NOT NULL,
        perfis VARCHAR NOT NULL,
        descricao VARCHAR NOT NULL,
        url VARCHAR NOT NULL,
        ativo BOOLEAN NOT NULL DEFAULT true,
        data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // usuario_sistema table (many-to-many through entity)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "usuario_sistema" (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        sistema_id INTEGER NOT NULL,
        perfil VARCHAR NOT NULL,
        CONSTRAINT fk_usuario_sistema_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
        CONSTRAINT fk_usuario_sistema_sistema FOREIGN KEY (sistema_id) REFERENCES "sistema"(id) ON DELETE CASCADE
      );
    `);

    // equipment table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "equipment" (
        id SERIAL PRIMARY KEY,
        tipo VARCHAR(255) NOT NULL,
        identificacao VARCHAR(255) NOT NULL,
        marca VARCHAR(255),
        modelo VARCHAR(255),
        observacoes TEXT,
        ativo BOOLEAN DEFAULT true,
        "usuarioId" INTEGER,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_equipment_usuario FOREIGN KEY ("usuarioId") REFERENCES "user"(id) ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_equipment_identificacao ON equipment(identificacao);`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_equipment_tipo ON equipment(tipo);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_equipment_tipo;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_equipment_identificacao;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "equipment";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "usuario_sistema";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sistema";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user";`);
  }
}
