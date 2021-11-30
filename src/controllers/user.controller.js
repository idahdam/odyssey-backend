const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const getUserFavorites = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user.favorites);
});

const updateUser = catchAsync(async (req, res) => {
  const { description, favorites, address, name } = req.body;
  let body = {};
  if (req.file === undefined) {
    body = {
      name,
      description,
      favorites,
      address,
    };
  } else {
    body = {
      name,
      description,
      favorites,
      address,
      profilePicture: req.file.location,
    };
  }
  const user = await userService.updateUserById(req.params.userId, body);
  res.status(httpStatus.NO_CONTENT).send(user);
});

const updateFavorite = catchAsync(async (req, res) => {
  const { favorites } = req.body;
  let body = {};
  if (req.file === undefined) {
    body = {
      favorites,
    };
  } else {
    body = {
      favorites,
    };
  }
  const user = await userService.updateFavorite(req.params.userId, body);
  res.status(httpStatus.NO_CONTENT).send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUserFavorites,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateFavorite,
};
