const express = require("express");
const router = express.Router();
const detailsController = require("../controllers/detailsController");
const authController = require("../controllers/authController");

router.get("/tv", authController.verifyToken, detailsController.getDetailsTV);
router.get(
  "/tv/episode",
  authController.verifyToken,
  detailsController.getEpisodeDetails
);
router.get(
  "/movie",
  authController.verifyToken,
  detailsController.getDetailsMovie
);

module.exports = router;
