const express = require("express");
const router = express.Router();
const isAdmin = require("../middlewares/isAdmin");
const upload = require('../config/multer-config');
const { createProduct, getSingleProduct, getAllProducts, updateProduct, deleteProduct } = require("../controllers/productController");

router.get('/', getAllProducts);

router.get('/:id', getSingleProduct);

router.post("/create", upload.single('image'), createProduct);

router.put('/update/:id', upload.single('image'), updateProduct);

router.delete('/delete/:id', deleteProduct);

module.exports = router;
