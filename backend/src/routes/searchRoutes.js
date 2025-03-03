const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");
const searchController = require("../controllers/searchController");

router.get("/all", authController.verifyToken, searchController.searchAll);
router.get("/movie", authController.verifyToken, searchController.searchMovie);
router.get("/tv", authController.verifyToken, searchController.searchTV);
router.get(
  "/trending",
  authController.verifyToken,
  searchController.getTrending
);

module.exports = router;
