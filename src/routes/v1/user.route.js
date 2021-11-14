const express = require('express');
const uuid = require('uuid');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const config = require('../../config/config');
const { multerS3, s3, multer, checkFileType, path } = require('../../middlewares/multer');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

const uploadPhoto = multer({
  storage: multerS3({
    s3,
    bucket: `${config.aws.bucketName}/User`,
    acl: 'public-read',
    key(req, file, cb) {
      cb(null, path.basename(`User-${uuid.v4().toString()}${path.extname(file.originalname)}`));
    },
  }),
  limits: { fileSize: 5000000 }, // In bytes: 5000000 bytes = 5 MB
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

router
  .route('/')
  .post(auth(), validate(userValidation.createUser), userController.createUser)
  .get(validate(userValidation.getUsers), userController.getUsers);

router.route('/:userId/favorite').get(auth('editUser'), userController.getUserFavorites);

router
  .route('/:userId')
  .get(auth(), validate(userValidation.getUser), userController.getUser)
  .put(auth('editUser'), uploadPhoto.single('photo'), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth(), validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;
