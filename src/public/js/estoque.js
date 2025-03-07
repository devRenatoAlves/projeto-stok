const nomeMaterial = document.querySelector(".nomeMaterial");
const qtdAtual = document.querySelector(".qtdAtual");
const qtdMinima = document.querySelector(".qtdMinima");
const qtdMaxima = document.querySelector(".qtdMaxima");
const btnAdd = document.querySelector(".btnAdd");
const lista = document.querySelector(".produto-estoque");
const inputImagem = document.getElementById("inputImagem");

let db;

// Abre o IndexedDB
function abrirBanco(callback) {
    if (db) return callback(db);

    const request = indexedDB.open("MeuBanco", 1);

    request.onupgradeneeded = function (event) {
        let db = event.target.result;
        if (!db.objectStoreNames.contains("imagens")) {
            db.createObjectStore("imagens", { keyPath: "id", autoIncrement: true });
        }
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        callback(db);
    };

    request.onerror = function () {
        console.error("Erro ao abrir o IndexedDB");
    };
}

// impa os inputs após adicionar um material
function limpaInputs() {
    document.querySelectorAll("input").forEach(input => {
        input.value = "";
    });

    document.querySelector("input")?.focus();
}

// Adiciona evento ao botão
btnAdd?.addEventListener("click", function (event) {
    event.preventDefault();

    if (!nomeMaterial.value || !qtdAtual.value || !qtdMinima.value || !qtdMaxima.value || !inputImagem.files[0]) {
        alert("Preencha todos os campos e selecione uma imagem!");
        return;
    }

    let file = inputImagem.files[0];
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = function () {
        abrirBanco(function (db) {
            let transaction = db.transaction("imagens", "readwrite");
            let store = transaction.objectStore("imagens");

            let imagem = {
                nome: file.name,
                tipo: file.type,
                dados: reader.result,
            };

            let addRequest = store.add(imagem);
            addRequest.onsuccess = function (event) {
                let imagemId = event.target.result;
                criarMaterial(imagemId);
            };

            addRequest.onerror = function () {
                console.error("Erro ao salvar imagem");
            };
        });
    };
});

//  Cria o item da lista com imagem e informações
function criarMaterial(imagemId) {
    abrirBanco(function (db) {
        let transaction = db.transaction("imagens", "readonly");
        let store = transaction.objectStore("imagens");
        let getRequest = store.get(imagemId);

        getRequest.onsuccess = function () {
            let imgData = getRequest.result;
            let blob = new Blob([imgData.dados], { type: imgData.tipo });
            let url = URL.createObjectURL(blob);

            let li = document.createElement("li");
            li.classList.add("produto-item");

            let imgElement = document.createElement("img");
            imgElement.src = url;
            imgElement.style.width = "100px";
            imgElement.style.marginRight = "10px";

            let info = document.createElement("div");
            info.innerHTML = `
                <p><strong>Nome do Material:</strong> ${nomeMaterial.value}</p>
                <p><strong>Quantidade Atual:</strong> ${qtdAtual.value}</p>
                <p><strong>Quantidade Mínima:</strong> ${qtdMinima.value}</p>
                <p><strong>Quantidade Máxima:</strong> ${qtdMaxima.value}</p>
            `;

            let botaoApagar = document.createElement("button");
            botaoApagar.setAttribute("class", "apagar");
            botaoApagar.innerText = "Apagar";
            botaoApagar.onclick = function () {
                li.remove();
                salvarMateriais();
            };

            li.appendChild(imgElement);
            li.appendChild(info);
            li.appendChild(botaoApagar);
            lista.appendChild(li);

            salvarMateriais();
            limpaInputs();

            imgElement.onload = () => URL.revokeObjectURL(url);
        };

        getRequest.onerror = function () {
            console.error("Erro ao carregar imagem");
        };
    });
}

//  Salva os materiais no LocalStorage
function salvarMateriais() {
    const itens = [];
    document.querySelectorAll(".produto-item").forEach(li => {
        itens.push(li.innerHTML);
    });

    localStorage.setItem("materiais", JSON.stringify(itens));
}

// Recupera os materiais do LocalStorage ao carregar a página
function carregarMateriais() {
    const materiais = JSON.parse(localStorage.getItem("materiais"));

    if (materiais) {
        materiais.forEach(material => {
            let li = document.createElement("li");
            li.classList.add("produto-item");
            li.innerHTML = material;

            // Adiciona evento ao botão de apagar
            li.querySelector(".apagar")?.addEventListener("click", function () {
                li.remove();
                salvarMateriais();
            });

            lista.appendChild(li);
        });
    }
}

// Inicialização
document.addEventListener("DOMContentLoaded", carregarMateriais);
