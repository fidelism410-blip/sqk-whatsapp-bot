import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizePhone } from '../src/utils/phone.mjs'
import { hashKeyword, verifyKeyword } from '../src/utils/crypto.mjs'

test('telefone BR aceita 8 e 9 dígitos locais e remove device suffix',()=>{
  assert.equal(normalizePhone('1432654421'),'551432654421')
  assert.equal(normalizePhone('14996544217'),'5514996544217')
  assert.equal(normalizePhone('5514996544217:12@s.whatsapp.net'),'5514996544217')
})
test('keyword é comparada por hash',()=>{
  const secret='1234567890abcdef', h=hashKeyword('pepino',secret)
  assert.equal(verifyKeyword('pepino',h,secret),true)
  assert.equal(verifyKeyword('errada',h,secret),false)
})
