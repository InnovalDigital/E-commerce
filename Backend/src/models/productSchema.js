const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0, // percentage (0–100)
      min: 0,
      max: 100,
    },

    finalPrice: {
      type: Number,
    },

    category: {
      type: String,
      required: true,
      index: true,
    },

    image:{
      data: Buffer,
      contentType: String,
    },

    stock: {
      type: Number,
      default: 1,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

   owner: String,

  },
  {
    timestamps: true,
  }
);


// 🔹 Automatically calculate final price
productSchema.pre("save", function (next) {
  if (this.discount > 0) {
    this.finalPrice =
      this.price - (this.price * this.discount) / 100;
  } else {
    this.finalPrice = this.price;
  }

});

// Index for search
productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("product", productSchema);
