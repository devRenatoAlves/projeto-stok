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

// Limpa os inputs após adicionar um material
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
                status: 'ativo' // Adicionando status ativo
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

// Cria o item da lista com imagem e informações
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
                apagarMaterial(imagemId); // Marca como apagado no banco
                li.remove();
            };

            li.appendChild(imgElement);
            li.appendChild(info);
            li.appendChild(botaoApagar);
            lista.appendChild(li);

            imgElement.onload = () => URL.revokeObjectURL(url);
        };

        getRequest.onerror = function () {
            console.error("Erro ao carregar imagem");
        };
    });
}

// Marca um material como apagado no banco de dados
function apagarMaterial(imagemId) {
    abrirBanco(function (db) {
        let transaction = db.transaction("imagens", "readwrite");
        let store = transaction.objectStore("imagens");
        let getRequest = store.get(imagemId);

        getRequest.onsuccess = function () {
            let imgData = getRequest.result;
            imgData.status = "apagado"; // Marca como apagado

            let updateRequest = store.put(imgData);
            updateRequest.onerror = function () {
                console.error("Erro ao atualizar o status do material");
            };
        };

        getRequest.onerror = function () {
            console.error("Erro ao recuperar material para apagar");
        };
    });
}

// Recupera os materiais do IndexedDB ao carregar a página
function carregarMateriais() {
    abrirBanco(function (db) {
        let transaction = db.transaction("imagens", "readonly");
        let store = transaction.objectStore("imagens");
        let getRequest = store.getAll();

        getRequest.onsuccess = function () {
            let imagens = getRequest.result;
            imagens.forEach(imagem => {
                // Só adiciona os materiais com status "ativo"
                if (imagem.status === "ativo") {
                    let li = document.createElement("li");
                    li.classList.add("produto-item");

                    let imgData = imagem;
                    let blob = new Blob([imgData.dados], { type: imgData.tipo });
                    let url = URL.createObjectURL(blob);

                    let imgElement = document.createElement("img");
                    imgElement.src = url;
                    imgElement.style.width = "100px";
                    imgElement.style.marginRight = "10px";

                    let info = document.createElement("div");
                    info.innerHTML = `
                        <p><strong>Nome do Material:</strong> ${imagem.nome}</p>
                        <p><strong>Quantidade Atual:</strong> ${qtdAtual.value}</p>
                        <p><strong>Quantidade Mínima:</strong> ${qtdMinima.value}</p>
                        <p><strong>Quantidade Máxima:</strong> ${qtdMaxima.value}</p>
                    `;

                    let botaoApagar = document.createElement("button");
                    botaoApagar.setAttribute("class", "apagar");
                    botaoApagar.innerText = "Apagar";
                    botaoApagar.onclick = function () {
                        apagarMaterial(imagem.id); // Marca como apagado no banco
                        li.remove();
                    };

                    li.appendChild(imgElement);
                    li.appendChild(info);
                    li.appendChild(botaoApagar);
                    lista.appendChild(li);
                }
            });
        };

        getRequest.onerror = function () {
            console.error("Erro ao carregar imagens");
        };
    });
}

const uploadArea = document.getElementById('uploadArea');

uploadArea.addEventListener('click', function() {
    inputImagem.click();
});

uploadArea.addEventListener('dragover', function(event) {
    event.preventDefault();
    this.classList.add('dragging');
});

uploadArea.addEventListener('dragleave', function() {
    this.classList.remove('dragging');
});

uploadArea.addEventListener('drop', function(event) {
    event.preventDefault();
    this.classList.remove('dragging');
    let file = event.dataTransfer.files[0];

    if (file) {
        console.log('Imagem carregada:', file.name);
    }
});

// Inicialização
document.addEventListener("DOMContentLoaded", carregarMateriais);
