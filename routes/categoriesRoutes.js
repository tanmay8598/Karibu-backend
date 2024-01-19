const express = require("express");
const {
  createCategory,
  getCategory,
  deleteCategory,
  getCategoryById,
} = require("../controller/categoryController");

const router = express.Router();

//products
router.route("/create").post(createCategory);
router.route("/all").get(getCategory);
router.route("/byid").get(getCategoryById);
router.route("/delete").delete(deleteCategory);

module.exports = router;
