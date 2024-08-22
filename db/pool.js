let { Pool } = require("pg");
require("dotenv").config();

let pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
