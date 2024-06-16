const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema({
  plantName: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  plantDescription: {
    type: String,
    required: [true, "Please add a description"],
    trim: true,
    maxlength: [400, "Description cannot be more than 400 characters"],
  },
  plantImage: {
    type: String,
    trim: true,
    maxlength: [500, "Image cannot be more than 500 characters"],
  },
  plantPrice: {
    type: Number,
    required: [true, "Please add a price"],
    trim: true,
    maxlength: [10, "Price cannot be more than 10 characters"],
  },
  plantOtherName: {
    type: String,
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  soilCondition: {
    type: String,
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Plant", plantSchema);
