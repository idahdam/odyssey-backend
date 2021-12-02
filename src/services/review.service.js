const httpStatus = require('http-status');
const { Review } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Review
 * @param {Object} ReviewBody
 * @returns {Promise<Review>}
 */
const createReview = async (ReviewBody) => {
  return Review.create(ReviewBody);
};

/**
 * Query for Review
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryReview = async (filter, options) => {
  const review = await Review.paginate(filter, options);
  return review;
};

/**
 * Get Review by id
 * @param {ObjectId} id
 * @returns {Promise<Review>}
 */
const getReviewById = async (req) => {
  const listReview = [];
  const item = await Review.findById(req.params.reviewId);
  listReview.push(item);
  return listReview;
};

/**
 * Get Review by destination
 * @param {ObjectId} reviewBy
 * @returns {Promise<Order>}
 */
const getReviewByDestination = async (req) => {
  const listReview = [];
  const item = await Review.find({ destination: req.params.destinationId });
  listReview.push(item);
  return listReview;
};

/**
 * Get Reviews
 * @param {ObjectId} id
 * @returns {Promise<Review>}
 */
const getReviews = async () => {
  return Review.find();
};

/**
 * Update Review by id
 * @param {ObjectId} reviewId
 * @param {Object} updateBody
 * @returns {Promise<Review>}
 */
const updateReviewById = async (req) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  Object.assign(review, req.body);
  await review.save();
  return review;
};

/**
 * Delete Review by id
 * @param {ObjectId} ReviewId
 * @returns {Promise<Review>}
 */
const deleteReviewById = async (req) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  await review.remove();
  return review;
};

module.exports = {
  createReview,
  queryReview,
  getReviews,
  getReviewById,
  updateReviewById,
  deleteReviewById,
  getReviewByDestination,
};
