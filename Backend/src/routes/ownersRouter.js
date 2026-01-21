const express = require("express");
const router = express.Router();
const {
  createOwner,
  ownerLogin,
  getOwnerProfile,
} = require("../controllers/ownerController");
const isAdmin = require("../middlewares/isAdmin");

router.post("/create", createOwner);
router.post("/login", ownerLogin);
router.get("/me", isAdmin, getOwnerProfile);

module.exports = router;
