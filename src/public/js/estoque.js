const nomeMaterial = document.querySelector(".nomeMaterial");
const qtdAtual = document.querySelector(".qtdAtual");
const qtdMinima = document.querySelector(".qtdMinima");
const qtdMaxima = document.querySelector(".qtdMaxima");
const btnAdd = document.querySelector(".btnAdd");
const lista = document.querySelector(".produto-estoque");
const inputImagem = document.getElementById("inputImagem");

let db;

function abrirBanco(callback) {
  if (db) return callback(db);

  const request = indexedDB.open("MeuBanco", 2); // 🔹 Atualizando a versão do banco!

  request.onupgradeneeded = function (event) {
      let db = event.target.result;

      if (!db.objectStoreNames.contains("materiais")) {
          console.log("Criando objectStore 'materiais'...");
          db.createObjectStore("materiais", { keyPath: "id", autoIncrement: true });
      }
  };

  request.onsuccess = function (event) {
      db = event.target.result;
      console.log("Banco de dados aberto com sucesso!");
      callback(db);
  };

  request.onerror = function () {
      console.error("Erro ao abrir o IndexedDB");
  };
}


// Limpa os inputs após adicionar um material
function limpaInputs() {
    nomeMaterial.value = "";
    qtdAtual.value = "";
    qtdMinima.value = "";
    qtdMaxima.value = "";
    inputImagem.value = ""; // Reseta o input de imagem
    nomeMaterial.focus();
}

// Adiciona evento ao botão
btnAdd?.addEventListener("click", function (event) {
    event.preventDefault();
    console.log("Botão de adicionar clicado");

    if (!nomeMaterial.value || !qtdAtual.value || !qtdMinima.value || !qtdMaxima.value || !inputImagem.files[0]) {
        alert("Preencha todos os campos e selecione uma imagem!");
        return;
    }

    let file = inputImagem.files[0];
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = function () {
        abrirBanco(function (db) {
            console.log("Salvando material no banco...");
            let transaction = db.transaction("materiais", "readwrite");
            let store = transaction.objectStore("materiais");

            let material = {
                nome: nomeMaterial.value,
                qtdAtual: qtdAtual.value,
                qtdMinima: qtdMinima.value,
                qtdMaxima: qtdMaxima.value,
                imagem: {
                    nome: file.name,
                    tipo: file.type,
                    dados: reader.result
                },
                status: "ativo"
            };

            let addRequest = store.add(material);
            addRequest.onsuccess = function () {
                console.log("Material salvo com sucesso");
                carregarMateriais(); // Atualiza a lista
                limpaInputs(); // Limpa os inputs após adicionar
            };

            addRequest.onerror = function () {
                console.error("Erro ao salvar material");
            };
        });
    };
});

// Recupera os materiais do IndexedDB ao carregar a página
function carregarMateriais() {
    abrirBanco(function (db) {
        console.log("Carregando materiais...");
        let transaction = db.transaction("materiais", "readonly");
        let store = transaction.objectStore("materiais");
        let getRequest = store.getAll();

        getRequest.onsuccess = function () {
            lista.innerHTML = ""; // Limpa a lista antes de carregar

            let materiais = getRequest.result;
            console.log("Materiais encontrados:", materiais);

            materiais.forEach(material => {
                if (material.status === "ativo") {
                    let li = document.createElement("li");
                    li.classList.add("produto-item");

                    let imgData = material.imagem;
                    let blob = new Blob([imgData.dados], { type: imgData.tipo });
                    let url = URL.createObjectURL(blob);

                    let imgElement = document.createElement("img");
                    imgElement.src = url;
                    imgElement.style.width = "100px";
                    imgElement.style.marginRight = "10px";

                    let info = document.createElement("div");
                    info.innerHTML = `
                        <p><strong>Nome do Material:</strong> ${material.nome}</p>
                        <p><strong>Quantidade Atual:</strong> ${material.qtdAtual}</p>
                        <p><strong>Quantidade Mínima:</strong> ${material.qtdMinima}</p>
                        <p><strong>Quantidade Máxima:</strong> ${material.qtdMaxima}</p>
                    `;

                    let botaoApagar = document.createElement("button");
                    botaoApagar.setAttribute("class", "apagar");
                    botaoApagar.innerText = "Apagar";
                    botaoApagar.onclick = function () {
                        apagarMaterial(material.id);
                        li.remove();
                    };

                    li.appendChild(imgElement);
                    li.appendChild(info);
                    li.appendChild(botaoApagar);
                    lista.appendChild(li);

                    imgElement.onload = () => URL.revokeObjectURL(url);
                }
            });
        };

        getRequest.onerror = function () {
            console.error("Erro ao carregar materiais");
        };
    });
}

// Marca um material como apagado no banco de dados
function apagarMaterial(materialId) {
    abrirBanco(function (db) {
        let transaction = db.transaction("materiais", "readwrite");
        let store = transaction.objectStore("materiais");
        let getRequest = store.get(materialId);

        getRequest.onsuccess = function () {
            let material = getRequest.result;
            material.status = "apagado"; // Marca como apagado

            let updateRequest = store.put(material);
            updateRequest.onerror = function () {
                console.error("Erro ao atualizar o status do material");
            };
        };

        getRequest.onerror = function () {
            console.error("Erro ao recuperar material para apagar");
        };
    });
}

// Inicialização
document.addEventListener("DOMContentLoaded", carregarMateriais);
