const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isGuide: {
      type: Boolean,
      default: false,
    },
    guideDetails: {
      isVerified: {
        type: Boolean,
        default: false,
      },
      guideName: {
        type: String,
        default: 'guide',
      },
      description: {
        type: String,
        default: '-',
      },
      contact: {
        type: String,
        default: '-',
      },
      products: [
        {
          destination: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Destination',
          },
        },
      ],
      bankType: {
        type: String,
        default: '-',
      },
      bankNumber: {
        type: Number,
        default: 0,
      },
      orders: [
        {
          order: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Order',
          },
        },
      ],
    },
    description: {
      type: String,
      default: '-',
    },
    favorites: [
      {
        destination: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Destination',
        },
      },
    ],
    profilePicture: {
      type: String,
      default:
        'https://odyssey-bucket-rpl.s3.ap-southeast-1.amazonaws.com/User/User-518bc4dd-b6ce-4484-9ffd-1459328685c2.jpg',
    },
    headerPicture: {
      type: String,
      default:
        'https://odyssey-bucket-rpl.s3.ap-southeast-1.amazonaws.com/User/User-518bc4dd-b6ce-4484-9ffd-1459328685c2.jpg',
    },
    address: {
      type: String,
      default: '-',
    },
    phone: {
      type: String,
      default: '082100000',
    },
    orders: [
      {
        order: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'Order',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
