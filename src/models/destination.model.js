const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const destinationSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['open trip', 'private trip', 'honeymoon'],
    required: true,
  },
  activityLevel: {
    type: String,
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
    default: 'https://odyssey-bucket-rpl.s3.ap-southeast-1.amazonaws.com/User/User-518bc4dd-b6ce-4484-9ffd-1459328685c2.jpg',
  },
  review: [
    {
      destination: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Reviews',
        default: null,
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
