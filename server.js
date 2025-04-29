import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';
import session from 'express-session';

import apiRoutes from './routes/api.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, 'users.json');

// ⚙️ Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'leparrainsecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 1000 * 60 * 60 * 2
  }
}));

// 🔐 Helmet CSP compatible PIXI
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://unpkg.com", "'unsafe-inline'", "'unsafe-eval'"],
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

// 🌍 CORS & JSON
app.use(cors());
app.use(express.json());

/** 🔐 ROUTES **/

// 👉 Inscription
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Champs manquants.' });
  }

  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE));
  }

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Nom déjà utilisé.' });
  }

  const mapPath = path.join(__dirname, 'public/world-map-data.json');
  let worldMap = JSON.parse(fs.readFileSync(mapPath));

  const banlieues = worldMap.entities.filter(e => e.type === 'banlieue');
  if (banlieues.length === 0) {
    return res.status(500).json({ message: 'Plus de banlieues disponibles.' });
  }

  const randomIndex = Math.floor(Math.random() * banlieues.length);
  const selectedTile = banlieues[randomIndex];
  selectedTile.type = 'slot';

  fs.writeFileSync(mapPath, JSON.stringify(worldMap, null, 2));

  // Copier le modèle de district
  const districtTemplatePath = path.join(__dirname, 'public/districts/district-template.json');
  const playerDistrictPath = path.join(__dirname, `public/districts/${username}.json`);
  try {
    fs.copyFileSync(districtTemplatePath, playerDistrictPath);
  } catch (err) {
    console.error('❌ Erreur district :', err);
    return res.status(500).json({ message: 'Erreur création du quartier joueur.' });
  }

  const newUser = {
    username,
    password,
    ressources: {
      cash: 100,
      influence: 0,
      soldiers: 0
    },
    slot: {
      x: selectedTile.x,
      y: selectedTile.y
    }
  };

  users.push(newUser);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  req.session.user = { username };

  res.json({ message: `Bienvenue ${username}, slot réservé en (${selectedTile.x}, ${selectedTile.y})` });
});

// 👉 Connexion
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Champs manquants.' });
  }

  const users = fs.existsSync(USERS_FILE) ? JSON.parse(fs.readFileSync(USERS_FILE)) : [];
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Identifiants invalides.' });
  }

  req.session.user = { username: user.username };
  res.json({ message: `Connexion réussie. Bienvenue ${username} !` });
});

// 👉 Session active ?
app.get('/api/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Non connecté' });
  }
  res.json({ user: req.session.user });
});

// 👉 Déconnexion
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Erreur lors de la déconnexion.' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Déconnecté.' });
  });
});

// 👉 Infos joueur
app.get('/api/user/:username', (req, res) => {
  const { username } = req.params;
  const users = fs.existsSync(USERS_FILE) ? JSON.parse(fs.readFileSync(USERS_FILE)) : [];
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(404).json({ message: 'Joueur introuvable' });
  }
  res.json(user);
});

// 🔄 Autres routes API
app.use('/api', apiRoutes);

// 🌐 Fichiers statiques
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// 🔁 Redirection root → jeu ou accueil
app.get('/', (req, res) => {
  if (req.session?.user) {
    res.redirect('/index.html');
  } else {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
  }
});

// ❌ Erreurs
app.use(errorHandler);

// 🚀 Démarrage serveur
app.listen(port, () => {
  console.log(`🚀 Le Parrain est lancé sur http://localhost:${port}`);
});
