// Cashfree payment routes

const express = require("express");
const router = express.Router();

const {
  createOrder,
  // verifyPayment,
} = require("../controllers/paymentController");

router.route("/createOrder").post(createOrder);

module.exports = router;
