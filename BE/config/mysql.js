import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const connectMySQL = async () => {
  try {
    const pool = mysql.createPool({
      host: process.env.MYSQL_HOST || "localhost",
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      waitForConnections: true,
      connectionLimit: 10,
    });

    console.log("MySQL connected");
    return pool;
  } catch (error) {
    console.error("MySQL connection failed:", error.message);
    process.exit(1);
  }
};

export default connectMySQL;
