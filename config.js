const { Pool } = require("pg");

const defaultPool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres",
  port: 5432,
});

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "nutech",
  password: "postgres",
  port: 5432,
  idleTimeoutMillis: 500,
});

// async function test() {
//   try {
//     let data = await pool.query(`SELECT now()`);
//     console.log(data.rows);
//   } catch (error) {
//     console.log(error);
//   }
// }

// test();

module.exports = { pool, defaultPool };
