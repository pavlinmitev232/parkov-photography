import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Prisma CLI commands should use a non-transaction-pooled connection.
    // Local development falls back to DATABASE_URL for the Docker database.
    url: process.env.DIRECT_URL || env("DATABASE_URL"),
  },
});
