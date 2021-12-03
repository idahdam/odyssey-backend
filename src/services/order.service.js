const httpStatus = require('http-status');
const { Order } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a order
 * @param {Object} orderBody
 * @returns {Promise<Order>}
 */
const createOrder = async (orderBody) => {
  return Order.create(orderBody);
};

/**
 * Query for order
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryOrder = async (filter, options) => {
  const order = await Order.paginate(filter, options);
  return order;
};

/**
 * Get Order by id
 * @param {ObjectId} id
 * @returns {Promise<Order>}
 */
const getOrderById = async (req) => {
  const listOrder = [];
  const item = await Order.findOne({ _id: req.params.orderId });
  listOrder.push(item);
  return listOrder;
};

/**
 * Get Orders
 * @param {ObjectId} id
 * @returns {Promise<Order>}
 */
const getOrders = async () => {
  const item = await Order.find();
  return item;
};

/**
 * Get Order by guide
 * @param {ObjectId} orderedBy
 * @returns {Promise<Order>}
 */
const getOrderByGuide = async (orderedBy) => {
  return Order.find(orderedBy);
};

/**
 * Update order by id
 * @param {ObjectId} orderId
 * @param {Object} updateBody
 * @returns {Promise<Order>}
 */
const updateOrderById = async (orderId, updateBody) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'order not found');
  }
  order.status = updateBody;
  // Object.assign(order, updateBody);
  await order.save();
  return order;
};

/**
 * Delete order by id
 * @param {ObjectId} orderId
 * @returns {Promise<order>}
 */
const deleteOrderById = async (orderId) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'order not found');
  }
  await order.remove();
  return order;
};

module.exports = {
  createOrder,
  queryOrder,
  getOrderById,
  updateOrderById,
  deleteOrderById,
  getOrderByGuide,
  getOrders,
};
