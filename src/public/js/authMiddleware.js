const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies?.token;
  
  if (!token) {
    console.log("Token não encontrado.");
    return res.status(401).json({ msg: "Acesso negado. Faça login novamente." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.log("Token inválido ou expirado.");
    res.status(403).json({ msg: "Token inválido." });
  }
};
