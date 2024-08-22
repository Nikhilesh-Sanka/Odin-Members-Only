const { Client } = require("pg");

require("dotenv").config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const SQL = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        first_name VARCHAR( 255 ),
        last_name VARCHAR( 255 ),
        username VARCHAR ( 255 ),
        password VARCHAR ( 255 ),
        is_member TEXT,
        is_admin TEXT
    );
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        message TEXT,
        date TEXT,
        user_id INTEGER
    );
`;

async function main() {
  console.log("...connecting");
  await client.connect();
  console.log("......querying");
  await client.query(SQL);
  console.log(".........disconnecting");
  await client.end();
}

main();
