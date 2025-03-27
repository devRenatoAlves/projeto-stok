  const express = require("express");
const pool = require("../database/conn.js");
const router = express.Router();

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
  } else {
    console.log("Conectado ao banco de dados.");
    connection.release();
  }
}); 

router.get("/", (req, res) => {
  res.render("register");
});

router.post("/insertuser", (req, res) => {
  const { username, password } = req.body;

  console.log("Dados recebidos:", req.body); // Debug
  if (!username || !password) {
    return res.status(400).send("Usuário e senha são obrigatórios.");
  }

  const sql = `INSERT INTO USERS (username, password) VALUES (?, ?)`;
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
