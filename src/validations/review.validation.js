const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReview = {
  body: Joi.object().keys({
    photo: Joi.string(),
    review: Joi.string(),
    rating: Joi.number().integer(),
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

const getReview = {
  params: Joi.object().keys({
    ReviewId: Joi.string().custom(objectId),
  }),
};

const updateReview = {
  params: Joi.object().keys({
    ReviewId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      photo: Joi.string(),
      review: Joi.string(),
      rating: Joi.number().integer(),
    })
    .min(1),
};

const deleteReview = {
  params: Joi.object().keys({
    ReviewId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
};
