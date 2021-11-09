const httpStatus = require('http-status');
const { Destination } = require('../models');
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
 * @param {ObjectId} DestinationedBy
 * @returns {Promise<Destination>}
 */
const getDestinationByGuide = async (name) => {
  return Destination.find(name);
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
  getDestinationByGuide,
};
