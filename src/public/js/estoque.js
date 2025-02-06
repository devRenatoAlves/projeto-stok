const nomeMaterial = document.querySelector(".nomeMaterial");
const qtdAtual = document.querySelector(".qtdAtual");
const qtdMinima = document.querySelector(".qtdMinima");
const qtdMaxima = document.querySelector(".qtdMaxima");
const btnAdd = document.querySelector(".btnAdd");
const lista = document.querySelector(".produto-estoque");

// Limpa os inputs
function limpaInputs() {
    document.querySelectorAll("input").forEach(input => {
        input.value = ""; // Limpa os campos
    });

    document.querySelector("input")?.focus(); // Foca no primeiro input
}

// Adiciona evento ao botão de adicionar
btnAdd?.addEventListener("click", function () {
    if (!nomeMaterial.value) {
        alert("Por favor, preencha o nome do material!");
        return;
    }

    const texto = `Material: ${nomeMaterial.value} | Atual: ${qtdAtual.value} | Mín: ${qtdMinima.value} | Máx: ${qtdMaxima.value}`;
    
    criaMaterial(texto);
});

// Cria um item <li>
function criaLi() {
    const li = document.createElement('li');
    return li;
}

// Remove um item ao clicar no botão "Apagar"
document.addEventListener("click", function (e) {
    const el = e.target;

    if (el.classList.contains("apagar")) {
        el.parentElement.remove();
        salvarTarefas();
    }
});

// Cria o item da lista com o texto e botão apagar
function criaMaterial(textoInput) {
    const li = criaLi();
    li.innerHTML = textoInput;
    lista.appendChild(li);
    
    criaBotaoApagar(li);
    salvarTarefas();
    limpaInputs();
}

// Cria o botão "Apagar" dentro do <li>
function criaBotaoApagar(li) {
    const botaoApagar = document.createElement("button");
    botaoApagar.setAttribute("class", "apagar");
    botaoApagar.innerText = "Apagar";
    li.appendChild(botaoApagar);
}

// Salva a lista de materiais no LocalStorage
function salvarTarefas() {
    const liTarefas = lista.querySelectorAll("li");
    const listaDeTarefas = [];

    for (let tarefa of liTarefas) {
        let tarefaTexto = tarefa.innerText.replace("Apagar", "").trim();
        listaDeTarefas.push(tarefaTexto);
    }

    const tarefasJSON = JSON.stringify(listaDeTarefas);
    localStorage.setItem("tarefas", tarefasJSON);
}

// Recupera as tarefas salvas ao carregar a página
function adicionaTarefasSalvas() {
    const tarefas = localStorage.getItem("tarefas");

    if (tarefas) {
        const listaDeTarefas = JSON.parse(tarefas);

        for (let tarefa of listaDeTarefas) {
            criaMaterial(tarefa);
        }
    }
}

// Chama a função para carregar os dados do LocalStorage
adicionaTarefasSalvas();
