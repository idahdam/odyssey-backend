const httpStatus = require('http-status');
const { User, Destination } = require('../models');
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
  const user = await User.findOne({ _id: userId }).populate('favorites');
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
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<favorite>}
 */
const updateFavorite = async (req) => {
  const destination = await Destination.findOne({ _id: req.body.destinationId });
  const user = await User.findOne({ _id: req.params.userId });
  user.favorites.push({ destination: destination._id });
  user.save();
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
};
