const productModel = require('../models/productSchema');
const userModel = require('../models/userSchema');
const logger = require('../config/logger-config');
const createProduct = async (req, res) => {
    try {
        let { name, description, price, discount, category } = req.body;
        if (!name || !description || !price || !category) {
            res.status(401).send('fields are required')
        }

        let product = await productModel.create({
            name,
            description,
            price,
            discount,
            category,
            image: req.file
                ? {
                    data: req.file.buffer,
                    contentType: req.file.mimetype
                }
                : undefined,

        });

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });
    }

    catch (err) {
        console.error("CREATE PRODUCT ERROR:", err.message);
        res.status(500).json({
            success: false,
            message: "Failed to create product"
        });
    }
}

const getAllProducts = async (req, res) => {
    try {
        let products = await productModel.find();

        res.status(201).json({
            success: true,
            products
        })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json({
            success: false,
            message: 'error in products'
        })
    }
}

const getSingleProduct = async (req, res) => {
    try {
        let product = await productModel.findOne({ _id: req.params.id });

        res.status(201).json({
            success: true,
            product
        })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json({
            success: false,
            message: 'error in product'
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        let { name, description, price, discount, category } = req.body;

        let updateData = {
            name,
            description,
            price,
            discount,
            category,
            image: req.file ? {
                data: req.file.buffer,
                contentType: req.file.mimetype
            } : undefined,
        };

        let product = await productModel.findByIdAndUpdate(req.params.id, updateData, { new: true });

        res.status(201).json({
            success: true,
            message: "Product updated successfully",
            product
        })
    }


    catch (err) {
        console.log(err.message);
        res.status(500).json({
            success: false,
            message: 'error in updating product'
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        let product = await productModel.findByIdAndDelete(req.params.id);

        res.status(201).json({
            success: true,
            message: 'Product deleted successfully',
            product
        })
    }
    catch (err) {
        console.log(err.message);
        res.status(500).json({
            success: false,
            message: 'error in deleting product'
        })
    }
};

const addToCart = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // 🔍 Check if product already exists in cart
    const existingItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      // ➕ Increase quantity
      existingItem.quantity += quantity;
    } else {
      // ➕ Add new product
      user.cart.push({
        productId,
        quantity,
      });
    }

    await user.save();

    res.status(201).json({
      success: true,
      message: "Product added to cart",
      cart: user.cart,
    });

  } catch (err) {
    console.error("ADD TO CART ERROR:", err.message);
    res.status(500).json({
      success: false,
      message: "Error adding product to cart",
    });
  }
};

const Cart = async (req, res) => {
    try{
        const user = await userModel.findOne({ email: req.user.email }).populate('cart.productId');

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            cart: user.cart
        });

    } catch(err){
        logger.error("CART FETCH ERROR:", err.message);
        res.status(500).json({
            success: false,
            message: "Error fetching cart"
        });
    }
}

const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await userModel.findOneAndUpdate(
      { email: req.user.email },
      { $pull: { cart: { productId } } },
      { new: true } // return updated document
    ).populate("cart.productId");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: user.cart,
    });

  } catch (err) {
    console.error("REMOVE CART ITEM ERROR:", err.message);
    res.status(500).json({
      success: false,
      message: "Error removing item from cart",
    });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid data",
      });
    }

    const user = await userModel.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cartItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    cartItem.quantity = quantity;

    await user.save();
    await user.populate("cart.productId");

    res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cart: user.cart,
    });
  } catch (err) {
    console.error("UPDATE CART ERROR:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to update quantity",
    });
  }
};

module.exports = { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct, addToCart, Cart, removeCartItem, updateCartQuantity };