import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import { seed } from "drizzle-seed";

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
  await seed(db, { schema });
}

await main();
