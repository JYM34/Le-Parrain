import { HUD } from './hud.js';
import { MapController } from './map-controller.js';
import { generateWorldMap } from './world-generator.js';

// Init PIXI
const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x1e1e1e
});
document.body.appendChild(app.view);

// Init Map Controller
const controller = new MapController(app);
controller.showWorldMap();

// Init HUD
const hud = new HUD();

// Joueur de base
const player = {
  name: "Don Corleone",
  money: 8000,
  resources: 120,
  reputation: 34
};

// Afficher infos HUD
hud.update(player);

// Logique de génération automatique
setInterval(() => {
  player.money += 100;          // gagner 100💰 toutes les 5s
  player.resources += 5;        // gagner 5📦 toutes les 5s
  player.reputation += 1;       // gagner 1🏆 toutes les 5s

  hud.update(player);
  hud.notify('+100 💰 +5 📦 +1 🏆');
}, 5000); // toutes les 5 secondes

window.generateWorldMap = generateWorldMap;
