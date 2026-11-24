import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Client } from 'pg'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dryRun = process.argv.includes('--dry')

const IA_ALIASES = {
  '360° 3D Camera': '360° Camera (AVM)',
  '360° 3D Camera (AVM)': '360° Camera (AVM)',
  '360° 3D HD Camera': '360° Camera (AVM)',
  '360° Camera': '360° Camera (AVM)',
  '360° Camera (AVM)': '360° Camera (AVM)',
  '360° DVR': 'Dashcam',
  '360° HD Camera (AVM)': '360° Camera (AVM)',
  '3D Camera': '360° Camera (AVM)',
  '3D Camera HD': '360° Camera (AVM)',
  '540° Camera (AVM)': '360° Camera (AVM)',
  ACC: 'ACC (Adaptive Cruise Control)',
  'ACC (Adaptive Cruise Control)': 'ACC (Adaptive Cruise Control)',
  'ACC S&G': 'ACC with Stop & Go',
  'ACC with Stop & Go': 'ACC with Stop & Go',
  'Actually Smart Summon': 'Actually Smart Summon',
  AEB: 'AEB (Automatic Emergency Braking)',
  'AEB (Automatic Emergency Braking)': 'AEB (Automatic Emergency Braking)',
  AFL: 'AFL (Adaptive Front Lighting)',
  'ALC (Auto Lane Change with Alert)': 'ALC (Auto Lane Change)',
  'ASL (Active Speed Limiter)': 'ASL (Active Speed Limiter)',
  'Automatic Parking': 'Automatic Parking',
  Autosteer: 'Autosteer',
  'Blind Spot Monitoring': 'BSD (Blind Spot Detection)',
  BSD: 'BSD (Blind Spot Detection)',
  'BSD (Blind Spot Detection)': 'BSD (Blind Spot Detection)',
  CMSF: 'CMSF (Collision Mitigation Support – Front)',
  CMSR: 'CMSR (Collision Mitigation Support – Rear)',
  'DAI (Driver Attention Info)': 'DAI (Driver Attention Info)',
  DMS: 'DMS (Driver Monitoring System)',
  'DMS (Driver Monitoring System)': 'DMS (Driver Monitoring System)',
  DOW: 'DOW (Door Opening Warning)',
  'DOW (Door Opening Warning)': 'DOW (Door Opening Warning)',
  'DVR (Dashcam Recording)': 'Dashcam',
  ELK: 'ELK (Emergency Lane Keeping)',
  ELKA: 'ELKA (Emergency Lane Keeping Assist)',
  'ELKA (Emergency Lane Keeping Assist)': 'ELKA (Emergency Lane Keeping Assist)',
  'ELK/ELKA': 'ELKA (Emergency Lane Keeping Assist)',
  'ELK (Emergency Lane Keeping)': 'ELK (Emergency Lane Keeping)',
  'FAB (Forward Auto Beam)': 'FAB (Forward Auto Beam)',
  FCTA: 'FCTA (Front Cross Traffic Alert)',
  'FCTA (Front Cross Traffic Alert)': 'FCTA (Front Cross Traffic Alert)',
  FCTB: 'FCTB (Front Cross Traffic Braking)',
  'FCTB (Front Cross Traffic Braking)': 'FCTB (Front Cross Traffic Braking)',
  FCW: 'FCW (Forward Collision Warning)',
  'FCW (Forward Collision Warning)': 'FCW (Forward Collision Warning)',
  'Front Parking Sensors': 'Front Parking Sensors',
  'Front & Rear Parking Sensors': ['Front Parking Sensors', 'Rear Parking Sensors'],
  'FSD Capability': 'FSD Capability',
  'FVD (Front Vehicle Departure Alert)': 'FVD (Front Vehicle Departure Alert)',
  FVSR: 'FVSR (Front Vehicle Start Reminder)',
  HDC: 'HDC (Hill Descent Control)',
  HMA: 'HMA (Matrix Adaptive Headlights)',
  'HMA (Matrix Adaptive Headlights)': 'HMA (Matrix Adaptive Headlights)',
  'IACC (Intelligent Adaptive Cruise Control)': 'IACC (Intelligent Adaptive Cruise Control)',
  ICA: 'ICA (Intelligent Cruise Assist)',
  'ICA (Intelligent Cruise Assist)': 'ICA (Intelligent Cruise Assist)',
  ICC: 'ICC (Intelligent Cruise Control)',
  'ICC (Intelligent Cruise Control)': 'ICC (Intelligent Cruise Control)',
  'IES (Intelligent Emergency System)': 'IES (Intelligent Emergency System)',
  IHBC: 'IHBC (Intelligent High Beam Control)',
  'IHBC (Intelligent High Beam Control)': 'IHBC (Intelligent High Beam Control)',
  'IHC (Intelligent High-beam Control)': 'IHBC (Intelligent High Beam Control)',
  'ISA (Intelligent Speed Assist)': 'ISA (Intelligent Speed Assist)',
  ISLC: 'ISLC (Intelligent Speed Limit Control)',
  ISLI: 'ISLI (Intelligent Speed Limit Information)',
  ISLW: 'ISLW (Intelligent Speed Limit Warning)',
  'Lane Departure Avoidance': 'Lane Departure Avoidance',
  LCA: 'LCA (Lane Change Alert)',
  'LCA (Lane Change Alert)': 'LCA (Lane Change Alert)',
  'LCC (Lane Centering Control)': 'LCC (Lane Centering Control)',
  LCW: 'LCW (Lane Change Warning)',
  'LCW (Lane Change Warning)': 'LCW (Lane Change Warning)',
  LDA: 'LDA (Lane Departure Alert)',
  'LDA & LDP': ['LDA (Lane Departure Alert)', 'LDP (Lane Departure Prevention)'],
  'LDC (Lane Departure Correction)': 'LDC (Lane Departure Correction)',
  LDP: 'LDP (Lane Departure Prevention)',
  'LDP (Lane Departure Prevention)': 'LDP (Lane Departure Prevention)',
  LDW: 'LDW (Lane Departure Warning)',
  'LDW (Lane Departure Warning)': 'LDW (Lane Departure Warning)',
  LKA: 'LKA (Lane Keep Assist)',
  'LKA (Lane Keep Assist)': 'LKA (Lane Keep Assist)',
  'OSW (Overspeed Warning)': 'OSW (Overspeed Warning)',
  PCW: 'PCW (Predictive Collision Warning)',
  'Rainy Blind Spot Assist': 'Rainy Blind Spot Assist',
  RAW: 'RAW (Rear Approaching Warning)',
  RCTA: 'RCTA (Rear Cross Traffic Alert)',
  'RCTA & RCTB': ['RCTA (Rear Cross Traffic Alert)', 'RCTB (Rear Cross Traffic Braking)'],
  'RCTA (Rear Cross Traffic Alert)': 'RCTA (Rear Cross Traffic Alert)',
  RCTB: 'RCTB (Rear Cross Traffic Braking)',
  'RCTB (Rear Cross Traffic Braking)': 'RCTB (Rear Cross Traffic Braking)',
  RCW: 'RCW (Rear Collision Warning)',
  'RCW (Rear Collision Warning)': 'RCW (Rear Collision Warning)',
  'Rear Camera': 'Rear Camera',
  'Rear Parking Sensors': 'Rear Parking Sensors',
  'Remote Auto Parking': 'Remote Parking Assist (RPA)',
  'Remote Parking': 'Remote Parking Assist (RPA)',
  'Remote Parking Assist (RPA)': 'Remote Parking Assist (RPA)',
  'Remote Straight-line In/Out (RSIO)': 'Remote Straight-line In/Out (RSIO)',
  'Reverse AEB (Low Speed)': 'Reverse AEB (Low Speed)',
  'Reverse Auto Drift System (RADS)': null,
  'SDW (Safe Distance Warning)': 'SDW (Safe Distance Warning)',
  'SEW (Safe Exit Warning)': 'SEW (Safe Exit Warning)',
  'Smart Parking Assist': 'Smart Parking Assist (APA)',
  'Smart Parking Assist (APA)': 'Smart Parking Assist (APA)',
  TJA: 'TJA (Traffic Jam Assist)',
  'TJA (Traffic Jam Assist)': 'TJA (Traffic Jam Assist)',
  'TSI (Traffic Sign Information)': 'TSR (Traffic Sign Recognition)',
  TSR: 'TSR (Traffic Sign Recognition)',
  'TSR (Traffic Sign Recognition)': 'TSR (Traffic Sign Recognition)',
  'UDLC (Unidirectional Lane Change)': 'UDLC (Unidirectional Lane Change)',
}

const SECURITY_ALIASES = {
  '6 Airbags': '6 Airbags',
  '6 Airbags (Front, Side & Curtain)': '6 Airbags',
  '7 Airbags': '7 Airbags',
  '9 Airbags': '9 Airbags',
  ABS: 'ABS',
  'ABS, EBD': ['ABS', 'EBD'],
  'Anti-theft System': 'Anti-theft System',
  ARP: 'ARP (Active Rollover Protection)',
  'Auto Door Lock': 'Auto Door Lock',
  AVAS: 'AVAS (Acoustic Vehicle Alerting System)',
  AVH: 'AVH (Auto Vehicle Hold)',
  'AYC (Active Yaw Control)': 'AYC (Active Yaw Control)',
  BA: 'BA (Brake Assist)',
  BAS: 'BA (Brake Assist)',
  BOS: 'BOS (Brake Override System)',
  'Built-in Dashcam': 'Dashcam',
  'CBC (Curve Brake Control)': 'CBC (Curve Brake Control)',
  'Central Lock': 'Central Lock',
  'Child Lock': 'Child Lock',
  CST: 'CST (Comfort Brake Function)',
  Dashcam: 'Dashcam',
  EBA: 'BA (Brake Assist)',
  EBD: 'EBD',
  EPB: 'EPB + Auto Hold',
  'EPB + Auto Hold': 'EPB + Auto Hold',
  ESC: 'ESC (Electronic Stability Control)',
  ESP: 'ESC (Electronic Stability Control)',
  'ESS (Emergency Stop Signal)': 'ESS (Emergency Stop Signal)',
  'Front & Rear Parking Sensors': ['Front Parking Sensors', 'Rear Parking Sensors'],
  'Front, Side & Curtain Airbags': 'Airbags (Front, Side & Curtain)',
  'GPS/Remote Monitoring': 'GPS/Remote Monitoring',
  'G-TCS': 'TCS (Traction Control System)',
  HAC: 'HAC (Hill Start Assist)',
  HDC: 'HDC (Hill Descent Control)',
  'HDC (Hill Descent Control)': 'HDC (Hill Descent Control)',
  HHC: 'HAC (Hill Start Assist)',
  'HSA (Hill Start Assist)': 'HAC (Hill Start Assist)',
  'Intrusion Sensor': 'Intrusion Sensor',
  ISOFIX: 'ISOFIX',
  'MCB (Multi Collision Brake)': 'MCB (Multi Collision Brake)',
  'Phone Key': 'Phone Key',
  'Pin to Drive': 'Pin to Drive',
  'Rear Camera': 'Rear Camera',
  'Rear Parking Sensors': 'Rear Parking Sensors',
  'Remote Lock/Unlock': 'Remote Lock/Unlock',
  ROM: 'ROM (Roll Over Mitigation)',
  'RSC (Roll Stability Control)': 'RSC (Roll Stability Control)',
  'SCS (Stability Control)': 'ESC (Electronic Stability Control)',
  'Seat Belt Warning': 'Seat Belt Warning',
  'Security Alarm': 'Security Alarm',
  'Sentry Mode': 'Sentry Mode',
  TCS: 'TCS (Traction Control System)',
  'Tilt Sensor': 'Tilt Sensor',
  TPMS: 'TPMS',
  VDC: 'ESC (Electronic Stability Control)',
}

function loadCarFeatures() {
  const source = readFileSync(path.join(root, 'src/data/features.ts'), 'utf8')
  const body = source
    .replace(/export interface[\s\S]*?\n}\n/, '')
    .replace(/export const CAR_FEATURES[^=]*=\s*/, 'return ')
  return new Function(body)()
}

function collectNames(rawNames, aliases, names, warnings, carName, featureIdByName) {
  for (const raw of rawNames) {
    const mapped = raw in aliases ? aliases[raw] : featureIdByName.has(raw) ? raw : undefined

    if (mapped === undefined) {
      warnings.add(`${carName}: unmapped "${raw}"`)
      continue
    }

    if (mapped === null) {
      warnings.add(`${carName}: skipped "${raw}"`)
      continue
    }

    for (const name of Array.isArray(mapped) ? mapped : [mapped]) names.add(name)
  }
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set')

  const carFeatures = loadCarFeatures()
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()

  try {
    const [carsResult, featuresResult] = await Promise.all([
      client.query('SELECT id, name FROM "Car"'),
      client.query('SELECT id, name FROM "Feature"'),
    ])

    const carIdByName = new Map(carsResult.rows.map((row) => [row.name, row.id]))
    const featureIdByName = new Map(featuresResult.rows.map((row) => [row.name, row.id]))

    const warnings = new Set()
    const missingCars = []
    const pairs = new Map()
    let processedCars = 0

    for (const [carName, data] of Object.entries(carFeatures)) {
      const carId = carIdByName.get(carName)
      if (!carId) {
        missingCars.push(carName)
        continue
      }

      processedCars += 1
      const names = new Set()
      collectNames(data.intelligentAssist ?? [], IA_ALIASES, names, warnings, carName, featureIdByName)
      collectNames(data.security ?? [], SECURITY_ALIASES, names, warnings, carName, featureIdByName)

      for (const name of names) {
        const featureId = featureIdByName.get(name)
        if (!featureId) {
          warnings.add(`${carName}: feature not found in DB "${name}"`)
          continue
        }
        pairs.set(`${carId}|${featureId}`, [carId, featureId])
      }
    }

    const rows = [...pairs.values()]
    let inserted = 0

    if (!dryRun && rows.length > 0) {
      const result = await client.query(
        `INSERT INTO "CarFeature" ("carId", "featureId")
         SELECT * FROM UNNEST($1::uuid[], $2::uuid[])
         ON CONFLICT ("carId", "featureId") DO NOTHING`,
        [rows.map((row) => row[0]), rows.map((row) => row[1])]
      )
      inserted = result.rowCount
    }

    console.log(`${dryRun ? '[dry run] ' : ''}cars processed: ${processedCars}/${Object.keys(carFeatures).length}`)
    console.log(`car-feature pairs: ${rows.length}`)
    if (!dryRun) console.log(`inserted: ${inserted} (existing links left untouched)`)
    if (missingCars.length > 0) console.log(`cars not found in DB (${missingCars.length}): ${missingCars.join(', ')}`)
    if (warnings.size > 0) {
      console.log(`warnings (${warnings.size}):`)
      for (const warning of warnings) console.log(`  - ${warning}`)
    }
  } finally {
    await client.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
