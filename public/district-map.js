const TILE_WIDTH = 256;
const TILE_HEIGHT = 128;

function toIso(x, y) {
  return {
    x: (x - y) * TILE_WIDTH / 2,
    y: (x + y) * TILE_HEIGHT / 2
  };
}

function createIsoTile(color = 0x999999) {
  const g = new PIXI.Graphics();
  g.beginFill(color);
  g.lineStyle(1, 0x000000, 0.4);
  g.moveTo(0, 0);
  g.lineTo(TILE_WIDTH / 2, TILE_HEIGHT / 2);
  g.lineTo(0, TILE_HEIGHT);
  g.lineTo(-TILE_WIDTH / 2, TILE_HEIGHT / 2);
  g.lineTo(0, 0);
  g.endFill();
  return g;
}

export class DistrictMap {
  constructor(app) {
    this.app = app;
    this.world = new PIXI.Container();
    this.world.x = app.renderer.width / 2;
    this.world.y = 150;
    app.stage.addChild(this.world);

    // 🛡 fail-safe : cache le tooltip si la souris sort du canvas
    window.addEventListener('mousemove', (e) => {
      if (!e.target.closest('canvas')) this._hideTooltip();
    });
  }

  loadFromData(data) {
    this.world.removeChildren();

    if (!Array.isArray(data.entities)) {
      console.error('❌ Format de district invalide : il manque "entities"');
      return;
    }

    for (let entity of data.entities) {
      let color = 0x555555;
      if (entity.type === 'road') color = 0x888888;
      if (entity.type === 'slot') color = 0x22aa22;
      if (entity.type === 'building') color = 0xc49a6c;

      const pos = toIso(entity.x, entity.y);
      const tile = createIsoTile(color);

      tile.x = pos.x;
      tile.y = pos.y;

      // ✅ Interactivité
      tile.eventMode = 'static';
      tile.cursor = 'pointer';
      tile.hitArea = new PIXI.Rectangle(-TILE_WIDTH / 2, 0, TILE_WIDTH, TILE_HEIGHT);

      tile.on('pointerover', () => this._showTooltip(entity, tile));
      tile.on('pointerout', () => this._hideTooltip());

      this.world.addChild(tile);
    }
  }

  _showTooltip(tileData, tile) {
    const tooltip = document.getElementById('tile-tooltip');
    if (!tooltip) return;

    const labels = {
      slot: "Terrain Constructible",
      road: "Route",
      building: "Bâtiment",
      empty: "Zone Vide"
    };

    tooltip.innerHTML = `
      <strong>${labels[tileData.type] || tileData.type}</strong><br/>
      Coordonnées : (${tileData.x}, ${tileData.y})
    `;

    tooltip.style.display = 'block';

    const global = tile.getGlobalPosition();
    const rect = this.app.view.getBoundingClientRect();

    const screenX = rect.left + global.x;
    const screenY = rect.top + global.y;

    tooltip.style.left = `${screenX + 20}px`;
    tooltip.style.top = `${screenY}px`;
  }

  _hideTooltip() {
    const tooltip = document.getElementById('tile-tooltip');
    if (tooltip) tooltip.style.display = 'none';
  }
}
