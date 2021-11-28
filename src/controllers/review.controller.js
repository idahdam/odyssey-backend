const httpStatus = require('http-status');
// const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { reviewService } = require('../services');

const createReview = catchAsync(async (req, res) => {
  const review = await reviewService.createReview(req.body);
  res.status(httpStatus.CREATED).send(review);
});

const getReview = catchAsync(async (req, res) => {
  const review = await reviewService.getReviewById(req.params.ReviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  res.send(review);
});

const getReviews = catchAsync(async (req, res) => {
  // const filter = pick(req.query, ['name', 'role']);
  // const options = pick(req.query, ['sortBy', 'limit', 'page']);
  // const result = await reviewService.queryReview(filter, options);
  const result = await reviewService.getReviews();
  res.send(result);
});

const updateReview = catchAsync(async (req, res) => {
  const Review = await reviewService.updateReviewById(req.params.ReviewId, req.body);
  res.send(Review);
});

const deleteReview = catchAsync(async (req, res) => {
  await reviewService.deleteReviewById(req.params.ReviewId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createReview,
  getReview,
  getReviews,
  updateReview,
  deleteReview,
};
