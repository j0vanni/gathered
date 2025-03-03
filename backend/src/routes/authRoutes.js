const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
  authController.googleCallback
);
router.get("/verify", authController.verifyToken);
router.get("/current_user", (req, res) => {
  res.json(
    req.user
      ? { status: "logged in", user: req.user }
      : { status: "not logged in" }
  );
});
router.get("/signout", authController.verifyToken, authController.logout);
router.get("/user", authController.verifyToken, authController.getUser);
router.post(
  "/saveColors",
  authController.verifyToken,
  authController.saveColors
);
router.get("/getColors", authController.verifyToken, authController.getColors);

module.exports = router;
