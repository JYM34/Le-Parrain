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
    this._loadFromFile();
  }

  _loadFromFile() {
    fetch('./world-map-data.json')
      .then(res => res.json())
      .then(data => this._loadFromData(data))
      .catch(err => console.error("❌ Erreur chargement world-map-data.json :", err));
  }

  _loadFromData(data) {
    // Préparer les textures par type
    const textures = {
      banlieue: this._createTileTexture(0x88aa88),
      murder_inc1: this._createTileTexture(0xff6b6b),
      murder_inc2: this._createTileTexture(0xe74c3c),
      murder_inc3: this._createTileTexture(0x8b0000),
      slot: this._createTileTexture(0x4444aa),
      empty: this._createTileTexture(0x888888),
    };

    data.entities.forEach((d, index) => {
      const pos = toIso(d.x, d.y);
      const tex = textures[d.type] || textures.empty;

      const sprite = new PIXI.Sprite(tex);
      sprite.anchor.set(0.5, 0.5);
      sprite.x = pos.x + this.app.renderer.width / 2;
      sprite.y = pos.y + 100 + TILE_HEIGHT / 2;

      // Définir une hitbox en losange
      const halfW = TILE_WIDTH / 2;
      const halfH = TILE_HEIGHT / 2;
      sprite.hitArea = new PIXI.Polygon([
        0, -halfH,
        halfW, 0,
        0, halfH,
        -halfW, 0
      ]);

      sprite.eventMode = 'static';
      sprite.cursor = 'pointer';

      sprite.on('pointerover', () => {
        this._showTooltip(d, sprite);
      });

      sprite.on('pointerout', () => {
        this._hideTooltip();
      });

      if (d.type === 'slot') {
        sprite.on('pointerdown', () => this.onDistrictSelect(index));
      }

      this.container.addChild(sprite);
    });
  }

  _createTileTexture(color) {
    const g = new PIXI.Graphics();
    g.beginFill(color);
    g.lineStyle(2, 0xffffff, 0.4);
    g.moveTo(0, 0);
    g.lineTo(TILE_WIDTH / 2, TILE_HEIGHT / 2);
    g.lineTo(0, TILE_HEIGHT);
    g.lineTo(-TILE_WIDTH / 2, TILE_HEIGHT / 2);
    g.lineTo(0, 0);
    g.endFill();

    const tex = this.app.renderer.generateTexture(g);
    g.destroy();
    return tex;
  }

  _showTooltip(tileData, sprite) {
    const tooltip = document.getElementById('tile-tooltip');
    if (!tooltip) return;

    const labels = {
      banlieue: "Banlieue",
      murder_inc1: "Murder - Niveau 1",
      murder_inc2: "Murder - Niveau 2",
      murder_inc3: "Murder - Niveau 3",
      slot: "Terrain Constructible",
      empty: "Zone Vide"
    };

    tooltip.innerHTML = `
      <strong>${labels[tileData.type] || tileData.type}</strong><br/>
      Coordonnées : (${tileData.x}, ${tileData.y})
    `;
    tooltip.style.display = 'block';

    // Positionner correctement l'infobulle par rapport au sprite (isométrie + container)
    const global = sprite.getGlobalPosition();
    const rect = this.app.view.getBoundingClientRect();

    tooltip.style.left = `${rect.left + global.x + 20}px`;
    tooltip.style.top = `${rect.top + global.y - TILE_HEIGHT / 2}px`;
  }

  _hideTooltip() {
    const tooltip = document.getElementById('tile-tooltip');
    if (tooltip) tooltip.style.display = 'none';
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
    }, { passive: true });

    this.app.view.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoom = e.deltaY < 0 ? 1.1 : 0.9;
      this.container.scale.x *= zoom;
      this.container.scale.y *= zoom;
    }, { passive: false });
  }

  destroy() {
    this.app.stage.removeChild(this.container);
    this.container.removeChildren();
  }
}
