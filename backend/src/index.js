require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");
const cookieParser = require("cookie-parser");
const serverless = require("serverless-http");
const FirestoreStore = require("firestore-store")(session);
const admin = require("firebase-admin");
const authRoutes = require("./routes/authRoutes");
const searchRoutes = require("./routes/searchRoutes");
const detailsRoutes = require("./routes/detailsRoutes");
const listRoutes = require("./routes/listRoutes");
const PORT = process.env.PORT || 3000;
const app = express();
const db = require("./config/firebase");

app.set("trust proxy", 1);
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://gathered.onrender.com",
        "http://localhost:5173",
        "https://gathered.watch",
      ];
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    store: new FirestoreStore({
      database: db,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
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

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports.handler = serverless(app);
