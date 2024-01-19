const mongoose = require("mongoose");

const BannerSchema = mongoose.Schema({
  img: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const Banner = mongoose.model("Banner", BannerSchema);

module.exports = Banner;
