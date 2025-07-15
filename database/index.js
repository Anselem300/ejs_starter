const { Pool } = require("pg");
require("dotenv").config();

/* ****************************************
 * Connection pool
 *  • Always enable SSL for Render (rejectUnauthorized:false)
 *  • Log queries only in development
 **************************************** */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },   // Render requires this; harmless locally
});

const isDev = process.env.NODE_ENV === "development";

module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params);
      if (isDev) console.log("executed query", { text });
      return res;
    } catch (error) {
      console.error("error in query", { text });
      throw error;
    }
  },
};
