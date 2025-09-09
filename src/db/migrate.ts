
import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

async function main() {
  const url = process.env.DATABASE_URL_MIGRATIONS!;
  const client = postgres(url, { ssl: "require", max: 1, prepare: false });
  const db = drizzle(client);
  console.log("⏳ Running migrations...");
  await migrate(db, { migrationsFolder: "drizzle" });
  await client.end({ timeout: 5 });
  console.log("✅ Migrations complete");
}

main().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
