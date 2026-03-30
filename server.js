import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;
const DATA_DIR = path.resolve('data');
const DATA_FILE = path.join(DATA_DIR, 'database.json');

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Garante que o diretório de dados existe
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Inicializa o arquivo de dados caso esteja vazio
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({}));
}

// ROTA: Carregar Estado Atual
app.get('/api/state', (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Erro ao ler dados do servidor.' });
  }
});

// ROTA: Salvar/Atualizar Estado
app.post('/api/state', (req, res) => {
  try {
    const currentData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const updates = req.body;
    
    // Mescla os dados recebidos com os dados existentes
    const newData = { ...currentData, ...updates };
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2));
    res.json({ success: true, message: 'Dados sincronizados com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar dados no servidor.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
