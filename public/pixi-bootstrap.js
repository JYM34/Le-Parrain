import { HUD } from './hud.js';
import { MapController } from './map-controller.js';
import { Player } from './player.js';

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x1e1e1e
});
document.body.appendChild(app.view);

// Init HUD et MapController
const hud = new HUD();
const controller = new MapController(app);

let player = null;

// Fonction d'initialisation principale
async function initGame() {
  try {
    // 1. Vérifie si l'utilisateur est connecté
    const sessionRes = await fetch('/api/me');
    if (!sessionRes.ok) {
      window.location.href = '/home.html';
      return;
    }

    const { user } = await sessionRes.json();

    // 2. Récupère les données complètes du joueur
    const userRes = await fetch(`/api/user/${user.username}`);
    if (!userRes.ok) {
      console.error('❌ Utilisateur introuvable côté serveur');
      return;
    }

    const userData = await userRes.json();
    player = new Player(userData);

    // 3. Met à jour l'interface
    hud.update(player);
    controller.showWorldMap();

    // 4. Démarre la génération automatique
    setInterval(() => {
      player.gainCash(100);
      player.resources += 5;
      player.reputation += 1;

      hud.update(player);
      hud.notify('+100 💰 +5 📦 +1 🏆');
    }, 5000);

    // 5. Rendre accessibles globalement si besoin
    window.controller = controller;
    window.player = player;

  } catch (err) {
    console.error('❌ Impossible de charger les infos joueur :', err);
    window.location.href = '/home.html';
  }
}

initGame();

// 🔌 Bouton de déconnexion
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    const res = await fetch('/api/logout', { method: 'POST' });
    if (res.ok) {
      window.location.href = '/home.html';
    } else {
      alert('❌ Erreur lors de la déconnexion.');
    }
  });
}
