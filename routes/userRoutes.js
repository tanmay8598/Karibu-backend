const express = require("express");
const {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  saveShippingAddress,
} = require("../controller/userController");
const admin = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").post(registerUser).get(getUsers);
router.post("/login", authUser);
router.post("/saveshippingaddress", saveShippingAddress);

router.route("/profile").get(getUserProfile).put(updateUserProfile);
router
  .route("/:id")
  .delete(admin, deleteUser)
  .get(admin, getUserById)
  .put(admin, updateUser);

module.exports = router;
