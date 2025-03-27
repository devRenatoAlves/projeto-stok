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
  console.log("Dados recebidos:", username, password); // Debug

  const sql = `SELECT * FROM USERS WHERE username = ? AND password = ?`;
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

    // Gera o Token JWT após validação
    const token = jwt.sign(
      { id: results[0].id, username: results[0].username },
      process.env.JWT_SECRET,  // Aqui estamos utilizando o segredo do .env
      { expiresIn: '1h' }
    );

    // Define o Cookie JWT
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: false, 
      sameSite: 'lax' 
    });

    console.log("Login bem-sucedido. Redirecionando...");
    res.redirect("/estoque"); // Redireciona após salvar o token
  });
});

// Rota protegida com middleware
router.get("/estoque", authMiddleware, (req, res) => {
  res.render("estoque", { user: req.user });
});

module.exports = router;
