const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();

//define paths for express config
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//set up static directory to serve
app.use(express.static(path.join(__dirname, "../public")));

//set up handle bars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Liny Thomas",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "Andrew Mead",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Contact Us",
    name: "Maxwell Michael",
    msg: "Please contact our call center for support",
  });
});
app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address!",
    });
  }
  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }
      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }
        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term!",
    });
  }
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "Error",
    msg: "Help article not found",
    name: "Liny Thomas",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "Error",
    msg: "Page not found",
    name: "Liny Thomas",
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
