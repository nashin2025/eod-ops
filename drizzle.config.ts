import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./supabase/migrations",
  schema: "./src/types/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.SUPABASE_DB_URL || process.env.DATABASE_URL!,
  },
});
