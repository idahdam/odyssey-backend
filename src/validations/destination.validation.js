const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createDestination = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.string().required().valid('open trip', 'private trip', 'honeymoon'),
    activityLevel: Joi.string().required().valid('leisurely', 'moderate', 'challenging'),
    guide: Joi.string().custom(objectId),
    description: Joi.string().required(),
    benefits: Joi.string().required(),
    price: Joi.number().integer().required(),
    rating: Joi.number(),
    photo: Joi.string(),
    review: Joi.string().custom(objectId),
  }),
};

const getDestinations = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getDestination = {
  params: Joi.object().keys({
    destinationId: Joi.string().custom(objectId),
  }),
};

const getDestinationByName = {
  params: Joi.object().keys({
    name: Joi.string(),
  }),
};

const updateDestination = {
  params: Joi.object().keys({
    DestinationId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      type: Joi.string().required().valid('open trip', 'private trip', 'honeymoon'),
      activityLevel: Joi.string().required().valid('leisurely', 'moderate', 'challenging'),
      guide: Joi.string().custom(objectId),
      description: Joi.string(),
      benefits: Joi.string(),
      price: Joi.number().integer(),
      photo: Joi.string(),
    })
    .min(1),
};

const deleteDestination = {
  params: Joi.object().keys({
    DestinationId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createDestination,
  getDestinations,
  getDestination,
  updateDestination,
  deleteDestination,
  getDestinationByName,
};
