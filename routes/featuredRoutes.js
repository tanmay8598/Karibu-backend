const express = require("express");
const {
  updatefeatured,
  createfeatured,
  getfeatured,
  getfeaturedById,
  deletefeatured,
} = require("../controller/featuredController");

const router = express.Router();

router.route("/create").post(createfeatured);
router.route("/update").post(updatefeatured);
router.route("/byId").get(getfeaturedById);
router.route("/all").get(getfeatured);
router.route("/delete").delete(deletefeatured);

module.exports = router;
