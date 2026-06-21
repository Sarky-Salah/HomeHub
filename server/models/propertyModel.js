// server/models/propertyModel.js

const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    property_name: String,
    landlord_name: String,
    contact: String,
    price: Number,
    location: String,
    latitude: Number,
    longitude: Number,

    availability: {
      type: Boolean,
      default: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    
    description: String,
    category: String,
    images: [String],
    videos: [String],

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Property", propertySchema);