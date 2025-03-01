const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");
const searchController = require("../controllers/searchController");

router.get("/all", searchController.searchAll);
router.get("/movie", searchController.searchMovie);
router.get("/tv", searchController.searchTV);
router.get("/trending", searchController.getTrending);
module.exports = router;
