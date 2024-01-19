const asyncHandler = require("express-async-handler");
const Booking = require("../models/bookingModel");
const Service = require("../models/serviceModel");
const User = require("../models/userModel");
const pdf = require("html-pdf");
const OrderPDF = require("./orderPdf");
const nodemailer = require("nodemailer");
const emailTemplate = require("../document/email");
const { startOfDay, endOfDay, parseISO } = require("date-fns");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendEmail = asyncHandler(
  async (orderItems, paymentMethod, totalPrice, user) => {
    const items = orderItems;
    var options = { format: "A4" };

    await pdf
      .create(OrderPDF({ items, user, paymentMethod, totalPrice }), options)
      .toFile(`${__dirname}/orderinvoice.pdf`, (err, res) => {
        transporter.sendMail({
          from: ` Monasbaty <sales@monasbaty.com>`, // sender address
          to: `${user.email}`, // list of receivers
          replyTo: `<sales@monasbaty.com>`,
          subject: `Booking Confirm ${user?.name}`, // Subject line
          text: `Booking from Monasbaty`, // plain text body
          html: emailTemplate(orderItems, paymentMethod, totalPrice), // html body
          attachments: [
            {
              filename: "orderinvoice.pdf",
              path: `${__dirname}/orderinvoice.pdf`,
            },
          ],
        });
      });
  }
);

const addBookingItems = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.userId);
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    totalPrice,
    deliveryStatus,
    userId,
    vendorId,
  } = req.body;

  if (paymentMethod == "COD") {
    const order = await Booking.create({
      orderItems,
      user: userId,
      vendor: vendorId,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      deliveryStatus,
      totalPrice,
    });
    if (order) {
      sendEmail(orderItems, paymentMethod, totalPrice, user);
      res.status(201).json(order);
    }
  } else {
    const order = await Booking.create({
      orderItems,
      user: userId,
      shippingAddress,
      //   paymentResult,
      //   paymentMethod,
      itemsPrice,
      deliveryStatus,

      //   shippingPrice,
      totalPrice,
      notes,
      deliverySlot,
      deliveryDate,
    });
    if (order) {
      res.status(201).json(order);
    }
  }
});

const getBookingById = asyncHandler(async (req, res) => {
  const order = await Booking.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const getMyBookings = asyncHandler(async (req, res) => {
  const pageSize = 30;
  const page = Number(req.query.pageNumber) || 1;
  const orders = await Booking.find({ user: req.query.userId })
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate("orderItems.service");
  res.json(orders);
});

const getBookingsByVendor = asyncHandler(async (req, res) => {
  console.log("first");
  const pageSize = 30;
  const page = Number(req.query.pageNumber) || 1;
  const count = await Booking.countDocuments({ vendor: req.query.userId });
  var pageCount = Math.floor(count / 30);
  if (count % 30 !== 0) {
    pageCount = pageCount + 1;
  }
  const orders = await Booking.find({ vendor: req.query.userId })
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate("user", "id name")
    .populate("vendor", "id name");
  res.json({ orders, count });
});

const getPendingBookings = asyncHandler(async (req, res) => {
  const count = await Booking.countDocuments({
    deliveryStatus: { $ne: "Delivered" },
  });
  const count2 = await Booking.countDocuments({
    deliveryStatus: "Cancelled",
  });
  const total = count - count2;

  res.json(total);
});

const getSalesDateRange = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const s1 = parseISO(startDate);
  const s2 = parseISO(endDate);
  const pageSize = 30;
  const page = Number(req.query.pageNumber) || 1;
  const count = await Service.countDocuments({ isPaid: true });
  var pageCount = Math.floor(count / 30);
  if (count % 30 !== 0) {
    pageCount = pageCount + 1;
  }
  const monthlySales = await Booking.find({
    $and: [
      {
        createdAt: {
          $gte: startOfDay(s1),
          $lte: endOfDay(s2),
        },
      },
      { deliveryStatus: "Completed" },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate("user", "id name")
    .populate("orderItems.service");

  res.json({
    monthlySales,
    pageCount,
  });
});

const updateBookingDeliveryStatus = asyncHandler(async (req, res) => {
  const { orderId, deliveryStatus } = req.body;
  console.log({ orderId, deliveryStatus });
  const order = await Booking.findOneAndUpdate(
    { _id: orderId },
    { deliveryStatus: deliveryStatus }
  );

  if (order) {
    order.deliveryStatus == "Delivered";
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const getBookings = asyncHandler(async (req, res) => {
  const pageSize = 30;
  const page = Number(req.query.pageNumber) || 1;
  const count = await Booking.countDocuments();
  var pageCount = Math.floor(count / 30);
  if (count % 30 !== 0) {
    pageCount = pageCount + 1;
  }
  const orders = await Booking.find()
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate("user", "id name")
    .populate("vendor", "id name");

  res.json({ orders, pageCount });
});

module.exports = {
  addBookingItems,
  getBookingById,
  updateBookingDeliveryStatus,
  getMyBookings,
  getBookingsByVendor,
  getBookings,
  getPendingBookings,
  getSalesDateRange,
};
