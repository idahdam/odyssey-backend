const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrder = {
  body: Joi.object().keys({
    status: Joi.string().valid('waiting', 'success', 'failed'),
    destination: Joi.string().custom(objectId),
    dueDate: Joi.date(),
    startDate: Joi.date(),
    finishedDate: Joi.date(),
    orderedBy: Joi.string().custom(objectId),
    totalPrice: Joi.number().integer(),
  }),
};

const getOrders = {
  query: Joi.object().keys({
    status: Joi.string(),
    destination: Joi.string(),
    dueDate: Joi.date(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getOrder = {
  params: Joi.object().keys({
    OrderId: Joi.string().custom(objectId),
  }),
};

const updateOrder = {};

const deleteOrder = {
  params: Joi.object().keys({
    OrderId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};
