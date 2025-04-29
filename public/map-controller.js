import { WorldMap } from './world-map.js';
import { DistrictMap } from './district-map.js';

export class MapController {
  constructor(app) {
    this.app = app;
    this.currentMap = null;

    this._setupBackButton();
  }

  _setupBackButton() {
    const backBtn = document.getElementById('back-to-map');
    if (!backBtn) return;

    backBtn.addEventListener('click', () => {
      this.showWorldMap();
    });
  }

  showWorldMap() {
    if (this.currentMap && typeof this.currentMap.destroy === 'function') {
      this.currentMap.destroy();
    }
  
    this.currentMap = new WorldMap(this.app, () => {
      this.showDistrictMap();
    });
  
    document.getElementById('back-to-map').style.display = 'none';
  }
  
  async showDistrictMap() {
    if (this.currentMap) this.currentMap.destroy();
  
    try {
      const sessionRes = await fetch('/api/me');
      const { user } = await sessionRes.json();
  
      const res = await fetch(`/districts/${user.username}.json`);
      const data = await res.json();
  
      this.currentMap = new DistrictMap(this.app);
      this.currentMap.loadFromData(data);
  
      document.getElementById('back-to-map').style.display = 'block';
    } catch (err) {
      console.error('❌ Erreur de chargement du district :', err);
    }
  }
  
}
