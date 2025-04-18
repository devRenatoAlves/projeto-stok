const express = require("express");
const pool = require("../database/conn.js");
const router = express.Router();


pool.query("SELECT NOW()")
  .then(() => console.log("Banco de dados conectado!"))
  .catch(err => console.error("Erro na conexão:", err));

router.get("/", (req, res) => {
  res.render("register");
});

router.post("/insertuser", (req, res) => {
  const { username, password } = req.body;

  console.log("Dados recebidos:", req.body); 
  if (!username || !password) {
    return res.status(400).send("Usuário e senha são obrigatórios.");
  }

  const sql = `INSERT INTO users (username, password) VALUES ($1, $2)`;
  const data = [username, password];

  pool.query(sql, data, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erro ao cadastrar usuário.");
  
    }

    res.redirect("/login");
  });
});

module.exports = router;
