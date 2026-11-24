import json
import subprocess
import re

# Get meta data
meta_result = subprocess.run(['curl', '-s', 'http://localhost:3000/api/cars/meta'], 
                            stdout=subprocess.PIPE)
meta = json.loads(meta_result.stdout)

brands = {b['name']: b['id'] for b in meta['brands']}
categories = {c['name']: c['id'] for c in meta['categories']}
powertrains = {(p['type'], p['subType']): p['id'] for p in meta['powertrains']}

# Build model map
models = {}
for m in meta['models']:
    key = (m['brandCar']['name'] if 'brandCar' in m else brands.get(list(brands.keys())[0]), m['name']) if False else None
# easier way
models_map = {}
submodels_map = {}
for m in meta['models']:
    models_map[m['name']] = m['id']
    for sm in m['subModels']:
        submodels_map[(m['name'], sm['name'])] = sm['id']

# Get existing
existing_result = subprocess.run(['curl', '-s', 'http://localhost:3000/api/cars'], 
                                stdout=subprocess.PIPE)
existing = json.loads(existing_result.stdout)
existing_names = set(c['name'] for c in existing)

# Read cars.ts
with open('src/data/cars.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Simple approach - use node to eval
pass
