const express = require("express");
const {
    createImageBanner, getImgBanners, deleteImgBanner
} = require("../controller/bannerController");

const router = express.Router();

//products
router.route("/create").post(createImageBanner);
router.route("/all").get(getImgBanners);
router.route("/delete").delete(deleteImgBanner);



module.exports = router;
