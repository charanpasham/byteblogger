// path to a file with schema you want to reset
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import { seed } from "drizzle-seed";

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
  await seed(db, { schema }).refine((f) => ({
    roles: {
      name: "Admin",
      description: "Administrator role with full access",
      createdAt: new Date(),
    },
  }));
}

await main();
