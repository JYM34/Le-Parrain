import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import apiRoutes from './routes/api.js';
import errorHandler from './middlewares/errorHandler.js';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sécurité & CORS
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://unpkg.com",
        "'unsafe-inline'",
        "'unsafe-eval'"  // Ajout ici
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
      baseUri: ["'self'"],
      fontSrc: ["'self'", "https:", "data:"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      imgSrc: ["'self'", "data:"],
      scriptSrcAttr: ["'none'"],
      styleSrc: ["'self'", "https:", "'unsafe-inline'"]
    }
  }
}));

app.use(cors());

// Parsing JSON
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Routes API
app.use('/api', apiRoutes);

// Toutes autres routes retournent index.html (frontend SPA)
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware gestion des erreurs
app.use(errorHandler);

// Lancer serveur
app.listen(port, () => {
  console.log(`🚀 Le Parrain est lancé sur http://localhost:${port}`);
});
