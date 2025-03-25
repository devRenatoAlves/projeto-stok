const express = require("express");
const router = express.Router();
const authMiddleware = require('../public/js/authMiddleware.js');

// Rota protegida
router.get("/", authMiddleware, (req, res) => {
  console.log(`Usuário logado: ${req.user.id}`); // Debug opcional
  res.render("estoque", { userId: req.user.id });
});

module.exports = router;
