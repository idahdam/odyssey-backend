const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { destinationService } = require('../services');

const createDestination = catchAsync(async (req, res) => {
  const { name, type, activityLevel, guide, description, benefits, price } = req.body;
  const body = {
    name,
    type,
    activityLevel,
    photo: req.file.location,
    // photo: 'https://odyssey-bucket-rpl.s3.ap-southeast-1.amazonaws.com/User/User-518bc4dd-b6ce-4484-9ffd-1459328685c2.jpg',
    guide,
    description,
    benefits,
    price,
  };
  const destination = await destinationService.createDestination(body);
  res.status(httpStatus.CREATED).send(destination);
});

const getDestination = catchAsync(async (req, res) => {
  const destination = await destinationService.getDestinationById(req);
  if (!destination) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Destination not found');
  }
  res.send(destination);
});

const getDestinations = catchAsync(async (req, res) => {
  const destination = await destinationService.getDestinations();
  if (!destination) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Destination not found');
  }
  res.status(httpStatus.OK).send(destination);
});

const getDestinationsByName = catchAsync(async (req, res) => {
  const destination = await destinationService.getDestinationByName(req.params.name, req.body);
  if (!destination) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Destination not found');
  }
  res.status(httpStatus.OK).send(destination);
});

const getDestinationsWithQuery = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await destinationService.queryDestination(filter, options);
  res.send(result);
});

const updateDestination = catchAsync(async (req, res) => {
  const destination = await destinationService.updateDestinationById(req.params.destinationId, req.body);
  res.send(destination);
});

const deleteDestination = catchAsync(async (req, res) => {
  await destinationService.deleteDestinationById(req.params.destinationId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createDestination,
  getDestination,
  getDestinations,
  updateDestination,
  deleteDestination,
  getDestinationsWithQuery,
  getDestinationsByName,
};
