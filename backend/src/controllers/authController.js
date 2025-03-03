const jwt = require("jsonwebtoken");
const userService = require("../services/userService");

googleCallback = (req, res) => {
  const user = req.user;

  const payload = {
    firebaseId: user.id,
    googleId: user.googleId,
    email: user.email,
    displayName: user.displayName,
    photo: user.photo,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
  });

  const host = process.env.URL;

  res.redirect(`${host}/lists`);
};

verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "no token provided" });
  }
  try {
    const decoded = decodeToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "invalid token" });
  }
};

logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "success" });
};

getUser = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "no token provided" });
  }
  const decoded = decodeToken(token);
  res.json(decoded);
};

decodeToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error(error);
  }
};

saveColors = async (req, res) => {
  const {
    background,
    foreground,
    primary,
    secondary,
    muted,
    accent,
    card,
    border,
    sidebarBackground,
    sidebarForeground,
    sidebarPrimary,
    sidebarPrimaryForeground,
    sidebarAccent,
    sidebarAccentForeground,
    sidebarBorder,
  } = req.body;
  const user = req.user;
  try {
    await userService.saveColors(user.firebaseId, {
      background,
      foreground,
      primary,
      secondary,
      muted,
      accent,
      card,
      border,
      sidebarBackground,
      sidebarForeground,
      sidebarPrimary,
      sidebarPrimaryForeground,
      sidebarAccent,
      sidebarAccentForeground,
      sidebarBorder,
    });
    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to save colors" });
  }
};

getColors = async (req, res) => {
  const user = req.user;
  const colors = await userService.getColors(user.firebaseId);
  return res.status(200).json(colors);
};

module.exports = {
  googleCallback,
  verifyToken,
  logout,
  decodeToken,
  getUser,
  saveColors,
  getColors,
};
