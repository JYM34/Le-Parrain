// district-map.js
const TILE_WIDTH = 64;
const TILE_HEIGHT = 32;

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
  }

  loadFromData(data) {
    this.world.removeChildren();
    for (let entity of data.entities) {
      let color = 0x555555;
      if (entity.type === 'road') color = 0x888888;
      if (entity.type === 'slot') color = 0x22aa22;
      if (entity.type === 'building') color = 0xc49a6c;

      const pos = toIso(entity.x, entity.y);
      const tile = createIsoTile(color);
      tile.x = pos.x;
      tile.y = pos.y;
      this.world.addChild(tile);
    }
  }
}
