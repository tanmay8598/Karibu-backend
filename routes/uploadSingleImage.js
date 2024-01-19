const path = require("path");
const express = require("express");
const multer = require("multer");
const { dirname } = require("path");
const router = express.Router();
const aws = require("aws-sdk");

const fs = require("fs");

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

function uploadFile(singleFile) {
  const ext = String(singleFile.originalname).split(".")[1];
  const fileName = String(singleFile.originalname).split(".")[0];
  const fileStream = fs.createReadStream(singleFile.path);

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET,
    Body: fileStream,
    Key: `${fileName}.${ext}`,
  };

  return s3.upload(uploadParams).promise();
}

const upload = multer({ dest: "uploads/" });

router.post("/uploadSingleImage", upload.single("image"), async (req, res) => {
  const file = req.file;

  const result = await uploadFile(file);
  res.send(`${result.Location}`);
  // res.send(file?.destination + file?.filename + ".jpeg");
});

module.exports = router;
