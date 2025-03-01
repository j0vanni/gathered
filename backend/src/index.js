require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const searchRoutes = require("./routes/searchRoutes");
const detailsRoutes = require("./routes/detailsRoutes");
const listRoutes = require("./routes/listRoutes");
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoutes);
app.use("/search", searchRoutes);
app.use("/details", detailsRoutes);
app.use("/lists", listRoutes);

app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/auth/google");
  }
  res.json(req.user);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
