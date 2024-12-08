const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controller");
const authentication = require("../middlewares/authenticate");

router.get("/", (req, res) => {
  res.send("Hello World!");
});

// Routes
// Register
router.post("/register", Controller.register);

// Login
router.post("/login", Controller.login);

// Balance
router.get("/balance", authentication, Controller.getBalance);

// Topup
router.post("/topup", authentication, Controller.topup);

// Transaction
router.post("/transaction", authentication, Controller.transaction);

module.exports = router;
