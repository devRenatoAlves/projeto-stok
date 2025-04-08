const express = require("express");
const jwt = require("jsonwebtoken");
const pool = require("../database/conn.js");
const router = express.Router();
const authMiddleware = require('../public/js/authMiddleware.js');

// Rota para exibir o login
router.get("/", (req, res) => {
  res.render("login");
});

// Rota para validar o usuário
router.post("/verifyuser", (req, res) => {
  const { username, password } = req.body;
  console.log("Dados recebidos:", username, password);
  console.log("[POST] /login/verifyuser - Requisição recebida!");

  const sql = `SELECT * FROM users WHERE username = $1 AND password = $2`;
  const data = [username, password];

  pool.query(sql, data, (err, results) => {
    if (err) {
      console.error("Erro na consulta:", err);
      return res.redirect("/error");
    }

    console.log("Resultados da consulta:", results);

    // Corrigido para acessar `results.rows` corretamente
    if (results.rowCount === 0) {
      console.log("Usuário não encontrado. Redirecionando...");
      return res.redirect("/login-error");
    }

    // Gera o Token JWT após validação
    const user = results.rows[0];
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Define o Cookie JWT
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // true em produção com HTTPS
      sameSite: 'lax'
    });

    console.log("Login bem-sucedido. Redirecionando...");
    res.redirect("/estoque");
  });
});

// Rota protegida com middleware
router.get("/estoque", authMiddleware, (req, res) => {
  res.render("estoque", { user: req.user });
});

module.exports = router;
