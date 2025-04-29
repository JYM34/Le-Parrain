// world-map.js
const TILE_WIDTH = 256;
const TILE_HEIGHT = 128;

function toIso(x, y) {
  return {
    x: (x - y) * TILE_WIDTH / 2,
    y: (x + y) * TILE_HEIGHT / 2
  };
}

export class WorldMap {
  constructor(app, onDistrictSelect) {
    this.app = app;
    this.container = new PIXI.Container();
    this.onDistrictSelect = onDistrictSelect;

    this.app.stage.addChild(this.container);
    this._initCamera();
    this._loadFromFile(); // ⬅️ Chargement JSON
  }

  _loadFromFile() {
    fetch('./world-map-data.json')
      .then(res => res.json())
      .then(data => this._loadFromData(data))
      .catch(err => console.error("❌ Erreur chargement world-map-data.json :", err));
  }

  _loadFromData(data) {
    const style = new PIXI.TextStyle({ fill: '#ffffff', fontSize: 18, align: 'center' });

    data.entities.forEach((d, index) => {
      const pos = toIso(d.x, d.y);

      let color = 0x888888;
      if (d.type === 'banlieue')    color = 0x88aa88;
      if (d.type === 'murder_inc')  color = 0xaa4444;
      if (d.type === 'slot')        color = 0x4444aa;

      const tile = new PIXI.Graphics();
      tile.beginFill(color);
      tile.lineStyle(2, 0xffffff, 0.4);
      tile.moveTo(0, 0);
      tile.lineTo(TILE_WIDTH / 2, TILE_HEIGHT / 2);
      tile.lineTo(0, TILE_HEIGHT);
      tile.lineTo(-TILE_WIDTH / 2, TILE_HEIGHT / 2);
      tile.lineTo(0, 0);
      tile.endFill();

      tile.x = pos.x + this.app.renderer.width / 2;
      tile.y = pos.y + 100;

      if (d.type === 'slot') {
        tile.eventMode = 'static';
        tile.cursor = 'pointer';
        tile.on('pointerdown', () => this.onDistrictSelect(index));
      }

      const label = new PIXI.Text(d.type.toUpperCase(), style);
      label.anchor.set(0.5);
      label.x = 0;
      label.y = TILE_HEIGHT / 2;
      tile.addChild(label);

      this.container.addChild(tile);
    });
  }

  _initCamera() {
    let dragging = false;
    let last = { x: 0, y: 0 };

    this.app.view.addEventListener('pointerdown', (e) => {
      dragging = true;
      last = { x: e.clientX, y: e.clientY };
    });

    this.app.view.addEventListener('pointerup', () => dragging = false);
    this.app.view.addEventListener('pointerout', () => dragging = false);

    this.app.view.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      this.container.x += dx;
      this.container.y += dy;
      last = { x: e.clientX, y: e.clientY };
    });

    this.app.view.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoom = e.deltaY < 0 ? 1.1 : 0.9;
      this.container.scale.x *= zoom;
      this.container.scale.y *= zoom;
    });
  }

  destroy() {
    this.app.stage.removeChild(this.container);
    this.container.removeChildren();
  }
}
