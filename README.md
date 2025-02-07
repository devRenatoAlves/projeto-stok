# STOKS 📦

<img src="./src/public/imgs/print-stoks-git-hub.png" alt="Page Stoks">

## Tecnologias usadas:
- Handlebars
- CSS
- JavaScript
- Node.js
- Express.js
- IndexedDB API
- MySQL
- DBeaver

## Sobre:
STOKS é um projeto de gerenciamento de estoque.

Fornece funcionalidades como:

- Inserir uma quantidade mínima e máxima para o estoque.  
  Assim, quando um determinado material atingir o estoque mínimo, o sistema avisará o usuário que é necessário fazer uma nova compra.  
  O estoque máximo serve como um limite para a quantidade daquele material.

- Utiliza a API IndexedDB para criar um estoque individual para cada usuário do STOKS.  
  Dessa forma, sempre que o usuário retornar ao site, seu estoque permanecerá exatamente como ele o deixou.

## Ajustes e melhorias

O projeto ainda está em desenvolvimento e as próximas atualizações serão voltadas para as seguintes tarefas:

- [ ] Ícone de conta na página de estoque
- [ ] Aviso de estoque mínimo
- [x] Fazer o formulário funcionar
- [ ] Fazer um footer
- [ ] Arrumar CSS dos elementos LI e UL

## 🚀 Executando o Projeto

Siga as instruções abaixo para executar o projeto em seu ambiente local:

1. **Clone o repositório:**

   ```
   git clone https://github.com/devRenatoAlves/projeto-stok
   ```

2. **Navegue até o diretório do projeto:**

   ```
   cd projeto-stok
   ```

3. **Instale as dependências:**

   ```
   npm install
   ```

4. **Execute o servidor:**

   ```
   npm start
   ```

5. **Acesse a aplicação:**

   Abra o seu navegador e digite o seguinte endereço:

   ```
   http://localhost:3000
   ```

   Agora você pode começar a utilizar a aplicação, criar, visualizar, atualizar e excluir tarefas.
