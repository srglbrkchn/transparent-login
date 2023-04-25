if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const initializePassport = require("./passport-config");
const methodOverride = require("method-override");

initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

const users = [];

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
// set up ejs as a view engine
app.set("view-engine", "ejs");

// get route
app.get("/", checkAuthenticated, (req, res) => {
  res.render("index.ejs", { name: req.user.name });
});

// login get route
app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

// login post route
app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// register get route
app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

// register post route
app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
    });
    res.redirect("/login");
  } catch (e) {
    console.log(e);
    res.redirect("/register");
  }
  console.log(users);
});

app.delete("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  } else {
    next();
  }
}

app.listen(3000, (req, res) => {
  console.log("The server is up and running!");
});
