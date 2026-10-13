require("dotenv").config();
const { runner } = require("node-pg-migrate");
const path = require("node:path");

const direction = process.argv[2] || "up";

async function runMigrations() {
    await runner({
        databaseUrl: {
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        },
        dir: path.resolve("src/database/migrations"),
        direction,
        migrationsTable: "pgmigrations",
        verbose: true,
    });
}

runMigrations().catch((error) => {
    console.error("Migration failed:", error.message);
    process.exitCode = 1;
});
