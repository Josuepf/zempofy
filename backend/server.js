const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Funções de leitura e gravação do arquivo
function lerDados() {
    if (!fs.existsSync(DATA_FILE)) {
        return { pessoas: [], tarefasFeitas: [], locais: [] };
    }

    const data = fs.readFileSync(DATA_FILE, 'utf8');
    try {
        return JSON.parse(data);
    } catch {
        return { pessoas: [], tarefasFeitas: [], locais: [] };
    }
}

function salvarDados(objeto) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(objeto, null, 2));
}

// GET – pega todos os dados (pessoas, tarefasFeitas, locais)
app.get('/api/tarefas', (req, res) => {
    const dados = lerDados();
    res.json(dados);
});

// POST – salva todos os dados atualizados
app.post('/api/tarefas', (req, res) => {
    const novo = req.body;
    if (!novo.pessoas || !Array.isArray(novo.pessoas)) {
        return res.status(400).json({ erro: 'Formato inválido: precisa de pessoas' });
    }

    if (!novo.locais) novo.locais = []; // garante que locais sempre exista
    if (!novo.tarefasFeitas) novo.tarefasFeitas = [];

    salvarDados(novo);
    res.status(200).json({ mensagem: 'Dados salvos com sucesso' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
