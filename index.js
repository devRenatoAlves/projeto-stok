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

///////////////////////////////////////////////////////////////////TELA DE Registro

app.get("/", (req, res) => {
  res.render("register")
}) 

app.post("/register/insertuser", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  const sql = `INSERT INTO users (username, password) VALUES (?, ?)`
  const data = [username, password];

  pool.query(sql, data, function (err) {
    if(err) {
      console.log(err)
    };

    res.redirect("/")
  });
});

///////////////////////////////////////////////////////////// Tela de Login

app.get("/login", (req, res) => {
  res.render("login")
}) 


app.post("/login/verifyuser", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
  const data = [username, password];

  pool.query(sql, data, function (err, results) {
    if (err) {
      console.log(err);
      return res.redirect("/error"); // Redireciona para uma página de erro genérica
    }

    if (results.length === 0) {
      // Usuário ou senha incorretos
      return res.redirect("/login-error");
    }

    // Login bem-sucedido
    res.redirect("/estoque");
  });
});

app.get("/login-error", (req, res) => {
  res.render("login-error", { title: "Erro de Login" });
});

app.get("/error", (req, res) => {
  res.render("error", { title: "Erro no Servidor" });
});
 
/////////////////////////////////////////////////////////////////// TELA DE ESTOQUE

app.get("/estoque", (req, res) => {
  res.render("estoque")
});
 


/////////////////////////////////////////////////////////////////////DEFININDO PORTA
app.listen(3000);