const express = require("express");
const {
  getBookings,
  getMyBookings,
  updateBookingDeliveryStatus,
  addBookingItems,
  getPendingBookings,
  getSalesDateRange,
  getBookingsByVendor,
} = require("../controller/bookingController");

const router = express.Router();

//products
router.route("/").get(getBookings);
router.route("/mybookings").get(getMyBookings);
router.route("/update").post(updateBookingDeliveryStatus);
router.route("/create-booking").post(addBookingItems);
router.route("/getPendingBookings").get(getPendingBookings);
router.route("/getsalesdaterange").get(getSalesDateRange);
router.route("/by-vendor").get(getBookingsByVendor);
// router.route("/online-failed").get(getFailedOnlineOrders);
// router.route("/update-order-to-unpaid").post(updateOrderToUnPaid);
// router.route("/update-order-to-paid-admin").post(updateOrderToPaidAdmin);F

module.exports = router;
