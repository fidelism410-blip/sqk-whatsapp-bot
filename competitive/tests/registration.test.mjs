import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { env } from '../src/config/env.mjs'
import Database from '../src/repositories/database.mjs'
import UserRepository from '../src/repositories/userRepository.mjs'
import CaptainRepository from '../src/repositories/captainRepository.mjs'
import TeamRepository from '../src/repositories/teamRepository.mjs'
import ScrimRepository from '../src/repositories/scrimRepository.mjs'
import RegistrationRepository from '../src/repositories/registrationRepository.mjs'
import AuditRepository from '../src/repositories/auditRepository.mjs'
import AuthService from '../src/services/authService.mjs'
import TeamService from '../src/services/teamService.mjs'
import ScrimService from '../src/services/scrimService.mjs'
import RegistrationService from '../src/services/registrationService.mjs'

test('capitão consegue cadastrar 16 equipes sem limite artificial', async () => {
  env.dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'sqk-reg-'))
  env.databaseUrl=''; env.nodeEnv='test'; env.ownerPhone='5514996544217'; env.ownerKeyword='owner'; env.keywordSecret='1234567890abcdef1234567890abcdef'
  const db=new Database(); db.usePostgres=false; await db.init()
  const users=new UserRepository(db), caps=new CaptainRepository(db), teams=new TeamRepository(db), scrims=new ScrimRepository(db), regs=new RegistrationRepository(db), audit=new AuditRepository(db)
  const auth=new AuthService(db,users,caps,audit), owner=await auth.bootstrapOwner(), cap=await auth.createCaptain(owner,'5514991111111','Cap','Org','senha')
  const teamSvc=new TeamService(teams,audit), scrimSvc=new ScrimService(scrims,audit), regSvc=new RegistrationService(db,regs,scrims,teams,audit)
  const scrim=await scrimSvc.create({name:'Grande',date:'01/10/2026',time:'20:30',mode:'TRIO',maxTeams:20,entryFee:0,pixKey:'pix',drops:3,disallowDuplicatePlayers:false},owner.id)
  for(let i=1;i<=16;i++){
    const t=await teamSvc.create(cap.captain.id,`TIME ${i}`,'logo')
    const r=await regSvc.create({scrimId:scrim.id,teamId:t.id,captainId:cap.captain.id,players:[`P${i}A`,`P${i}B`,`P${i}C`]})
    assert.equal(r.slot,i)
  }
  assert.equal((await regs.findByScrim(scrim.id)).length,16)
})
