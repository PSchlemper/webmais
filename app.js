const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Array para armazenar os produtos (simulando um banco de dados)
let produtos = [];

// Configura o middleware para analisar dados de formulário
app.use(bodyParser.urlencoded({ extended: true }));

// Configura o middleware para servir arquivos estáticos (CSS, JavaScript, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Define a rota para a raiz do site
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para listar produtos
app.get('/produtos', (req, res) => {
  res.render('produtos', { produtos: produtos });
});

// Rota para adicionar comentário a um produto
app.post('/adicionar-comentario', (req, res) => {
  const { id, comentario } = req.body;
  const produto = produtos.find(prod => prod.id == id);
  if (produto) {
    // Adiciona apenas o texto do comentário ao produto
    produto.comentarios.push(comentario);
  }
  res.redirect('/produtos');
});

// Rota para exibir a página de adicionar comentário
app.get('/adicionar-comentario/:id', (req, res) => {
  const produtoId = req.params.id;
  res.render('add-comment', { produtoId: produtoId });
});

// Rota para cadastrar um novo produto
app.post('/cadastrar-produto', (req, res) => {
  const { codigo, comentarios, altura, largura, profundidade } = req.body;

  // Verifica se o código do produto já está em uso
  const produtoExistente = produtos.find(prod => prod.codigo === codigo);
  if (produtoExistente) {
    // Se o produto já existe, exibe um alerta na tela
    res.send('<script>alert("O código de produto já está em uso."); window.location.href = "/";</script>');
  } else {
    // Cria o novo produto
    const novoProduto = {
      id: produtos.length + 1,
      codigo: codigo,
      comentarios: [comentarios],
      altura: parseInt(altura),
      largura: parseInt(largura),
      profundidade: parseInt(profundidade)
    };

    // Adiciona o novo produto ao array de produtos
    produtos.push(novoProduto);

    // Redireciona o usuário para a lista de produtos
    res.redirect('/produtos');
  }
});

// Inicia o servidor na porta 3000
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

// Define o mecanismo de visualização como EJS
app.set('view engine', 'ejs');
