import * as PIXI from '@pixi/unsafe-eval';
import { MapController } from './map-controller.js';
import { generateWorldMap } from './world-generator.js';

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x1e1e1e
});
document.body.appendChild(app.view);

const controller = new MapController(app);
controller.showWorldMap();

// Pour debug depuis la console
window.generateWorldMap = generateWorldMap;
