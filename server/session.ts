import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";

const PgSession = connectPgSimple(session);

export function createSessionMiddleware() {
  return session({
    store: new PgSession({
      pool: pool,
      tableName: "sessions",
      createTableIfMissing: false, // Table already exists in schema
    }),
    secret: process.env.SESSION_SECRET || "fallback-secret-for-dev-only",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production" && process.env.COOKIE_SECURE === "true",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    },
  });
}