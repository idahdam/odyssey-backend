const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const reviewSchema = mongoose.Schema({
  photo: {
    type: String,
    default: '-',
    index: true,
  },
  reviews: {
    type: String,
    default: '-',
  },
  rating: {
    type: Number,
    default: 0,
  },
  destination: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Destination',
    default: null,
  },
});

// add plugin that converts mongoose to json
reviewSchema.plugin(toJSON);

/**
 * @typedef review
 */
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
