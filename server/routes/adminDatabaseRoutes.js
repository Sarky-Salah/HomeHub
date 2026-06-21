const express = require("express");
const router = express.Router();

const protect = require("../middleware/middleware");
const isAdmin = require("../middleware/AdminMiddleware");

const { getCollections } = require("../controllers/AdminController");

//GET DATABASE
router.get("/collections", protect, isAdmin, getCollections);

module.exports = router;