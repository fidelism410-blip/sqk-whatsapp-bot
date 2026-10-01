@echo off
chcp 65001 >nul
if not exist .env (
  echo ERRO: copie .env.example para .env e preencha antes de iniciar.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Instalando dependencias...
  call npm install
)
call npm start
pause
