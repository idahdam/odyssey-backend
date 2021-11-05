const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const orderSchema = mongoose.Schema({
  status: {
    enum: ['waiting', 'success', 'failed'],
    require: true,
  },
  destination: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Destination',
  },
  dueDate: {
    type: Date,
    default: '2000-01-01',
  },
  startDate: {
    type: Date,
    default: '2000-01-01',
  },
  finishedDate: {
    type: Date,
    default: '2000-01-01',
  },
  orderedBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  },
});

// add plugin that converts mongoose to json
orderSchema.plugin(toJSON);

/**
 * @typedef order
 */
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
