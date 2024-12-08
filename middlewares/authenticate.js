const { pool } = require("../config");
const { verifyToken } = require("../helper/jwt");

const authentication = async (req, res, next) => {
  try {
    // console.log(req.headers.authorization);
    let access_token = req.headers.authorization;
    if (!access_token) {
      throw { name: "InvalidToken" };
    }

    let split_token = access_token.split(" ");
    let [bearer, token] = split_token;
    if (bearer !== "Bearer") {
      throw { name: "InvalidToken" };
    }

    let payload = verifyToken(token);

    const query = `SELECT * FROM "Users"
    WHERE email = $1;`;

    const values = [payload.email];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      throw { name: "InvalidToken" };
    }

    req.user = {
      email: rows[0].email,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
