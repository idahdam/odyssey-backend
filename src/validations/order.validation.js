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

const updateOrder = {
  params: Joi.object().keys({
    OrderId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      status: Joi.string().required().valid('waiting', 'success', 'failed'),
    })
    .min(1),
};

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