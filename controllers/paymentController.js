const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utility/customError");
const Cashfree = require("cashfree-pg").Cashfree;

// Set Cashfree credentials and environment

console.log("Cashfree", Cashfree);

Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

exports.createOrder = BigPromise(async (req, res, next) => {
  console.log("createOrder");
  try {
    const request = {
      order_amount: "1",
      order_currency: "INR",
      customer_details: {
        customer_id: "node_sdk_test",
        customer_name: "",
        customer_email: "example@gmail.com",
        customer_phone: "9999999999",
      },
      order_meta: {
        return_url:
          "https://test.cashfree.com/pgappsdemos/return.php?order_id={order_id}",
      },
      order_note: "",
    };

    const response = await Cashfree.PGCreateOrder("2022-09-01", request);
    const orderData = response.data;

    // You can do further processing with orderData if needed

    res.status(200).json({ success: true, data: orderData });
  } catch (error) {
    console.error("Error setting up order request:", error);
    // You may want to customize the error response based on your requirements
    const errorMessage = error.response.data
      ? error.response.data.message
      : "Error creating order";
    next(new CustomError(errorMessage, 500));
  }
});
