const httpStatus = require('http-status');
// const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { reviewService } = require('../services');

const createReview = catchAsync(async (req, res) => {
  const { reviews, rating, destination } = req.body;
  const body = {
    photo: req.file.location,
    reviews,
    rating,
    destination,
  };
  const review = await reviewService.createReview(body);
  res.status(httpStatus.CREATED).send(review);
});

const getReview = catchAsync(async (req, res) => {
  const review = await reviewService.getReviewById(req);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  res.send(review);
});

const getReviewByDestination = catchAsync(async (req, res) => {
  const review = await reviewService.getReviewByDestination(req);
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
  const Review = await reviewService.updateReviewById(req);
  res.send(Review);
});

const deleteReview = catchAsync(async (req, res) => {
  await reviewService.deleteReviewById(req);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createReview,
  getReview,
  getReviews,
  updateReview,
  deleteReview,
  getReviewByDestination,
};
