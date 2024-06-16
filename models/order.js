const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderOwner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  orderAmount: {
    type: Number,
    default: 0,
    required: true,
  },
  orderMetaData: {
    contactno: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10,
      message: "Please add a contactno",
    },
    message: {
      type: String,
      required: true,
      message: "Pleasw add a message ",
    },
    name: { type: String, required: true, message: "Pleasw add a name" },
    occasion: {
      type: String,
      required: true,
      message: "Pleasw add a occasion ",
    },
  },
  plantId: {
    type: mongoose.Schema.ObjectId,
    ref: "Plant",
    required: true,
  },
  plantLocation: {
    type: mongoose.Schema.ObjectId,
    ref: "Location",
    required: true,
  },
  plantQuantity: {
    type: Number,
    default: 0,
    required: true,
    message: "Please add a plant quantity",
  },
  paymentDetails: {
    transactionId: {
      type: String,
    },
    paymentStatus: {
      type: String,
    },
  },
});

module.exports = mongoose.model("Order", orderSchema);
