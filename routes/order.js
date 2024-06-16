const express = require("express");
const router = express.Router();

const {
  createOrder,
  getAllOrdersOfUser,
} = require("../controllers/orderController");
const { isLoggedIn } = require("../middlewares/user");

router.route("/create-order").post(createOrder);
router.route("/get-orders").get(isLoggedIn, getAllOrdersOfUser);

module.exports = router;
