const express = require("express");
const router = express.Router();
const detailsController = require("../controllers/detailsController");

router.get("/tv", detailsController.getDetailsTV);
router.get("/movie", detailsController.getDetailsMovie);

module.exports = router;
