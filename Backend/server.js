const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Simulando banco de dados (array em memória)
let tarefas = [
  { id: 1, titulo: "Estudar Node.js", descricao: "Ler documentação do Express", concluida: false },
  { id: 2, titulo: "Criar API", descricao: "Fazer os endpoints de tarefas", concluida: true },
  { id: 3, titulo: "Frontend", descricao: "Conectar com API via fetch", concluida: false },
];

// Rota raiz (só para evitar erro "Cannot GET /")
app.get('/', (req, res) => {
  res.send('API de Tarefas rodando. Use o endpoint /tarefas');
});

// GET /tarefas – Listar todas as tarefas
app.get('/tarefas', (req, res) => {
  res.json(tarefas);
});

// POST /tarefas – Criar nova tarefa
app.post('/tarefas', (req, res) => {
  const { titulo, descricao } = req.body;

  if (!titulo) {
    return res.status(400).json({ erro: "O campo 'titulo' é obrigatório." });
  }

  const novaTarefa = {
    id: Date.now(),
    titulo,
    descricao: descricao || '',
    concluida: false
  };

  tarefas.push(novaTarefa);
  res.status(201).json(novaTarefa);
});

// PATCH /tarefas/:id/concluir – Marcar como concluída
app.patch('/tarefas/:id/concluir', (req, res) => {
  const id = parseInt(req.params.id);
  const tarefa = tarefas.find(t => t.id === id);

  if (!tarefa) {
    return res.status(404).json({ erro: "Tarefa não encontrada." });
  }

  tarefa.concluida = true;
  res.json(tarefa);
});

// DELETE /tarefas/:id – Remover tarefa
app.delete('/tarefas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tarefas.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: "Tarefa não encontrada." });
  }

  tarefas.splice(index, 1);
  res.status(204).send();
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(` Servidor rodando em http://localhost:${PORT}`);
});
