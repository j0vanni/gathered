const express = require("express");
const router = express.Router();
const listController = require("../controllers/listController");
const authController = require("../controllers/authController");
const jwt = require("jsonwebtoken");

router.post("/create", authController.verifyToken, listController.createList);
router.post(
  "/addUser",
  authController.verifyToken,
  listController.addUserToList
);
router.get("/", authController.verifyToken, listController.getLists);
router.post(
  "/addItem",
  authController.verifyToken,
  listController.addItemToList
);
router.post(
  "/removeItem",
  authController.verifyToken,
  listController.removeItemFromList
);
router.post(
  "/updateWatching",
  authController.verifyToken,
  listController.updateWatching
);
router.post("/update", authController.verifyToken, listController.updateList);
router.post("/delete", authController.verifyToken, listController.deleteList);
router.post(
  "/removeUser",
  authController.verifyToken,
  listController.removeUserFromList
);

module.exports = router;
