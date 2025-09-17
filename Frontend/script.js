const apiUrl = 'http://localhost:3000/tarefas';
const listaTarefas = document.getElementById('lista-tarefas');
const form = document.getElementById('form-tarefa');
const tituloInput = document.getElementById('titulo');
const descricaoInput = document.getElementById('descricao');
const erroMsg = document.getElementById('erro-msg');
let tarefas = [];

async function carregarTarefas() {
  const res = await fetch(apiUrl);
  tarefas = await res.json();
  renderizarTarefas();
}

function renderizarTarefas(filtro = 'todas') {
  listaTarefas.innerHTML = '';

  let tarefasFiltradas = tarefas;
  if (filtro === 'pendentes') {
    tarefasFiltradas = tarefas.filter(t => !t.concluida);
  } else if (filtro === 'concluidas') {
    tarefasFiltradas = tarefas.filter(t => t.concluida);
  }

  tarefasFiltradas.forEach(tarefa => {
    const li = document.createElement('li');
    li.className = tarefa.concluida ? 'concluida' : '';
    li.innerHTML = `
      <strong>${tarefa.titulo}</strong>: ${tarefa.descricao}
      <div style="margin-top: 10px;">
        <button onclick="concluirTarefa(${tarefa.id})" ${tarefa.concluida ? 'disabled' : ''}>
          ${tarefa.concluida ? 'Concluída ✓' : 'Marcar como Concluída'}
        </button>
        <button onclick="excluirTarefa(${tarefa.id})" style="background: red; color: white;">Excluir</button>
      </div>
    `;
    listaTarefas.appendChild(li);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const titulo = tituloInput.value.trim();
  const descricao = descricaoInput.value.trim();

  if (!titulo) {
    erroMsg.textContent = "O título é obrigatório.";
    return;
  }

  erroMsg.textContent = '';

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo, descricao })
  });

  const novaTarefa = await res.json();
  tarefas.push(novaTarefa);
  renderizarTarefas();
  form.reset();
});

async function concluirTarefa(id) {
  await fetch(`${apiUrl}/${id}/concluir`, { method: 'PATCH' });
  tarefas = tarefas.map(t =>
    t.id === id ? { ...t, concluida: true } : t
  );
  renderizarTarefas();
}

async function excluirTarefa(id) {
  await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
  tarefas = tarefas.filter(t => t.id !== id);
  renderizarTarefas();
}

function filtrar(tipo) {
  renderizarTarefas(tipo);
}

carregarTarefas();
