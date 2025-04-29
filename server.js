import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3001;

// ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir fichiers publics
app.use(express.static(path.join(__dirname, 'public')));

// Toutes autres routes retournent index.html
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Le Parrain est lancé sur http://localhost:${port}`);
});
