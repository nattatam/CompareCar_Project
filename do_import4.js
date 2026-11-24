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
  models[m.name.toLowerCase()] = {id: m.id, brandId: m.brandId};
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

function norm(s) { return (s||'').toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_'); }
function norm2(s) { return (s||'').toLowerCase().replace(/[^a-z0-9]/g, ''); }

for (let car of cars) {
  if (existingNames.has(car.id)) {
    continue;
  }
  const brandId = brands[(car.brand||'').toLowerCase()];
  let modelInfo = models[norm(car.model)];
  if (!modelInfo) {
    for (let k of Object.keys(models)) {
      if (norm2(k) === norm2(car.model)) { modelInfo = models[k]; break; }
    }
  }
  let modelId = modelInfo?.id;
  let subModelId = null;
  // special cases
  if (car.id === 'byd-m6-dynamic-6-seat') { modelId = models[norm('m6')]?.id; subModelId = submodels[norm('m6') + '|dynamic']; }
  if (car.id === 'byd-m6-extended-6-seat') { modelId = models[norm('m6')]?.id; subModelId = submodels[norm('m6') + '|extended']; }
  if (car.id === 'byd-m6-extended-7-seat') { modelId = models[norm('m6')]?.id; subModelId = submodels[norm('m6') + '|extended']; }
  if (car.id === 'jaecoo-6-ev-long-range-4wd') { modelId = models[norm('6_ev')]?.id; subModelId = submodels[norm('6_ev') + '|long_range_4wd']; }
  if (car.id === 'jaecoo-6t') { modelId = models[norm('6t')]?.id; subModelId = submodels[norm('6t') + '|long_range_4wd']; }
  
  let pId = powertrains[(car.powertrain.type||'').toLowerCase() + '|' + (car.powertrain.subType||'').toLowerCase()];
  if (!pId) {
    for (let k of Object.keys(powertrains)) {
      if (k.endsWith('|' + (car.powertrain.subType||'').toLowerCase())) { pId = powertrains[k]; break; }
      if ((car.powertrain.subType||'').toLowerCase() === 'phev' && k.includes('phev')) { pId = powertrains[k]; break; }
      if ((car.powertrain.subType||'').toLowerCase() === 'reev/erev' && k.includes('reev')) { pId = powertrains[k]; break; }
      if ((car.powertrain.subType||'').toLowerCase() === 'hev' && k === 'hev|phev') { pId = powertrains[k]; break; } // try
    }
  }
  // ORA HEV - in meta maybe hev|hev or mapped differently?
  if (car.id.includes('ora-5-hev')) {
    // look for hev
    for (let k of Object.keys(powertrains)) {
      if (k.startsWith('hev')) { pId = powertrains[k]; break; }
    }
  }

  const bt = ((car.specs.battery?.type)||'').includes('LFP') ? 'LFP' : ((car.specs.battery?.type)||'').includes('NMC') ? 'NMC' : ((car.specs.battery?.type)||'').includes('NCA') ? 'NCA' : ((car.specs.battery?.type)||'').includes('LTO') ? 'LTO' : 'LFP';

  const payload = {
    name: car.id,
    brandId,
    modelId,
    subModelId: subModelId || null,
    powerTrainId: pId,
    categoryCarId: categories[(car.category||'').toLowerCase()],
    year: car.year,
    price: car.price,
    image: car.image,
    officialUrl: car.officialUrl || 'https://example.com',
    spec: {
      powerKw: car.specs.powerKw || 0,
      torque: car.specs.torque || 0,
      topSpeed: car.specs.topSpeed || 0,
      acceleration: car.specs.acceleration || 0,
      drivetrain: car.specs.drivetrain || (car.id.includes('awd') ? 'AWD' : 'FWD'),
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
    else console.log('FAIL', car.id, out.substring(0, 90));
  } catch (e) {
    console.log('ERR', car.id);
  }
}
