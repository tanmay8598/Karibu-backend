const express = require("express");
const {
  getVendors,
  registerVendor,
  authVendor,
  getVendorProfile,
  updateVendorProfile,
  deleteVendor,
  getVendorById,
  updateVendor,
  approveVendor,
  getUnapprovedVandors,
  getVendorByCategory,
} = require("../controller/vendorController");
const admin = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").post(registerVendor).get(getVendors);
router.post("/login", authVendor);
router.post("/approve", approveVendor);
router.get("/unapproved", getUnapprovedVandors);
router.get("/vendor-by-category", getVendorByCategory);

router.route("/profile").get(getVendorProfile).put(updateVendorProfile);
router
  .route("/:id")
  .delete(admin, deleteVendor)
  .get(admin, getVendorById)
  .put(admin, updateVendor);

module.exports = router;
