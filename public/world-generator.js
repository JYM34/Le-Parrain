// world-generator.js
export function generateWorldMap(width = 100, height = 100, filename = "world-map-data.json") {
    const types = ['banlieue', 'murder_inc', 'slot'];
    const entities = [];
  
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const rand = Math.random();
        let type;
        if (rand < 0.80) {
            type = 'banlieue';        // 80%
          } else if (rand < 0.85) {
            type = 'murder_inc_1';     // 5% (75% -> 85%)
          } else if (rand < 0.90) {
            type = 'murder_inc_2';     // 5% (85% -> 90%)
          } else if (rand < 0.95) {
            type = 'murder_inc_3';     // 5% (90% -> 95%)
          } else {
            type = 'slot';             // 5% (95% -> 100%)
          }
  
        entities.push({ type, x, y });
      }
    }
  
    const data = { entities };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }
  