const express = require('express');
const { register, getAllUsers } = require('../controllers/authController');
const router = express.Router();
const upload = require('../config/multer-config');
const { verifyEmail } = require("../controllers/verifyController");
const { login } = require("../controllers/loginController");
const isLoggedIn = require('../middlewares/isLoggedIn');
const { addToCart, Cart, removeCartItem, updateCartQuantity } = require('../controllers/productController');


router.get('/', getAllUsers);

router.post('/register',upload.single('profilepic'), register);

router.get("/verify-email/:token", verifyEmail);

router.post("/login", login);

router.get('/cart', isLoggedIn, Cart);

router.post('/cart/add/:productId', isLoggedIn, addToCart);

router.delete('/cart/remove/:productId', isLoggedIn, removeCartItem);

router.put('/cart/update', isLoggedIn, updateCartQuantity);

module.exports = router;
