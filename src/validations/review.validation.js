const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReview = {
  body: Joi.object().keys({
    photo: Joi.string(),
    reviews: Joi.string(),
    rating: Joi.number().integer(),
    destination: Joi.string().custom(objectId),
  }),
};

const getReviews = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getReviewById = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId),
  }),
};

const getReviewByDestination = {
  params: Joi.object().keys({
    destinationId: Joi.string().custom(objectId),
  }),
};

const updateReview = {
  params: Joi.object().keys({
    reviewId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    photo: Joi.string(),
    review: Joi.string(),
    rating: Joi.number().integer(),
  }),
};

const deleteReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
  getReviewByDestination,
  getReviewById,
};
