const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");

const aws = require("aws-sdk");

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

const createCategory = asyncHandler(async (req, res) => {
  const { id, name, description, photo, bgcolor } = req.body;

  const s = Category.create({
    _id: id,
    name,
    description,
    photo,
    bgcolor,
  });
  if (s) {
    res.status(201).json(s);
  } else {
    res.status(404);
    throw new Error("Error");
  }
});
const getCategory = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
});

const getCategoryById = asyncHandler(async (req, res) => {
  const categories = await Category.findById(req.query.id);
  res.json(categories);
});

const deleteCategory = asyncHandler(async (req, res) => {
  const subid = req.query.id;
  const sub = await Category.findById(subid);

  const f1 = sub.photo;
  const fileName = f1.split("//")[1].split("/")[1];

  var params = { Bucket: process.env.AWS_BUCKET, Key: fileName };

  s3.deleteObject(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log("Image deleted successfully");
  });

  await Category.deleteOne({ _id: req.query.id });
  res.json("deleted");
});

module.exports = {
  createCategory,
  getCategory,
  deleteCategory,
  getCategoryById,
};
