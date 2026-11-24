import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Client } from 'pg'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dryRun = process.argv.includes('--dry')

function loadCredits() {
  const file = path.join(root, 'prisma/seed/image-credits.json')
  return JSON.parse(readFileSync(file, 'utf8'))
}

const UPSERT_SQL = `
INSERT INTO "ImageCredit" (
  "id", "image", "name", "author", "sourceUrl", "license", "licenseUrl", "note", "videoUrl", "updatedAt"
)
VALUES (
  gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, now()
)
ON CONFLICT ("image") DO UPDATE SET
  "name" = EXCLUDED."name",
  "author" = EXCLUDED."author",
  "sourceUrl" = EXCLUDED."sourceUrl",
  "license" = EXCLUDED."license",
  "licenseUrl" = EXCLUDED."licenseUrl",
  "note" = EXCLUDED."note",
  "videoUrl" = EXCLUDED."videoUrl",
  "updatedAt" = now()
`

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set')

  const credits = loadCredits()
  console.log(`${dryRun ? '[dry run] ' : ''}image credits loaded: ${credits.length}`)

  if (dryRun) return

  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()

  try {
    let upserted = 0
    for (const credit of credits) {
      await client.query(UPSERT_SQL, [
        credit.image,
        credit.name,
        credit.author ?? null,
        credit.sourceUrl,
        credit.license,
        credit.licenseUrl ?? null,
        credit.note ?? null,
        credit.videoUrl ?? null,
      ])
      upserted += 1
    }
    console.log(`upserted: ${upserted}`)
  } finally {
    await client.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
