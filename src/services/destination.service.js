/* eslint-disable no-plusplus */
/* eslint-disable no-console */
const httpStatus = require('http-status');
const { Destination } = require('../models');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Destination
 * @param {Object} DestinationBody
 * @returns {Promise<Destination>}
 */
const createDestination = async (DestinationBody) => {
  return Destination.create(DestinationBody);
};

/**
 * Query for Destination
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDestination = async (filter, options) => {
  const destination = await Destination.paginate(filter, options);
  return destination;
};

/**
 * Get Destination by id
 * @param {ObjectId} id
 * @returns {Promise<Destination>}
 */
const getDestinationById = async (id) => {
  return Destination.findById(id);
};

/**
 * Get Destinations
 * @param {ObjectId} id
 * @returns {Promise<Destination>}
 */
const getDestinations = async () => {
  return Destination.find();
};

/**
 * Get Destination by name
 * @param {String} name
 * @param {String} body
 * @returns {Promise<Destination>}
 */
const getDestinationByName = async (name, body) => {
  let destination = await Destination.find({ name: new RegExp(name, 'i') });
  if (body.activityLevel) {
    destination = destination.filter((params) => params.activityLevel === body.activityLevel);
  }
  if (body.type) {
    destination = destination.filter((params) => params.type === body.type);
  }
  if (body.minPrice) {
    destination = destination.filter((params) => params.price >= body.minPrice);
  }
  if (body.maxPrice) {
    destination = destination.filter((params) => params.price <= body.maxPrice);
  }
  if (body.guide === true) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < destination.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      const getUserById = await User.findById(destination[i].guide);
      console.log(getUserById);
      if (body.guide !== getUserById.guideDetails.isVerified) {
        destination.splice(i, 1);
      }
    }
  }

  return destination;
};

/**
 * Update Destination by id
 * @param {ObjectId} DestinationId
 * @param {Object} updateBody
 * @returns {Promise<Destination>}
 */
const updateDestinationById = async (DestinationId, updateBody) => {
  const destination = await getDestinationById(DestinationId);
  if (!destination) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Destination not found');
  }
  Object.assign(destination, updateBody);
  await destination.save();
  return destination;
};

/**
 * Delete Destination by id
 * @param {ObjectId} DestinationId
 * @returns {Promise<Destination>}
 */
const deleteDestinationById = async (DestinationId) => {
  const destination = await getDestinationById(DestinationId);
  if (!destination) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Destination not found');
  }
  await destination.remove();
  return destination;
};

module.exports = {
  getDestinations,
  getDestinationById,
  createDestination,
  queryDestination,
  updateDestinationById,
  deleteDestinationById,
  getDestinationByName,
};
