const { pool } = require("../config");
const { hashedPassword, checkPassword } = require("../helper/bcrypt");
const { createToken } = require("../helper/jwt");
const loginSchema = require("../validators/login.validator");
const userSchema = require("../validators/register.validator");
const topUpSchema = require("../validators/topUp.validator");

class Model {
  static async register(input) {
    try {
      const { email, first_name, last_name, password } = input;
      userSchema.parse(input);

      const queryCheck = `SELECT * FROM "Users"
      WHERE email = $1;`;
      const valuesCheck = [email];

      const result = await pool.query(queryCheck, valuesCheck);
      if (result.rows.length > 0) {
        throw {
          name: "EmailAlreadyExist",
        };
      }

      const hashed = hashedPassword(password);

      await pool.query("BEGIN;");

      const query = `INSERT INTO "Users" (email, first_name, last_name, password, balance) 
      VALUES ($1, $2, $3, $4, $5);`;

      const values = [email, first_name, last_name, hashed, 0];

      await pool.query(query, values);

      await pool.query("COMMIT;");
    } catch (error) {
      console.log(error);
      await pool.query("ROLLBACK;");
      throw error;
    }
  }

  static async login(input) {
    try {
      const { email, password } = input;

      loginSchema.parse(input);

      const query = `SELECT * FROM "Users"
      WHERE email = $1;`;
      const values = [email];

      const { rows } = await pool.query(query, values);
      // console.log(rows);

      if (rows.length === 0) {
        throw {
          name: "InvalidUser",
        };
      }

      const comparePassword = checkPassword(password, rows[0].password);
      if (!comparePassword) {
        throw { name: "InvalidUser" };
      }

      const token = createToken({ email });

      return token;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async getBalance(email) {
    try {
      const query = `SELECT balance FROM "Users"
      WHERE email = $1;`;
      const values = [email];

      const { rows } = await pool.query(query, values);
      // console.log(rows[0]);

      return { balance: rows[0].balance };
    } catch (error) {
      // console.log(error);
      throw error;
    }
  }

  static async topup(email, input) {
    try {
      const { top_up_amount } = input;
      topUpSchema.parse(input);

      const invoiceNumber = `INV-${Date.now()}`;

      await pool.query("BEGIN;");

      const query1 = `UPDATE "Users"
      SET balance = balance + $1
      WHERE email = $2;`;

      const query2 = `INSERT INTO "Transactions" (user_id, invoice_number, service_code, service_name, transaction_type, total_amount)
      VALUES ((SELECT id FROM "Users" WHERE email = $2), $3, 'TOPUP', 'Top Up', 'TOPUP', $1);`;

      const query3 = `SELECT balance FROM "Users"
      WHERE email = $1;`;

      const values = [top_up_amount, email];
      const values2 = [top_up_amount, email, invoiceNumber];
      const values3 = [email];

      await pool.query(query1, values);
      await pool.query(query2, values2);

      const { rows } = await pool.query(query3, values3);

      await pool.query("COMMIT;");

      return { balance: rows[0].balance };
    } catch (error) {
      await pool.query("ROLLBACK;");
      throw error;
    }
  }

  static async transaction(email, input) {
    try {
      const { service_code } = input;

      if (service_code !== "PULSA" && service_code !== "PLN_PRABAYAR") {
        throw {
          name: "InvalidService",
        };
      }

      let total_amount = 0;
      if (service_code === "PULSA") {
        total_amount = 10000;
      } else if (service_code === "PLN_PRABAYAR") {
        total_amount = 20000;
      }

      const invoiceNumber = `INV-${Date.now()}-${email}`;

      const query = `SELECT balance FROM "Users"
      WHERE email = $1;`;
      const values = [email];

      const { rows } = await pool.query(query, values);

      if (rows[0].balance < total_amount) {
        throw {
          name: "InsufficientBalance",
        };
      }

      await pool.query("BEGIN;");

      const query2 = `UPDATE "Users"
      SET balance = balance - $1
      WHERE email = $2;`;

      const query3 = `INSERT INTO "Transactions" (user_id, invoice_number, service_code, service_name, transaction_type, total_amount)
      VALUES ((SELECT id FROM "Users" WHERE email = $2), $3, $4, 'Service', 'PAYMENT', $1);`;

      const values2 = [total_amount, email];
      const values3 = [total_amount, email, invoiceNumber, service_code];

      await pool.query(query2, values2);
      await pool.query(query3, values3);

      await pool.query("COMMIT;");

      const query4 = `SELECT * FROM "Transactions"
      WHERE invoice_number = $1;`;
      const values4 = [invoiceNumber];

      const result = (await pool.query(query4, values4)).rows[0];

      const { invoice_number, service_name, transaction_type, created_on } =
        result;

      return {
        invoice_number,
        service_code: result.service_code,
        service_name,
        transaction_type,
        total_amount: result.total_amount,
        created_on,
      };
    } catch (error) {
      await pool.query("ROLLBACK;");
      throw error;
    }
  }
}

module.exports = Model;
