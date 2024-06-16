const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const app = express();
const axios = require("axios");
const user = require("./routes/user");
const home = require("./routes/home");
const plant = require("./routes/plants");
const location = require("./routes/location");
const order = require("./routes/order");
const Order = require("./models/order");
const Location = require("./models/Location");
// const payment = require("./routes/payment");
//Morgan middleware
app.use(morgan("tiny"));

//regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cors middleware
app.use(cors({ origin: true, credentials: true }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next();
});

//Route handlers
app.use("/api/v1", user);
app.use("/api/v1", home);
app.use("/api/v1", plant);
app.use("/api/v1", location);
app.use("/api/v1", order);

//Token verification route

app.post("/api/v1/isTokenValid", async (req, res) => {
  const token = req.body.token;

  try {
    if (!token) {
      console.log("token", token);
      return next(new CustomError("Please login to get access", 401));
    }
    console.log("token", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    res.status(200).json({
      isValid: true,
      user,
      message: "Token is valid",
    });
  } catch (error) {
    res.status(401).json({
      isValid: false,
      message: "Token is invalid",
    });
  }
});

// Middleware to get raw body
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

app.post("/cashfree-webhook/:orderId", async (req, res) => {
  // Validate the incoming request (you may need to check signatures or use a secret)
  // Implement your security checks here based on Cashfree documentation

  // Get the raw body
  const rawBody = req.rawBody;
  const timestamp = req.headers["x-webhook-timestamp"];
  const signature = req.headers["x-webhook-signature"];

  console.log("rawBody", rawBody);
  console.log("timestamp", timestamp);
  console.log("signature", signature);
  // Compute the signature
  const secretKey = process.env.CASHFREE_SECRET;
  const body = timestamp + rawBody;
  const genSignature = crypto
    .createHmac("sha256", secretKey)
    .update(body)
    .digest("base64");

  // Verify the signature
  if (signature !== genSignature) {
    return res.status(400).send("Invalid signature");
  }

  const orderid = req.params.orderId;

  const order = await Order.findById(orderid);

  if (!order) {
    return res.status(404).send("Order not found");
  }

  console.log("order", order);

  const cfpaymentid = order.paymentDetails.transactionId;

  // get the order data from the order id using cashfree
  console.log("cfpaymentid", cfpaymentid);

  const url = "https://sandbox.cashfree.com/pg/orders/" + cfpaymentid;

  try {
    const response = await axios.get(url, {
      headers: {
        accept: "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": process.env.CASHFREE_CLIENT_ID,
        "x-client-secret": process.env.CASHFREE_SECRET,
      },
    });

    console.log(response.data);

    const greenPointsToAdd = order.orderAmount * 0.3;

    await User.findByIdAndUpdate(
      order.orderOwner,
      {
        $push: { orderHistory: order._id },
        $inc: { greenPoints: greenPointsToAdd },
      },
      { new: true }
    );

    await Location.findByIdAndUpdate(
      order.plantLocation,
      { $push: { plantingHistory: order.plantId } },
      { new: true }
    );

    // Respond to Cashfree with a success status
    res.status(200).send("Webhook received successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing webhook.");
  }
});
// app.use("/api/v1", payment);

//exporting app js
module.exports = app;

//testsuccess@gocash
