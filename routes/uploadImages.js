const express = require("express");
const multer = require("multer");

const router = express.Router();
const aws = require("aws-sdk");

const fs = require("fs");

let arr = [];

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

const uploadFile = async (file) => {
  arr = [];
  for (let i = 0; i < file.length; i++) {
    const ext = String(file[i].originalname).split(".")[1];
    const fileName = String(file[i].originalname).split(".")[0];
    const fileStream = fs.createReadStream(file[i].path);

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET,
      Body: fileStream,
      Key: `${fileName}.${ext}`,
    };

    const xyz = await s3.upload(uploadParams).promise();

    const st = String(xyz.Location);

    arr.push(st);
  }
  return arr;
};

const upload = multer({ dest: "uploads/" });

router.post("/uploadImages", upload.array("image", 150), async (req, res) => {
  const file = req.files;

  const result = await uploadFile(file);
  res.send(result);
  var folder = "./uploads/";
  fs.readdir(folder, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlinkSync(folder + file);
    }
  });
});

router.delete("/deleteImage", async (req, res) => {
  const image = req.query.image;
  const fileName = image.split("//")[1].split("/")[1];
  var params = { Bucket: process.env.AWS_BUCKET, Key: fileName };

  s3.deleteObject(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else res.status(201).json("deleted");
  });
});

module.exports = router;
