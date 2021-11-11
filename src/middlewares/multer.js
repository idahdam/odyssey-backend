const AWS = require('aws-sdk');
const multer = require('multer');
const path = require('path');
const multerS3 = require('multer-s3');
const config = require('../config/config');

const s3 = new AWS.S3({
  accessKeyId: config.aws.accessKey,
  secretAccessKey: config.aws.secretKey,
  Bucket: config.aws.bucketName,
  region: 'ap-southeast-1',
});

function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb('Error: Images Only!');
}

module.exports = {
  s3,
  checkFileType,
  multerS3,
  multer,
  path,
};
