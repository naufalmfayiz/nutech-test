const Model = require("../models/model");

class Controller {
  static async register(req, res, next) {
    try {
      let input = req.body;

      let data = await Model.register(input);

      res.status(201).json({
        status: 0,
        message: "Registrasi berhasil silahkan login",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      let input = req.body;

      let data = await Model.login(input);

      res.status(200).json({
        status: 0,
        message: "Login Sukses",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getBalance(req, res, next) {
    try {
      const { email } = req.user;
      console.log(req.user);

      let data = await Model.getBalance(email);

      res.status(200).json({
        status: 0,
        message: "Get Balance Berhasil",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async topup(req, res, next) {
    try {
      const { email } = req.user;
      const input = req.body;

      let data = await Model.topup(email, input);

      res.status(200).json({
        status: 0,
        message: "Top Up Balance Berhasil",
        data,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async transaction(req, res, next) {
    try {
      const { email } = req.user;
      const input = req.body;

      let data = await Model.transaction(email, input);

      res.status(200).json({
        status: 0,
        message: "Transaksi berhasil",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
