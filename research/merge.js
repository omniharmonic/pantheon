/**
 * Merge all research agent outputs into the main data files.
 * Run: node research/merge.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const RESEARCH_DIR = __dirname;

// Load existing data
const mainData = JSON.parse(fs.readFileSync(path.join(ROOT, 'religion-data-model.json'), 'utf8'));
const existingFigures = JSON.parse(fs.readFileSync(path.join(ROOT, 'shared-figures.json'), 'utf8'));

// Track existing IDs for dedup
const existingTraditionIds = new Set(mainData.traditions.map(t => t.id));
const existingConnectionIds = new Set(mainData.connections.map(c => c.id));
const existingFigureIds = new Set(existingFigures.map(f => f.id));

// Research files to merge
const files = ['americas.json', 'africa_oceania.json', 'asia.json', 'europe_esoteric.json', 'modern.json'];

let addedTraditions = 0, addedConnections = 0, addedFigures = 0;
let skippedTraditions = 0, skippedFigures = 0;

for (const file of files) {
  const filePath = path.join(RESEARCH_DIR, file);
  if (!fs.existsSync(filePath)) {
    console.log(`⏳ Skipping ${file} (not found yet)`);
    continue;
  }

  console.log(`\n📂 Processing ${file}...`);

  let data;
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    try {
      data = JSON.parse(raw);
    } catch (e) {
      // Try section-split format
      const parts = raw.split(/^===.*===$/m).filter(s => s.trim());
      data = {
        traditions: JSON.parse(parts[0]),
        connections: JSON.parse(parts[1]),
        figures: JSON.parse(parts[2])
      };
    }
  } catch (e) {
    console.error(`  ❌ Failed to parse ${file}:`, e.message);
    continue;
  }

  // Merge traditions
  const traditions = data.traditions || [];
  for (const t of traditions) {
    if (existingTraditionIds.has(t.id)) {
      skippedTraditions++;
      continue;
    }
    // Ensure required arrays exist
    t.keyFigures = t.keyFigures || [];
    t.keyConcepts = t.keyConcepts || [];
    t.parentTraditions = t.parentTraditions || [];
    t.childTraditions = t.childTraditions || [];
    t.syncreticConnections = t.syncreticConnections || [];
    t.theologicalType = t.theologicalType || [];
    t.majorBranches = t.majorBranches || [];
    t.majorSects = t.majorSects || [];

    mainData.traditions.push(t);
    existingTraditionIds.add(t.id);
    addedTraditions++;
  }

  // Merge connections
  const connections = data.connections || [];
  for (const c of connections) {
    if (existingConnectionIds.has(c.id)) continue;
    // Validate both endpoints exist
    if (!existingTraditionIds.has(c.from) || !existingTraditionIds.has(c.to)) {
      console.log(`  ⚠️  Skipping connection ${c.id}: ${c.from} → ${c.to} (endpoint not found)`);
      continue;
    }
    mainData.connections.push(c);
    existingConnectionIds.add(c.id);
    addedConnections++;
  }

  // Merge figures
  const figures = data.figures || [];
  for (const f of figures) {
    if (existingFigureIds.has(f.id)) {
      skippedFigures++;
      continue;
    }
    // Ensure required arrays
    f.traditions = f.traditions || [];
    f.aliases = f.aliases || [];
    f.connections = f.connections || [];
    f.roles = f.roles || {};

    // Validate all tradition references exist
    f.traditions = f.traditions.filter(tid => {
      if (!existingTraditionIds.has(tid)) {
        console.log(`  ⚠️  Figure ${f.id}: removing unknown tradition "${tid}"`);
        return false;
      }
      return true;
    });

    // Remove role entries for traditions that don't exist
    for (const key of Object.keys(f.roles)) {
      if (!existingTraditionIds.has(key)) {
        delete f.roles[key];
      }
    }

    // Skip figures with no valid traditions
    if (f.traditions.length === 0) {
      console.log(`  ⚠️  Skipping orphan figure: ${f.id}`);
      continue;
    }

    existingFigures.push(f);
    existingFigureIds.add(f.id);
    addedFigures++;
  }

  console.log(`  ✅ From ${file}: +${traditions.filter(t => !skippedTraditions).length ? '' : ''}${traditions.length - skippedTraditions >= 0 ? '' : ''}done`);
}

// Write merged data
fs.writeFileSync(path.join(ROOT, 'religion-data-model.json'), JSON.stringify(mainData, null, 2));
fs.writeFileSync(path.join(ROOT, 'shared-figures.json'), JSON.stringify(existingFigures, null, 2));

console.log(`\n${'═'.repeat(50)}`);
console.log(`✅ MERGE COMPLETE`);
console.log(`   Traditions: ${mainData.traditions.length} total (+${addedTraditions} new, ${skippedTraditions} dupes skipped)`);
console.log(`   Connections: ${mainData.connections.length} total (+${addedConnections} new)`);
console.log(`   Figures: ${existingFigures.length} total (+${addedFigures} new, ${skippedFigures} dupes skipped)`);
console.log(`${'═'.repeat(50)}`);
