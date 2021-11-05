const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const destinationSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    enum: ['open trip', 'private trip', 'honeymoon'],
    required: true,
  },
  activityLevel: {
    enum: ['leisurely', 'moderate', 'challenging'],
    required: true,
  },
  guide: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  },
  description: {
    type: String,
    default: '-',
  },
  benefits: {
    type: String,
    default: '-',
  },
  price: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  photo: {
    type: String,
    default: '-',
  },
  review: [
    {
      destination: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Reviews',
      },
    },
  ],
});

// add plugin that converts mongoose to json
destinationSchema.plugin(toJSON);

/**
 * @typedef destination
 */
const Destination = mongoose.model('Destination', destinationSchema);

module.exports = Destination;
