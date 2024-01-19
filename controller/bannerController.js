const asyncHandler = require("express-async-handler");
const Banner = require("../models/bannerModel");

const aws = require("aws-sdk");

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

const createImageBanner = asyncHandler(async (req, res) => {
  const { img, title } = req.body;

  const s = Banner.create({
    img,
    title,
  });
  if (s) {
    res.status(201).json(s);
  } else {
    res.status(404);
    throw new Error("Error");
  }
});

const getImgBanners = asyncHandler(async (req, res) => {
  const videos = await Banner.find({});
  res.json(videos);
});

const deleteImgBanner = asyncHandler(async (req, res) => {
  const imgId = req.query.id;
  const img1 = await Banner.findById(imgId);

  const f1 = img1.img;
  const fileName = f1.split("//")[1].split("/")[1];

  var params = { Bucket: process.env.AWS_BUCKET, Key: fileName };

  s3.deleteObject(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log("Image deleted successfully");
  });

  await Banner.deleteOne({ _id: req.query.id });
  res.json("deleted");
});

module.exports = { createImageBanner, getImgBanners, deleteImgBanner };
