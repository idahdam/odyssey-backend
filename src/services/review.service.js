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
const getReviewById = async (id) => {
  return Review.findById(id);
};

/**
 * Update Review by id
 * @param {ObjectId} ReviewId
 * @param {Object} updateBody
 * @returns {Promise<Review>}
 */
const updateReviewById = async (ReviewId, updateBody) => {
  const review = await getReviewById(ReviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  Object.assign(Review, updateBody);
  await review.save();
  return review;
};

/**
 * Delete Review by id
 * @param {ObjectId} ReviewId
 * @returns {Promise<Review>}
 */
const deleteReviewById = async (ReviewId) => {
  const review = await getReviewById(ReviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  await review.remove();
  return review;
};

module.exports = {
  createReview,
  queryReview,
  getReviewById,
  updateReviewById,
  deleteReviewById,
};