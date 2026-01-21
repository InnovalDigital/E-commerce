const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    profilepic: {
      data: Buffer,
      contentType: String,
    },

    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],

    isAdmin: {
      type: Boolean,
      default: false,
    },

    verificationToken: String,

    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Index for faster login
userSchema.index({ email: 1 });

module.exports = mongoose.model("user", userSchema);
