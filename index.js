const mysql = require ("mysql");
const express = require ("express");
const exphbs = require ("express-handlebars");

const app = express();

app.use(express.static("public"));

app.listen(3000)

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

app.get("/", (req, res) => {

  res.render("home")
});