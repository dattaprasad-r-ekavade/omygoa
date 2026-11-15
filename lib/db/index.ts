import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle, type AnyD1Database } from "drizzle-orm/d1";
import { schema } from "./schema";

declare global {
  interface CloudflareEnv {
    DB: AnyD1Database;
    MEDIA: unknown;
  }
}

export async function getDb() {
  const { env } = await getCloudflareContext({ async: true });
  return drizzle(env.DB, { schema });
}

export type AppDatabase = Awaited<ReturnType<typeof getDb>>;
