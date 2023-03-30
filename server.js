const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");

const initializePassport = require("./passport-config ");
initializePassport(passport);

const users = [];

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));

// set up ejs as a view engine
app.set("view-engine", "ejs");

// get route
app.get("/", (req, res) => {
  res.render("index.ejs", { name: "Sara" });
});

// login get route
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

// login post route
app.post("/login", (req, res) => {});

// register get route
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

// register post route
app.post("/register", async (req, res) => {
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

app.listen(3000, (req, res) => {
  console.log("The server is up and running!");
});
