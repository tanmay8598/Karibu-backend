const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken.js");
const User = require("../models/userModel.js");

// @desc    Auth user & get token
// @route   POST /api/users/login
//@access   Public

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,

      shippingAddress: user.shippingAddress,
      token: generateToken(
        user._id,
        user.name,
        user.email,
        user.shippingAddress
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

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(404);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
  });

  if (user) {
    // const reward = await UserReward.findOne({ user: user._id });
    // const amount = req.body?.amount ? req.body.amount : 0;
    // if (reward) {
    //   reward.amount = reward.amount + amount;
    //   const updatedReward = await reward.save();
    // } else {
    //   const reward = await UserReward.create({
    //     user: user._id,
    //     amount,
    //   });
    // }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,

      token: generateToken(
        user._id,
        user.name,
        user.email,
        user.shippingAddress
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

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      name: user.phone,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    // console.log(updatedUser);
    res.status(201).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,

      token: generateToken(
        updatedUser._id,
        updatedUser.name,
        updatedUser.email
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
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete users
// @route   DELETE /api/users/:id
// @access  Private/Admin

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user by Id
// @route   GET /api/users/:id
// @access  Private/Admin

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
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
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const saveShippingAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.userId);
  if (user) {
    user.shippingAddress.email =
      req.body.shippingAddress.email || user.shippingAddress.email;
    user.shippingAddress.address =
      req.body.shippingAddress.address || user.shippingAddress.address;
    user.shippingAddress.city =
      req.body.shippingAddress.city || user.shippingAddress.city;
    user.shippingAddress.zone =
      req.body.shippingAddress.zone || user.shippingAddress.zone;
    user.shippingAddress.region =
      req.body.shippingAddress.region || user.shippingAddress.region;
    user.shippingAddress.mobileNumber =
      req.body.shippingAddress.mobileNumber ||
      user.shippingAddress.mobileNumber;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      shippingAddress: updateUser.shippingAddress,
      token: generateToken(
        updatedUser._id,
        updatedUser.name,
        updatedUser.email,
        updatedUser.shippingAddress
      ),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  saveShippingAddress,
};
