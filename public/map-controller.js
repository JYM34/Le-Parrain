import { WorldMap } from './world-map.js';
import { DistrictMap } from './district-map.js';

export class MapController {
  constructor(app) {
    this.app = app;
    this.currentMap = null;
  }

  showWorldMap() {
    if (this.currentMap) this.currentMap.destroy();
    this.currentMap = new WorldMap(this.app, () => {
      this.showDistrictMap();
    });
  }

  async showDistrictMap() {
    if (this.currentMap) this.currentMap.destroy();

    try {
      const res = await fetch('/district-debug.json');
      const data = await res.json();

      this.currentMap = new DistrictMap(this.app);
      this.currentMap.loadFromData(data);
    } catch (err) {
      console.error('Erreur de chargement du district :', err);
    }
  }
}
