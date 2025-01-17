const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the 'User' model
    required: true,
  },
  userinfo: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      // required: true,
    },
    birthdate: {
      type: Date,
      default: null,
    },
    birthtime: {
      type: String,
      default: null,
    },
    lefthandimg: {
      type: String,
      default: null,
    },
    righthandimg: {
      type: String,
      default: null,
    },
    question: {
      type: String,
      // required: true,
    },
    thecard: {
      type: String,
      default: null,
    },
    context: {
      type: String,
      default: null,
    },
  },
  Reporttype: {
    type: String,
   
  },
  totalPrice: {
    type: Number,
    // required: true,
  },
  receipt:{
    type: String,
  },
  transactionNo: {
    type: String,
    required: true,
  },
  orderid: {
    type: String,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  estimatedtimeforreport: {
    type: Date,
    
  },
  status: {
    type: Number,
    default: 1, // Default to 'pending'
  },
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
