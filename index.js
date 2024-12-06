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
  res.render("register")
}) 

app.post("/register/insertuser", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  const sql = `INSERT INTO login (username, password) VALUES (?, ?)`
  const data = [username, password];

  pool.query(sql, data, function (err) {
    if(err) {
      console.log(err)
    };

    res.redirect("/")
  });
});

app.get("/estoque", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  const sql = `SELECT * FROM login WHERE username = ? AND password = ?`;
  const data = [username, password];

  pool.query(sql, data, function(err, results) {

    if(err) {
      console.log(err)
    };

    if(results.length === false) {
      return res.render("login", {error: "Usuário ou senha incorretos"})
    }

  })

});

///////////////////////////////////////////////////////////////////


 


/////////////////////////////////////////////////////////////////////DEFININDO PORTA
app.listen(3000);