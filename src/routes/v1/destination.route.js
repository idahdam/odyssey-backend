const express = require('express');
const uuid = require('uuid');
const auth = require('../../middlewares/auth');
const config = require('../../config/config');
const { multerS3, s3, multer, checkFileType, path } = require('../../middlewares/multer');
const validate = require('../../middlewares/validate');
const destinationValidation = require('../../validations/destination.validation');
const destinationController = require('../../controllers/destination.controller');

const router = express.Router();

const uploadDestination = multer({
  storage: multerS3({
    s3,
    bucket: `${config.aws.bucketName}/Destination/`,
    acl: 'public-read',
    key(req, file, cb) {
      cb(null, path.basename(`Destination-${uuid.v4().toString()}${path.extname(file.originalname)}`));
    },
  }),
  limits: { fileSize: 5000000 }, // In bytes: 5000000 bytes = 5 MB
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

router
  .route('/')
  .post(
    auth(),
    uploadDestination.single('photo'),
    validate(destinationValidation.createDestination),
    destinationController.createDestination
  )
  .get(validate(destinationValidation.getDestinations), destinationController.getDestinations);

router
  .route('/name/:name')
  .get(auth(), validate(destinationValidation.getDestinationByName), destinationController.getDestinationsByName);

router
  .route('/filter')
  .get(validate(destinationValidation.getDestinationsByName), destinationController.getDestinationsByName);

router
  .route('/:destinationId')
  .get(validate(destinationValidation.getDestination), destinationController.getDestination)
  .patch(auth(), validate(destinationValidation.updateDestination), destinationController.updateDestination)
  .delete(auth(), validate(destinationValidation.deleteDestination), destinationController.deleteDestination);

module.exports = router;
