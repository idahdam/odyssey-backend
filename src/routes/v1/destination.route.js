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
  .get(auth(), validate(destinationValidation.getDestinations), destinationController.getDestinations);

router
  .route('/:destinationId')
  .get(auth(), validate(destinationValidation.getDestination), destinationController.getDestination)
  .patch(auth(), validate(destinationValidation.updateDestination), destinationController.updateDestination)
  .delete(auth(), validate(destinationValidation.deleteDestination), destinationController.deleteDestination);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: destinations
 *   description: destination management and retrieval
 */

/**
 * @swagger
 * /destinations:
 *   post:
 *     summary: Create a destination
 *     description: Only admins can create other destinations.
 *     tags: [destinations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *               role:
 *                  type: string
 *                  enum: [destination, admin]
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *               role: destination
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/destination'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all destinations
 *     description: Only admins can retrieve all destinations.
 *     tags: [destinations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: destination name
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: destination role
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of destinations
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/destination'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /destinations/{id}:
 *   get:
 *     summary: Get a destination
 *     description: Logged in destinations can fetch only their own destination information. Only admins can fetch other destinations.
 *     tags: [destinations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: destination id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/destination'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a destination
 *     description: Logged in destinations can only update their own information. Only admins can update other destinations.
 *     tags: [destinations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: destination id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/destination'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a destination
 *     description: Logged in destinations can delete only themselves. Only admins can delete other destinations.
 *     tags: [destinations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: destination id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
