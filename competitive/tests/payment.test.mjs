import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { env } from '../src/config/env.mjs'
import Database from '../src/repositories/database.mjs'
import MediaRepository from '../src/repositories/mediaRepository.mjs'
import MediaService from '../src/services/mediaService.mjs'

test('PIX duplicado é detectado pelo hash e PNG mantém MIME', async () => {
  env.dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'sqk-pay-'))
  env.databaseUrl = ''
  env.nodeEnv = 'test'
  const db = new Database(); db.usePostgres = false; await db.init()
  const media = new MediaService(new MediaRepository(db))
  const png = Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a,1,2,3,4])
  const a = await media.savePixProof(png, 'image/png', 'r1')
  const b = await media.savePixProof(png, 'image/png', 'r2')
  assert.equal(a.mimeType, 'image/png')
  assert.equal(b.duplicate, true)
  assert.equal(b.duplicateOfMediaId, a.id)
})
