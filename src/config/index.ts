import dotenv from "dotenv";
import path from "path";
import { cwd } from "process";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  node_env: process.env.NODE_ENV,
  database_url: process.env.DATABASE_URL,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expires_in: process.env.JWT_EXPIRES_IN || "1d",
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  client_url: process.env.CLIENT_URL || "http://localhost:3000",
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
};
