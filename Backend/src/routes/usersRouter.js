const express = require('express');
const { register  } = require('../controllers/authController');
const router = express.Router();
const upload = require('../config/multer-config');
const { verifyEmail } = require("../controllers/verifyController");
const { login } = require("../controllers/loginController");



router.post('/register',upload.single('profilepic'), register);

router.get("/verify-email/:token", verifyEmail);

router.post("/login", login);


module.exports = router;
