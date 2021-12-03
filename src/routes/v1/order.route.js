const express = require('express');
// const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const orderValidation = require('../../validations/order.validation');
const orderController = require('../../controllers/order.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(orderValidation.createOrder), orderController.createOrder)
  .get(validate(orderValidation.getOrders), orderController.getOrders);

router
  .route('/:orderId')
  .get(orderController.getOrder)
  .put(validate(orderValidation.updateOrder), orderController.updateOrder)
  .delete(validate(orderValidation.deleteOrder), orderController.deleteOrder);

module.exports = router;
