import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsernameColumn1789098851925 implements MigrationInterface {
    name = 'AddUsernameColumn1789098851925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add username column as nullable first
        await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying`);

        // Get all existing users
        const users = await queryRunner.query(`SELECT id, email FROM "users"`);

        // Backfill usernames for existing users
        const usernameCounts: Record<string, number> = {};
        for (const user of users) {
            let username = user.email.split('@')[0].toLowerCase();
            // Sanitize: keep only alphanumeric, underscore, hyphen
            username = username.replace(/[^a-z0-9_-]/g, '');

            // Handle collisions
            if (usernameCounts[username]) {
                usernameCounts[username]++;
                username = `${username}${usernameCounts[username]}`;
            } else {
                usernameCounts[username] = 1;
            }

            // Ensure minimum length
            if (username.length < 3) {
                username = `${username}${user.id.substring(0, 3)}`;
            }

            await queryRunner.query(
                `UPDATE "users" SET "username" = $1 WHERE id = $2`,
                [username, user.id]
            );
        }

        // Now make the column NOT NULL with unique constraint
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
    }

}