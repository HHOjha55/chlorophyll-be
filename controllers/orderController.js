const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utility/customError");
const Order = require("../models/order");
const User = require("../models/user");
const Plant = require("../models/Plant");
const Location = require("../models/Location");
const axios = require("axios");

exports.createOrder = BigPromise(async (req, res, next) => {
  try {
    const order = new Order({
      ...req.body,
    });

    console.log("order", order);

    const paymentResponse = await axios.post(
      "https://sandbox.cashfree.com/pg/orders",
      {
        order_amount: order.orderAmount,
        order_currency: "INR",
        customer_details: {
          customer_id: order.orderOwner,
          customer_name: order.orderMetaData.name,
          customer_phone: order.orderMetaData.contactno,
        },
        order_meta: {
          notify_url:
            "https://content-assured-alien.ngrok-free.app/cashfree-webhook/" +
            order._id,
        },
      },
      {
        headers: {
          "X-Client-Secret": process.env.CASHFREE_SECRET,
          "X-Client-Id": process.env.CASHFREE_CLIENT_ID,
          "x-api-version": "2023-08-01",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    console.log(paymentResponse.status);
    if (paymentResponse.status === 200) {
      console.log("Payment initiation successful");
      console.log("paymentResponse.data", paymentResponse.data);
      order.paymentDetails = {
        transactionId: paymentResponse.data.order_id,
        paymentStatus: paymentResponse.data.order_status,
      };

      await order.save();
      res.status(201).json({ order, paymentResponse: paymentResponse.data });
    } else {
      throw new Error("Payment initiation failed");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

exports.getAllOrdersOfUser = BigPromise(async (req, res, next) => {
  console.log("userId", req.user._id);
  try {
    if (!req.user) {
      throw new CustomError("User not found", 404);
    }

    // Fetch order list for the user
    const orderList = await Order.find({ orderOwner: req.user._id });

    // Function to populate plant details and location details for each order
    const populatePlantInfo = async (order) => {
      try {
        // Use populate to replace plantId and plantLocation with actual plant data
        const populatedOrder = await Order.populate(order, [
          { path: "plantId", model: Plant },
          { path: "plantLocation", model: Location },
        ]);

        return populatedOrder;
      } catch (error) {
        console.error("Error populating plant information:", error);
        throw error;
      }
    };

    // Use Promise.all to asynchronously populate details for all orders
    const populatedOrderList = await Promise.all(
      orderList.map(populatePlantInfo)
    );

    console.log("populatedOrderList", populatedOrderList);

    res.status(200).json(populatedOrderList);
  } catch (error) {
    next(error);
  }
});
