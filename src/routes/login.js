const express = require("express");
const pool = require("../database/conn.js");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("login");
});

router.post("/verifyuser", (req, res) => {
  const { username, password } = req.body;
  console.log("Dados recebidos:", username, password); // Debug

  const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
  const data = [username, password];

  pool.query(sql, data, (err, results) => {
    if (err) {
      console.log("Erro na consulta:", err);
      return res.redirect("/error");
    }

    console.log("Resultados da consulta:", results);

    if (results.length === 0) {
      console.log("Usuário não encontrado. Redirecionando...");
      return res.redirect("/login-error");
    }

    res.redirect("/estoque");
  });
});

module.exports = router;
