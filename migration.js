const { pool, defaultPool } = require("./config");

const dropDatabase = `DROP DATABASE IF EXISTS nutech;`;
const createDatabase = `CREATE DATABASE nutech;`;

const dropTable = `DROP TABLE IF EXISTS  "Transactions", "Users";
DROP TYPE IF EXISTS service_code_enum;`;

const usersTable = `CREATE TABLE IF NOT EXISTS "Users" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "balance" INTEGER DEFAULT 0
);`;

const transactionsTable = `
DROP TYPE IF EXISTS service_code_enum;
CREATE TYPE service_code_enum AS ENUM ('PULSA', 'PLN_PRABAYAR', 'TOPUP');

CREATE TABLE IF NOT EXISTS "Transactions" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INT REFERENCES "Users"("id") ON DELETE CASCADE,
    "invoice_number" VARCHAR(255) NOT NULL,
    "service_code" service_code_enum NOT NULL,
    "service_name" VARCHAR(255) NOT NULL,
    "transaction_type" VARCHAR(255) NOT NULL,
    "total_amount" INTEGER NOT NULL,
    "created_on" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

async function migration() {
  try {
    const droppedDb = await defaultPool.query(dropDatabase);
    if (droppedDb) {
      console.log("drop database success");
    }
    const createdDatabase = await defaultPool.query(createDatabase);
    if (createdDatabase) {
      console.log("create database success");
    }

    const droppedTable = await pool.query(dropTable);
    if (droppedTable) {
      console.log("drop table Users & Transactions success");
    }

    const userTable = await pool.query(usersTable);
    if (userTable) {
      console.log("create Users table success");
    }

    const transactionTable = await pool.query(transactionsTable);
    if (transactionTable) {
      console.log("create Transactions table success");
    }
  } catch (error) {
    console.log(error);
  } finally {
    await pool.end();
    await defaultPool.end();
  }
}

migration();
