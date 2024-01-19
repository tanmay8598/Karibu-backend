const asyncHandler = require("express-async-handler");

const generateTokenVendor = require("../utils/generateTokenVendor");
const Vendor = require("../models/vendorModel");

// @desc    Auth user & get token
// @route   POST /api/users/login
//@access   Public

const authVendor = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const vendor = await Vendor.findOne({ email });

  if (vendor && (await vendor.matchPassword(password))) {
    res.status(201).json({
      _id: vendor._id,
      name: vendor.name,
      email: vendor.email,
      registered: vendor.registered,

      token: generateTokenVendor(
        vendor._id,
        vendor.name,
        vendor.email,
        vendor.registered,
        vendor.phone,
        vendor.category,
        vendor.logo
      ),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    User registration
// @route   POST /api/users
//@access   Public

const registerVendor = asyncHandler(async (req, res) => {
  const { name, email, password, phone, category, registrationNumber } =
    req.body;

  const userExists = await Vendor.findOne({ email });

  if (userExists) {
    res.status(404);
    throw new Error("User already exists");
  }

  const vendor = await Vendor.create({
    name,
    email,
    password,
    category,
    registered: false,
    phone,
    registrationNumber,
  });

  if (vendor) {
    res.status(201).json({
      _id: vendor._id,
      name: vendor.name,
      email: vendor.email,
      registered: vendor.registered,
      phone: vendor.phone,
      token: generateTokenVendor(
        vendor._id,
        vendor.name,
        vendor.email,
        vendor.registered,
        vendor.phone,
        vendor.category,
        vendor.logo,
        vendor.registrationNumber
      ),
    });
  } else {
    res.status(404);
    throw new Error("Invalid user data");
  }
});

// @desc    Get user profile
// @route   GET /api/users/login
//@access   Private

const getVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.user._id);

  if (vendor) {
    res.json({
      _id: vendor._id,
      name: vendor.name,

      email: vendor.email,
      registered: vendor.registered,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.body.id);

  if (vendor) {
    vendor.name = req.body.name || vendor.name;
    vendor.email = req.body.email || vendor.email;
    vendor.phone = req.body.phone || vendor.phone;
    vendor.logo = req.body.logo || vendor.logo;
    if (req.body.password) {
      vendor.password = req.body.password;
    }

    const updatedUser = await vendor.save();
    // console.log(updatedUser);
    res.status(201).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateTokenVendor(
        updatedUser._id,
        updatedUser.name,
        updatedUser.email,
        updatedUser.registered,
        updatedUser.phone,
        updatedUser.category,
        updatedUser.logo
      ),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users
// @route   Get /api/users
// @access  Private/Admin
const getVendors = asyncHandler(async (req, res) => {
  const users = await Vendor.find({});
  res.json(users);
});
const getUnapprovedVandors = asyncHandler(async (req, res) => {
  const users = await Vendor.find({ registered: false });
  res.json(users);
});

// @desc    Delete users
// @route   DELETE /api/users/:id
// @access  Private/Admin

const deleteVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  if (vendor) {
    await vendor.remove();
    res.json({ message: "vendor removed" });
  } else {
    res.status(404);
    throw new Error("vendor not found");
  }
});

// @desc    Get user by Id
// @route   GET /api/users/:id
// @access  Private/Admin

const getVendorById = asyncHandler(async (req, res) => {
  const user = await Vendor.findById(req.params.id)
    .select("-password")
    .populate("category");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
const getVendorByCategory = asyncHandler(async (req, res) => {
  const user = await Vendor.find({ category: req.query.catId }).populate(
    "category"
  );

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);

  if (vendor) {
    vendor.name = req.body.name || vendor.name;
    vendor.email = req.body.email || vendor.email;
    vendor.registered = req.body.isAdmin || vendor.registered;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      registered: updatedUser.registered,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
const approveVendor = asyncHandler(async (req, res) => {
  console.log(req.body.id);
  const vendor = await Vendor.findById(req.body.id);

  if (vendor) {
    vendor.registered = true;

    const updatedUser = await vendor.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      registered: updatedUser.registered,
    });
  } else {
    res.status(404);
    throw new Error("Vendor not found");
  }
});

module.exports = {
  authVendor,
  registerVendor,
  getVendorProfile,
  updateVendorProfile,
  getVendors,
  deleteVendor,
  getVendorById,
  updateVendor,
  approveVendor,
  getUnapprovedVandors,
  getVendorByCategory,
};
