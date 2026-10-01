import test from 'node:test'
import assert from 'node:assert/strict'
import ScoringService from '../src/services/scoringService.mjs'

test('scoring usa configuração central da Scrim', () => {
  const s = new ScoringService()
  const r = s.calculate(10, 1, { placement1: 1.7 })
  assert.equal(r.multiplier, 1.7)
  assert.equal(r.points, 17)
})
