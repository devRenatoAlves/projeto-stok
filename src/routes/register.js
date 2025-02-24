const express = require("express");
const pool = require("../database/conn");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("register");
});

router.post("/insertuser", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Usuário e senha são obrigatórios.");
  }

  const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
  const data = [username, password];

  pool.query(sql, data, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erro ao cadastrar usuário.");
    }
    res.redirect("/login");
  });
});

module.exports = router;
