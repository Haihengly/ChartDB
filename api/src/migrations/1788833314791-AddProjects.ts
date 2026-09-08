import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjects1788833314791 implements MigrationInterface {
  name = 'AddProjects1788833314791';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "diagrams" DROP CONSTRAINT IF EXISTS "FK_b30615a5c550269c1de33167ea0"`);
    await queryRunner.query(`CREATE TYPE "public"."project_members_role_enum" AS ENUM('owner', 'editor')`);
    await queryRunner.query(
      `CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_members" ("project_id" uuid NOT NULL, "user_id" uuid NOT NULL, "role" "public"."project_members_role_enum" NOT NULL DEFAULT 'editor', "joined_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b3f491d3a3f986106d281d8eb4b" PRIMARY KEY ("project_id", "user_id"))`,
    );
    await queryRunner.query(`ALTER TABLE "diagrams" ADD "project_id" uuid`);
    await queryRunner.query(`ALTER TABLE "diagrams" ADD "created_by_id" uuid`);

    await queryRunner.query(`
      INSERT INTO "projects" ("id", "name", "created_by")
      SELECT uuid_generate_v4(), 'Personal', "id"
      FROM "users"
    `);

    await queryRunner.query(`
      INSERT INTO "project_members" ("project_id", "user_id", "role")
      SELECT "id", "created_by", 'owner'::"public"."project_members_role_enum"
      FROM "projects"
    `);

    await queryRunner.query(`
      UPDATE "diagrams" d
      SET "project_id" = p."id",
          "created_by_id" = d."user_id"
      FROM "projects" p
      WHERE d."user_id" = p."created_by"
    `);

    await queryRunner.query(`ALTER TABLE "diagrams" DROP COLUMN IF EXISTS "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "project_members" ADD CONSTRAINT "FK_b5729113570c20c7e214cf3f58d" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_members" ADD CONSTRAINT "FK_e89aae80e010c2faa72e6a49ce8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD CONSTRAINT "FK_8a7ccdb94bcc8635f933c8f8080" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "diagrams" ADD CONSTRAINT "FK_af992ee2cb5cafa4eec2977593c" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "diagrams" ADD CONSTRAINT "FK_df676e5d9398f10c3a4b20c4d74" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "diagrams" DROP CONSTRAINT "FK_df676e5d9398f10c3a4b20c4d74"`);
    await queryRunner.query(`ALTER TABLE "diagrams" DROP CONSTRAINT "FK_af992ee2cb5cafa4eec2977593c"`);
    await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_8a7ccdb94bcc8635f933c8f8080"`);
    await queryRunner.query(`ALTER TABLE "project_members" DROP CONSTRAINT "FK_e89aae80e010c2faa72e6a49ce8"`);
    await queryRunner.query(`ALTER TABLE "project_members" DROP CONSTRAINT "FK_b5729113570c20c7e214cf3f58d"`);
    await queryRunner.query(`ALTER TABLE "diagrams" ADD "user_id" uuid`);
    await queryRunner.query(`
      UPDATE "diagrams"
      SET "user_id" = "created_by_id"
    `);
    await queryRunner.query(`ALTER TABLE "diagrams" DROP COLUMN "created_by_id"`);
    await queryRunner.query(`ALTER TABLE "diagrams" DROP COLUMN "project_id"`);
    await queryRunner.query(`DROP TABLE "project_members"`);
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TYPE "public"."project_members_role_enum"`);
    await queryRunner.query(
      `ALTER TABLE "diagrams" ADD CONSTRAINT "FK_b30615a5c550269c1de33167ea0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
