
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    console.log("🗑️ Dropping all tables (Self-contained)...");

    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not set");
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        const client = await pool.connect();
        try {
            await client.query(`DROP SCHEMA public CASCADE;`);
            await client.query(`CREATE SCHEMA public;`);
            await client.query(`GRANT ALL ON SCHEMA public TO postgres;`);
            await client.query(`GRANT ALL ON SCHEMA public TO public;`);
            console.log("✅ All tables dropped. Database is clean.");
        } finally {
            client.release();
        }
    } catch (err) {
        console.error("❌ Reset failed!", err);
        process.exit(1);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

main();
