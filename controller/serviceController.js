const asyncHandler = require("express-async-handler");
const Service = require("../models/serviceModel");
const Vendor = require("../models/vendorModel");
const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

const createService = asyncHandler(async (req, res) => {
  const {
    name,
    image,
    color,
    brand,
    category,
    vendor,
    size,
    description,
    details,
    sell_price,
    discount,
    city,
    notes,
  } = req.body;

  const product = await Service.create({
    name,
    image,
    color,
    brand,
    city,
    category,
    vendor,
    size,
    description,
    details,
    sell_price,
    discount,
    notes,
  });

  if (product) {
    const createdService = await product.save();
    res.status(201).json(createdService);
  } else {
    res.status(404);
    throw new Error("Product not created error");
  }
});

const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.query.id);

  if (service) {
    const images = service.image;
    for (let i = 0; i < images?.length; i++) {
      const fileName = images[i].split("//")[1].split("/")[1];
      var params = { Bucket: process.env.AWS_BUCKET, Key: fileName };

      s3.deleteObject(params, function (err, data) {
        if (err) console.log(err, err.stack);
        else console.log("Image deleted successfully");
      });
    }

    await Service.deleteOne({ _id: req.query.id });
    res.json({ message: "Service removed" });
  } else {
    res.status(404);
    throw new Error("Service not found");
  }
});

const getServices = asyncHandler(async (req, res) => {
  const { category, price, vendor, ratings } = req.query;

  const minprice = price ? price[0] : 0;
  const maxprice = price ? price[1] : 25000000000000;

  if (minprice || maxprice) {
    const filter = {
      category,
      vendor,

      rating: ratings,
    };

    const asArray = Object.entries(filter);

    const filtered = asArray.filter(([key, value]) => value);

    const justStrings = Object.fromEntries(filtered);

    const pageSize = 20;
    const page = Number(req.query.pageNumber) || 1;

    const count = await Service.countDocuments({
      $and: [
        justStrings,
        { sell_price: { $gte: minprice } },
        { sell_price: { $lte: maxprice } },
      ],
    });
    var pageCount = Math.floor(count / 10);
    if (count % 10 !== 0) {
      pageCount = pageCount + 1;
    }

    const products = await Service.find({
      $and: [
        justStrings,
        { sell_price: { $gte: minprice } },
        { sell_price: { $lte: maxprice } },
      ],
    })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .populate("category vendor");

    res.json({ products, pageCount });
  } else {
    const filter = {
      category,
      vendor,

      price,
      rating: ratings,
    };

    const asArray = Object.entries(filter);

    const filtered = asArray.filter(([key, value]) => value);

    const justStrings = Object.fromEntries(filtered);

    const pageSize = 20;
    const page = Number(req.query.pageNumber) || 1;

    const count = await Service.countDocuments(justStrings);
    var pageCount = Math.floor(count / 20);
    if (count % 20 !== 0) {
      pageCount = pageCount + 1;
    }

    const products = await Service.find(justStrings)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .populate("category vendor ");

    res.json({ products, pageCount });
  }
});

const getServiceByCategory = asyncHandler(async (req, res) => {
  const pageSize = 30;
  const page = Number(req.query.pageNumber) || 1;
  const count = await Service.countDocuments({ category: req.query.catId });
  var pageCount = Math.floor(count / 30);
  if (count % 30 !== 0) {
    pageCount = pageCount + 1;
  }
  const products = await Service.find({ category: req.query.catId })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate("category vendor");
  res.json({ products, pageCount });
});

const getServiceByVendor = asyncHandler(async (req, res) => {
  const pageSize = 30;
  const page = Number(req.query.pageNumber) || 1;
  const count = await Service.countDocuments({ vendor: req.query.SubCatId });
  var pageCount = Math.floor(count / 30);
  if (count % 30 !== 0) {
    pageCount = pageCount + 1;
  }
  const products = await Service.find({
    vendor: req.query.SubCatId,
  })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate("category vendor");
  res.json({ products, pageCount });
});

const getServiceById = asyncHandler(async (req, res) => {
  const product = await Service.findById(req.query.productId).populate(
    "category vendor"
  );
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Service not found");
  }
});

const createServiceReview = asyncHandler(async (req, res) => {
  const { rating, comment, user, serviceId } = req.body;

  const product = await Service.findById(serviceId);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === user.id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: user.name,
      rating: Number(rating),
      comment,
      user: user.id,
    };

    product.reviews.push(review);

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const updateService = asyncHandler(async (req, res) => {
  const {
    id,
    name,
    image,
    color,
    brand,
    category,
    vendor,
    size,
    description,
    details,
    sell_price,
    discount,
    notes,
  } = req.body;

  const product = await Service.findById(id);

  if (product) {
    product.name = name;
    product.image = image;
    product.description = description;
    product.brand = brand;
    product.category = category;
    product.vendor = vendor;
    product.color = color;
    product.size = size;
    product.details = details;
    product.sell_price = sell_price;
    product.discount = discount;
    product.notes = notes;

    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const searchService = asyncHandler(async (req, res) => {
  // const pageSize = 10;
  // const page = Number(req.query.pageNumber) || 1;

  const products = await Service.aggregate([
    {
      $search: {
        index: "default",
        text: {
          query: req.query.Query,
          path: ["name", "description", "details", "brand", "city"],
        },
      },
    },
  ]);
  // .limit(pageSize)
  // .skip(pageSize * (page - 1));

  await Vendor.populate(products, { path: "vendor" });

  if (products) {
    res.json(products);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const getBestSellingServices = asyncHandler(async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;
  const count = await Service.countDocuments();
  var pageCount = Math.floor(count / 20);
  if (count % 20 !== 0) {
    pageCount = pageCount + 1;
  }
  const products = await Service.find({})
    .sort({ rating: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate("size brand category vendor");

  res.json({ products, pageCount });
});

const getNewServices = asyncHandler(async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;
  const count = await Service.countDocuments();
  var pageCount = Math.floor(count / 20);
  if (count % 20 !== 0) {
    pageCount = pageCount + 1;
  }
  const products = await Service.find()
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate("category vendor");
  res.json({ products, pageCount });
});

module.exports = {
  createService,
  deleteService,
  updateService,
  getServices,
  getServiceById,
  createServiceReview,
  getServiceByCategory,
  getServiceByVendor,
  searchService,
  getBestSellingServices,
  getNewServices,
};
