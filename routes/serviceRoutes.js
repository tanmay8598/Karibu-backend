const express = require("express");
const {
  getServices,
  getBestSellingServices,
  searchService,
  createService,
  updateService,
  deleteService,
  getServiceByCategory,
  getServiceById,
  createServiceReview,
  getServiceByVendor,
} = require("../controller/serviceController");
const router = express.Router();

router.route("/").get(getServices);
router.route("/bestservices").get(getBestSellingServices);
// router.route("/sale-products").get(getsale);
router.route("/search").get(searchService);
router.route("/create").post(createService);
router.route("/update").post(updateService);
// router.route("/salebycategory").post(createsa);
// router.route("/salebysubcategory").post(createSaleBySubCategory);
// router.route("/salebyproduct").post(createSaleByProduct);
router.route("/delete").delete(deleteService);
router.route("/getServicesByCategory").get(getServiceByCategory);
// router.route("/get-productby-sub-category").get(getProductsBySubCategory);
// router.route("/get-productby-groupid").get(getProductByGroupId);
router.route("/get-serviceby-id").get(getServiceById);
router.route("/get-serviceby-vendorid").get(getServiceByVendor);
router.route("/create-review").post(createServiceReview);

module.exports = router;
