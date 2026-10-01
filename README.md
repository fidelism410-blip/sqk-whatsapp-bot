# SQK Competitive — Bot de WhatsApp

Bot competitivo para gestão da SQK via WhatsApp, com autenticação de dono/capitão, scrims, equipes, inscrições, pagamentos, resultados, ranking, MVP e cards automáticos.

## Funcionalidades

- Autenticação do dono por número + palavra-chave
- Autenticação de capitães por número + palavra-chave
- Cadastro e gestão de várias Scrims
- Inscrições com equipe, jogadores, reservas, logo e comprovante PIX
- Aprovação/rejeição de pagamentos
- Resultados com perda de kills e pontuação
- Ranking por scrim
- MVP por kills
- Cards automáticos em SVG + Sharp
- IA opcional com OpenAI Vision para leitura de print
- Dashboard HTTP em Express para status/QR
- Compatível com Render

## Requisitos

- Node.js 20+
- Conta no Render para hospedar o serviço
- WhatsApp para escanear o QR code do Baileys

## Instalação

```bash
npm install
cp .env.example .env
# Edite o .env com seus dados
npm start
```

## Variáveis de ambiente

```env
OWNER_PHONE=5514999999999
OWNER_NAME=FideliisNX
OWNER_KEYWORD=troque-essa-palavra
KEYWORD_SECRET=troque-por-uma-chave-grande
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5-mini
DATA_DIR=./data
AUTH_DIR=./auth
SESSION_HOURS=12
ALLOW_GROUPS=false
BOT_NAME=SQK Competitive
TZ=America/Sao_Paulo
PORT=10000
```

## Como usar

1. Inicie o app.
2. Escaneie o QR Code no terminal ou na página /.
3. Envie a palavra-chave do dono no número configurado em `OWNER_PHONE`.
4. O bot liberará o menu do dono.
5. Cadastre capitães e Scrims.
6. Faça inscrições com logo e comprovante PIX.
7. Acompanhe ranking, MVP e resultados.

## Render

Use `render.yaml` com o build e start padrão do Node.

## Segurança

- Não exponha `.env` em repositório público.
- Nunca grave a palavra-chave em texto claro.
- Não imprima `OPENAI_API_KEY` ou dados sensíveis no log.

## Observação

Este bot usa Baileys para WhatsApp Web; mantenha o ambiente com persistência de `auth` e `data`.
