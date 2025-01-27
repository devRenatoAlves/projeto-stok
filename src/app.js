const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const app = express();
const registerRoutes = require("./routes/register");
const loginRoutes = require("./routes/login");
const estoqueRoutes = require("./routes/estoque");

// Middlewares
app.use(express.urlencoded({extended: true,}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Configurações do Handlebars
app.set("views", path.join(__dirname, "./views/pages"));
app.engine('handlebars', exphbs.engine({
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname,'views', 'partials'), 
  defaultLayout: 'main',
}));
app.set("view engine", "handlebars");

// Rotas
app.use("/", registerRoutes);
app.use("/login", loginRoutes);
app.use("/estoque", estoqueRoutes);

// Página de erro genérica
app.get("/error", (req, res) => {
  res.render("error", { title: "Erro no Servidor" });
});

// Definindo portas
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
