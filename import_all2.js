const fs = require('fs');
const {execSync} = require('child_process');

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
console.log('existing:', existingNames.size);
