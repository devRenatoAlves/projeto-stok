
app.use('/auth', authRoutes);

const jwt = require('jsonwebtoken');

// Após validar usuário e senha:
const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

// Armazene o token no cookie (ou header)
res.cookie('token', token, { httpOnly: true, secure: false });
res.json({ msg: "Login bem-sucedido", token });
