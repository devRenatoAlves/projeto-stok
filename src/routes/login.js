const express = require("express");
const pool = require("../database/conn.js");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("login");
});

router.post("/verifyuser", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
  const data = [username, password];

  pool.query(sql, data, (err, results) => {
    if (err) {
      console.log(err);
      return res.redirect("/error");
    }

    if (results.length === 0) {
      return res.redirect("/login-error");
    }

    res.redirect("/estoque");
  });
});

router.get("/login-error", (req, res) => {
  res.render("login-error", { title: "Erro de Login" });
});

module.exports = router;
