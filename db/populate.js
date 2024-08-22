const { Client } = require("pg");

require("dotenv").config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const SQL = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR ( 255 ),
        password VARCHAR ( 255 ),
        is_member BOOLEAN,
        is_admin BOOLEAN
    );
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        message TEXT,
        date DATE,
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
