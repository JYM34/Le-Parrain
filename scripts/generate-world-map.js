import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateWorldMap(width, height) {
  const entities = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let type = 'empty';
      const rand = Math.random();

      if (rand < 0.5) type = 'banlieue';
      else if (rand < 0.65) type = 'murder_inc1';   // murder niveau 1
      else if (rand < 0.75) type = 'murder_inc2';   // murder niveau 2
      else if (rand < 0.8) type = 'murder_inc3';    // murder niveau 3
      //else type = 'slot';

      entities.push({ x, y, type });
    }
  }

  return { entities };
}

// Où sauvegarder le fichier
const outputPath = path.join('/var/www/Le-Parrain/public/world-map-data.json');

// Générer
const worldMap = generateWorldMap(50, 50);

// Sauvegarder
fs.writeFile(outputPath, JSON.stringify(worldMap, null, 2), (err) => {
  if (err) {
    console.error("❌ Erreur d'écriture :", err);
  } else {
    console.log("✅ Nouveau world-map-data.json généré !");
  }
});