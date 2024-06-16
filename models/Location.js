const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  city: {
    type: String,
    required: [true, "Please add a city"],
    trim: true,
    maxlength: [50, "City cannot be more than 50 characters"],
  },
  district: {
    type: String,
    required: [true, "Please add a district"],
    trim: true,
    maxlength: [50, "District cannot be more than 50 characters"],
  },
  state: {
    type: String,
    required: [true, "Please add a state"],
    trim: true,
    maxlength: [50, "State cannot be more than 50 characters"],
  },
  geoLocation: {
    latitude: {
      type: Number,
      required: [true, "Please add a latitude"],
      trim: true,
      maxlength: [50, "Latitude cannot be more than 50 characters"],
    },
    longitude: {
      type: Number,
      required: [true, "Please add a longitude"],
      trim: true,
      maxlength: [50, "Longitude cannot be more than 50 characters"],
    },
  },

  plantArea: {
    type: String,
    required: [true, "Please add a plantArea"],
    trim: true,
    maxlength: [50, "PlantArea cannot be more than 50 characters"],
  },
  plantingHistory: [
    { type: mongoose.Schema.ObjectId, ref: "Order", default: [] },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Location", LocationSchema);
