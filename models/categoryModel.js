const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  _id: Number,
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
  }, 
  bgcolor: {
    type: String,
  }, 
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
