const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");

const vendorSchema = mongoose.Schema(
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
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.Number,
      required: true,
      ref: "Category",
    },
    registered: {
      type: Boolean,
      required: true,
      default: false,
    },
    pushToken: {
      type: String,
    },
    logo: {
      type: String,
    },
    registrationNumber: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

vendorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bycrypt.compare(enteredPassword, this.password);
};

vendorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bycrypt.genSalt(10);
  this.password = await bycrypt.hash(this.password, salt);
});

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
