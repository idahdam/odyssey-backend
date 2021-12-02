const express = require('express');
const uuid = require('uuid');
// const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');

const config = require('../../config/config');
const { multerS3, s3, multer, checkFileType, path } = require('../../middlewares/multer');
const reviewValidation = require('../../validations/review.validation');
const reviewController = require('../../controllers/review.controller');

const router = express.Router();

const uploadReview = multer({
  storage: multerS3({
    s3,
    bucket: `${config.aws.bucketName}/Reviews/`,
    acl: 'public-read',
    key(req, file, cb) {
      cb(null, path.basename(`Reviews-${uuid.v4().toString()}${path.extname(file.originalname)}`));
    },
  }),
  limits: { fileSize: 5000000 }, // In bytes: 5000000 bytes = 5 MB
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

router
  .route('/')
  .post(uploadReview.single('photo'), validate(reviewValidation.createReview), reviewController.createReview)
  .get(validate(reviewValidation.getReview), reviewController.getReviews);

router
  .route('/destination/:destinationId')
  .get(validate(reviewValidation.getReviewByDestination), reviewController.getReviewByDestination);

router
  .route('/:reviewId')
  .get(validate(reviewValidation.getReviewById), reviewController.getReview)
  .patch(validate(reviewValidation.updateReview), reviewController.updateReview)
  .delete(validate(reviewValidation.deleteReview), reviewController.deleteReview);

module.exports = router;
