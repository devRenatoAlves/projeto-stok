const express = require ("express");
const exphbs = require ("express-handlebars");
const pool = require ("./db/conn");
const app = express();

app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(express.json());

app.use(express.static("public"));
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

///////////////////////////////////////////////////////////////////TELA DE LOGIN


app.get("/", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  const sql = `INSERT INTO users  (usersname, password) VALUES (?, ?)`
  const data = [username, password];

  pool.query(sql, data, function (data, err) {
    if(err) {
      console.log("err")
    };
  });

  res.render("login")
});

///////////////////////////////////////////////////////////////////





/////////////////////////////////////////////////////////////////////DEFININDO PORTA
app.listen(3000);