const fs = require('fs');
const {execSync} = require('child_process');
const ts = require('typescript');

const meta = JSON.parse(execSync('curl -s http://localhost:3000/api/cars/meta'));
const brands = {};
for (let b of meta.brands) brands[b.name.toLowerCase()] = b.id;
const categories = {};
for (let c of meta.categories) categories[c.name.toLowerCase()] = c.id;
const powertrains = {};
for (let p of meta.powertrains) powertrains[p.type.toLowerCase() + '|' + p.subType.toLowerCase()] = p.id;
const models = {};
const submodels = {};
for (let m of meta.models) {
  models[m.name.toLowerCase()] = m.id;
  for (let sm of m.subModels) {
    submodels[m.name.toLowerCase() + '|' + sm.name.toLowerCase()] = sm.id;
  }
}

const existing = JSON.parse(execSync('curl -s http://localhost:3000/api/cars'));
const existingNames = new Set(existing.map(c => c.name));

const carsTs = fs.readFileSync('src/data/cars.ts', 'utf8');
const result = ts.transpileModule(carsTs, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const m = {exports:{}};
const f = new Function('module', 'exports', 'require', result.outputText);
f(m, m.exports, require);
const cars = m.exports.cars;

function norm(s) { return (s||'').toLowerCase().replace(/\s+/g, '_'); }
function norm2(s) { return (s||'').toLowerCase().replace(/\s+/g, ''); }

for (let car of cars) {
  if (existingNames.has(car.id)) {
    console.log('SKIP', car.id);
    continue;
  }
  const brandId = brands[(car.brand||'').toLowerCase()];
  let modelId = models[norm(car.model)];
  if (!modelId) {
    for (let k of Object.keys(models)) {
      if (norm2(k) === norm2(car.model)) { modelId = models[k]; break; }
    }
  }
  let subModelId = null;
  const smKey = norm(car.model) + '|' + norm(car.subModel||'');
  subModelId = submodels[smKey];
  if (!subModelId) {
    for (let k of Object.keys(submodels)) {
      if (k.startsWith(norm(car.model) + '|')) {
        if (norm2(k.split('|')[1]) === norm2(car.subModel||'')) { subModelId = submodels[k]; break; }
      }
    }
  }
  const catId = categories[(car.category||'').toLowerCase()];
  let pId = powertrains[(car.powertrain.type||'').toLowerCase() + '|' + (car.powertrain.subType||'').toLowerCase()];
  if (!pId) {
    for (let k of Object.keys(powertrains)) {
      if (k.endsWith('|' + (car.powertrain.subType||'').toLowerCase())) { pId = powertrains[k]; break; }
    }
  }

  const bt = ((car.specs.battery?.type)||'').includes('LFP') ? 'LFP' : ((car.specs.battery?.type)||'').includes('NMC') ? 'NMC' : ((car.specs.battery?.type)||'').includes('NCA') ? 'NCA' : ((car.specs.battery?.type)||'').includes('LTO') ? 'LTO' : 'LFP';

  const payload = {
    name: car.id,
    brandId,
    modelId,
    subModelId,
    powerTrainId: pId,
    categoryCarId: catId,
    year: car.year,
    price: car.price,
    image: car.image,
    officialUrl: car.officialUrl || 'https://example.com',
    spec: {
      powerKw: car.specs.powerKw || 0,
      torque: car.specs.torque || 0,
      topSpeed: car.specs.topSpeed || 0,
      acceleration: car.specs.acceleration || 0,
      drivetrain: car.specs.drivetrain || 'FWD',
      motorType: car.specs.motorType || 'PMSM',
      driveModes: car.specs.driveModes || [],
      groundClearance: car.specs.groundClearance || 0,
      weight: car.specs.weight || 0,
      seats: car.specs.seats || 5,
      trunkCapacity: car.specs.trunkCapacity || 0,
      trunkCapacityMax: car.specs.trunkCapacityMax || 0,
      turningRadius: car.specs.turningRadius || 0,
      dimension: {
        length: car.specs.dimension?.length || 0,
        width: car.specs.dimension?.width || 0,
        height: car.specs.dimension?.height || 0,
        wheelbase: car.specs.dimension?.wheelbase || 0,
      },
      battery: { type: bt, capacity: car.specs.battery?.capacity || 0 },
      charging: { ac: car.specs.charging?.ac || 0, dc: car.specs.charging?.dc || 0, time: car.specs.charging?.time || 0 },
      range: { nedc: car.specs.range?.nedc || 0, ...(car.specs.range?.wltp ? {wltp: car.specs.range.wltp} : {}) }
    }
  };

  const cmd = `curl -s -X POST http://localhost:3000/api/cars -H "Content-Type: application/json" -d ${JSON.stringify(JSON.stringify(payload))}`;
  try {
    const res = execSync(cmd, {maxBuffer: 1024*1024});
    const out = res.toString();
    if (out.includes('"id"')) console.log('OK', car.id);
    else console.log('FAIL', car.id, out.substring(0, 60));
  } catch (e) {
    console.log('ERR', car.id);
  }
}
