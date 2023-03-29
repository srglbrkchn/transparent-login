const express = require("express");
const app = express();

app.use(express.static(__dirname + "/public"));

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

// register get route
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

// register post route
app.post("/register", (req, res) => {});

app.listen(3000, (req, res) => {
  console.log("The server is up and running!");
});
