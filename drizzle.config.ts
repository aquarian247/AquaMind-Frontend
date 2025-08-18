import { defineConfig } from "drizzle-kit";

/**
 * --------------------------------------------------------------------------
 * ⚠️  DEPRECATED DRIZZLE CONFIGURATION
 * --------------------------------------------------------------------------
 * This Drizzle ORM config is retained **only for historical reference**.
 *
 * The AquaMind project now relies on a Django backend with an OpenAPI
 * specification.  Runtime types are auto-generated into
 * `client/src/api/generated/` and Drizzle is **not** used in production.
 *
 * See Issue #24 – “Remove or deprecate shared/schema.ts in favor of
 * OpenAPI-generated types” for full context.
 */

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  // Legacy Drizzle schema path – do **not** import in production code
  schema: "./shared/deprecated/schema.ts.deprecated",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
