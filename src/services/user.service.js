const httpStatus = require('http-status');
const { User, Destination, Order } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUser = async (userId) => {
  const listUser = [];
  const user = await User.findOne({ _id: userId }).populate('favorites.destination');
  listUser.push(user);
  return listUser;
};

/**
 * Get user's favorites
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserFavorites = async (userId) => {
  const listFavorites = [];
  const user = await User.findOne({ _id: userId }).populate({ path: 'favorites.destination', model: 'Destination' }).exec();
  user.favorites.forEach((e) => listFavorites.push(e.destination));
  return listFavorites;
};

/**
 * Get user's orders
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserOrders = async (req) => {
  const listOrders = [];
  const user = await User.findOne({ _id: req.params.userId })
    .populate({ path: 'orders.order', populate: { path: 'destination' } })
    .exec();
  user.orders.forEach((e) => listOrders.push(e.order));
  return listOrders;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUser = async (userId, updateBody) => {
  const user = await User.findOneAndUpdate({ _id: userId }, updateBody);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUser = async (userId) => {
  const user = await getUser(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

/**
 * Update favorite by id
 * @param {ObjectId} destinationId
 * @param {Object} updateBody
 * @returns {Promise<favorite>}
 */
const updateFavorite = async (req) => {
  const destination = await Destination.findOne({ _id: req.body.destinationId });
  const user = await User.findOne({ _id: req.params.userId });
  user.favorites.forEach((e) => {
    if (e.destination._id.toString() !== destination._id.toString()) {
      user.favorites.push({ destination: destination._id });
      // console.log('added to favorite');
    }
  });
  user.save();
  return user;
};

/**
 * Add favorite by id
 * @param {ObjectId} destinationId
 * @param {Object} updateBody
 * @returns {Promise<favorite>}
 */
const createOrder = async (req) => {
  const date = new Date();
  const user = await User.findOne({ _id: req.params.userId });
  const destination = await Destination.findOne({ _id: req.body.destinationId });
  const order = await Order.create({
    status: 'waiting',
    destination: destination._id,
    dueDate: date.setDate(date.getDate() + 3),
    startDate: req.body.starDate,
    finishedDate: req.body.finishedDate,
    orderedBy: user._id,
  });
  user.orders.push({
    order: order._id,
  });
  user.save();
  return user;
};

const updateOrder = async (orderId, updateBody) => {
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'order not found');
  }
  order.status = updateBody;
  // Object.assign(order, updateBody);
  await order.save();
  return order;
};

const updateProductForGuide = async (destinationId, userId) => {
  const destination = await Destination.findById(destinationId);
  const user = await User.findById(userId);
  if (!destination || !user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Just not found');
  }
  user.guideDetails.products.push(destination);
  return user;
};

const updateGuideForUser = async (userId, body) => {
  const user = await User.findOneAndUpdate({ _id: userId }, body);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.save();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUser,
  getUserFavorites,
  getUserByEmail,
  updateUser,
  deleteUser,
  updateFavorite,
  updateOrder,
  createOrder,
  getUserOrders,
  updateProductForGuide,
  updateGuideForUser,
};
