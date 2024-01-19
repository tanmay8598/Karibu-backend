const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
    },
    shippingAddress: {
      address: { type: String, required: false },
      city: { type: String, required: false },
      zone: { type: String, required: false },
      region: { type: String, required: false },
      country: { type: String, required: false, default: "Qatar" },
      mobileNumber: { type: Number, required: false },
      email: { type: String, required: false },
    },

    // reviews: [reviewSchema],
    pushToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bycrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bycrypt.genSalt(10);
  this.password = await bycrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
