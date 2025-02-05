const nomeMaterial = document.querySelector(".nomeMaterial");
const qtdAtual = document.querySelector(".qtdAtual");
const qtdMinima = document.querySelector(".qtdMinima");
const qtdMaxima = document.querySelector(".qtdMaxima");
const btnAdd = document.querySelector(".btnAdd");


document.addEventListener("DOMContentLoaded", function () {
  function limpaInputs() {
      document.querySelectorAll("input").forEach(input => {
          input.value = ""; // Limpa o campo
      });

      document.querySelector("input")?.focus();
  }

  document.querySelector(".btnAdd")?.addEventListener("click", limpaInputs);

});
