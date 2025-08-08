import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailToUser1710862631234 implements MigrationInterface {
  name = 'AddEmailToUser1710862631234';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Добавляем колонку как nullable
    await queryRunner.query(`
            ALTER TABLE "users" 
            ADD COLUMN "email" character varying;
        `);

    // Обновляем существующие записи, используя username как временный email
    await queryRunner.query(`
            UPDATE "users" 
            SET "email" = username || '@temp.com' 
            WHERE "email" IS NULL; 
        `);

    // Делаем колонку NOT NULL
    await queryRunner.query(` 
            ALTER TABLE "users" 
            ALTER COLUMN "email" SET NOT NULL;
        `);

    // Создаем уникальный индекс
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_users_email" 
            ON "users" ("email");
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "IDX_users_email";
        `);

    await queryRunner.query(`
            ALTER TABLE "users" 
            DROP COLUMN "email";
        `);
  }
}
