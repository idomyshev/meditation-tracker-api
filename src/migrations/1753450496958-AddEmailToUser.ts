import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailToUser1753450496958 implements MigrationInterface {
    name = 'AddEmailToUser1753450496958';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Добавляем колонку email как nullable
        await queryRunner.query(
            `ALTER TABLE "users" ADD COLUMN "email" character varying`,
        );

        // 2. Заполняем существующие записи временными email-адресами
        await queryRunner.query(`
            UPDATE "users" 
            SET "email" = "username" || '@temp.com'
            WHERE "email" IS NULL
        `);

        // 3. Делаем колонку NOT NULL и добавляем уникальный индекс
        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_users_email" ON "users" ("email")`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_users_email"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
    }
}
