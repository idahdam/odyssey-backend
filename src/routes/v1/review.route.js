const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const reviewValidation = require('../../validations/review.validation');
const reviewController = require('../../controllers/review.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageReview'), validate(reviewValidation.createReview), reviewController.createReview)
  .get(auth('getReview'), validate(reviewValidation.getReview), reviewController.getReview);

router
  .route('/:reviewId')
  .get(auth('getReview'), validate(reviewValidation.getReview), reviewController.getReview)
  .patch(auth('manageReview'), validate(reviewValidation.updateReview), reviewController.updateReview)
  .delete(auth('manageReview'), validate(reviewValidation.deleteReview), reviewController.deleteReview);

module.exports = router;
