const express = require("express");
const pool = require("../database/conn");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("register");
});

router.post("/insertuser", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
  const data = [username, password];

  pool.query(sql, data, (err) => {
    if (err) {
      console.log(err);
      return res.redirect("/error");
    }
    res.redirect("/");
  });
});

module.exports = router;
