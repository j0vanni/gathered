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

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1w" });
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 24 * 7 * 60 * 60 * 1000, // 1 week in milliseconds
    expires: new Date(Date.now() + 24 * 7 * 60 * 60 * 1000),
  });
  res.redirect(`${process.env.URL}/auth/popup-close.html`);
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
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({ message: "success" });
};

getUser = (req, res) => {
  const token = req.cookies.token;
  if (token) {
    const decoded = decodeToken(token);
    res.json({ message: "success", token: decoded });
  } else {
    res.json({ message: "no token provided" });
  }
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
    highlight,
    muted,
    mutedForeground,
    border,
    info,
    success,
    warning,
    error,
  } = req.body;
  const user = req.user;
  try {
    await userService.saveColors(user.firebaseId, {
      background,
      foreground,
      primary,
      secondary,
      highlight,
      muted,
      mutedForeground,
      border,
      info,
      success,
      warning,
      error,
    });
    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to save colors" });
  }
};

getColors = async (req, res) => {
  const user = req.user;
  try {
    const colors = await userService.getColors(user.firebaseId);
    return res.status(200).json(colors);
  } catch (error) {
    return res.status(500).json({ error: "Failed to get colors" });
  }
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
