const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Vendor = require("../models/vendorModel");

router.post("/register-token", async (req, res) => {
  const user = await User.findById(req.body.user._id);

  if (user) {
    user.pushToken = req.body.token;

    const updatedUser = await user.save();
    res.status(201).send();
  } else {
    const vendor = await Vendor.findById(req.body.user._id);
    vendor.pushToken = req.body.token;

    const updatedVendor = await vendor.save();
    res.status(201).send();
  }
});

module.exports = router;
