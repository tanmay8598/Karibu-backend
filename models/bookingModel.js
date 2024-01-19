const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Vendor",
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true, default: 1 },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        service: {
          type: mongoose.Schema.Types.String,
          ref: "Service",
        },
        bookingDateTime: { type: String, required: true },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      zone: { type: String, required: true },
      region: { type: String, required: true },
      country: { type: String, required: false, default: "Qatar" },
      mobileNumber: { type: Number, required: true },
      email: { type: String, required: true },
    },
    emailDelivery: {
      type: String,
    },

    itemsPrice: {
      type: String,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    paidAt: {
      type: Date,
    },
    deliveryStatus: {
      type: String,
      enum: ["Processing", "Accepted", "Completed", "Cancelled"],
      default: "Processing",
    },
    deliveredAt: {
      type: Date,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
