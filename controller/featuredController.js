const asyncHandler = require("express-async-handler");
const Featured = require("../models/featuredModel");

const createfeatured = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const featured = Featured.create({
    service: id,
  });
  if (featured) {
    res.status(201).json(featured);
  } else {
    res.status(404);
    throw new Error("Error");
  }
});
const updatefeatured = asyncHandler(async (req, res) => {
  const { services } = req.body;
  const featured = Featured.findById(id);
  if (featured) {
    featured.service = services;

    const updatedfeatured = await featured.save();

    res.json(updatedfeatured);
  } else {
    res.status(404);
    throw new Error("featured not found");
  }
});
const getfeatured = asyncHandler(async (req, res) => {
  const featured = await Featured.find({}).populate({
    path: "service",
    populate: [
      {
        path: "category vendor",
      },
    ],
  });
  res.json(featured);
});
const getfeaturedById = asyncHandler(async (req, res) => {
  const featured = await Featured.findById(req.query.id);
  res.json(featured);
});
const deletefeatured = asyncHandler(async (req, res) => {
  await Featured.deleteOne({ _id: req.query.id });
  res.json("deleted");
});

module.exports = {
  updatefeatured,
  createfeatured,
  getfeatured,
  getfeaturedById,
  deletefeatured,
};
