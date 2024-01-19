require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const adminRoutes = require("./routes/adminRoutes");
const featuredRoutes = require("./routes/featuredRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const userRoutes = require("./routes/userRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const uploadRoutes = require("./routes/uploadSingleImage");
const categoryRoutes = require("./routes/categoriesRoutes");
const uploadImages = require("./routes/uploadImages");
const send = require("./routes/send");
const rnPushTokens = require("./routes/rnPushTokens");
const cors = require("cors");

const app = express();
const source = process.env.MONGO_URI;
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use("/api/rnPushTokens", rnPushTokens);
app.use("/api/admin", adminRoutes);
app.use("/api/sendNoti", send);
app.use("/api/banner", bannerRoutes);
app.use("/api/featured", featuredRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/user", userRoutes);
app.use("/api/uploadSingleImage", uploadRoutes);
app.use("/api/uploadImages", uploadImages);
app.use("/api/vendor", vendorRoutes);

mongoose
  .connect(source)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB connection error", err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Successfully served on port: ${PORT}.`);
});
