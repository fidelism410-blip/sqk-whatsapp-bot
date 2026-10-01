# SQK Competitive Bot

Módulo independente do bot atual, dentro de `competitive/`. Gerencia Scrims, capitães, equipes, inscrições, PIX, resultados, ranking, MVP e cards pelo WhatsApp.

## Produção

Node.js 20+. Em produção `DATABASE_URL` é obrigatório; o fallback JSON existe apenas para desenvolvimento/testes. A sessão Baileys é persistida no PostgreSQL por `whatsapp_auth`, reduzindo a necessidade de novo QR após redeploy. Baileys é uma integração não oficial do WhatsApp.

## Render

Ao criar o Web Service manualmente:

- **Root Directory:** `competitive`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Health Check:** `/health`

Configure as variáveis de `.env.example`, especialmente `OWNER_PHONE`, `OWNER_KEYWORD`, `KEYWORD_SECRET`, `DATABASE_URL` e `NODE_ENV=production`.

Abra a URL do serviço. Enquanto o WhatsApp não estiver conectado, a home exibirá o QR. Depois de conectar, o QR é removido da página.

## Fluxo rápido

1. Dono envia `OWNER_KEYWORD` pelo número definido em `OWNER_PHONE`.
2. Menu do dono: cria Scrim e cadastra capitães.
3. Capitão autentica com a própria palavra-chave.
4. `2 - Inscrever equipe`: Scrim → time → line → logo → PIX.
5. Dono aprova o pagamento pelo ID.
6. Capitão envia resultado; dono aprova.
7. Ranking usa somente resultados aprovados. MVP usa somente kills individuais aprovadas; nunca estima kills individuais.

## OpenAI

`OPENAI_API_KEY` é opcional. Sem chave, o bot continua funcional e aceita entrada manual. O serviço de visão usa a Responses API apenas como auxílio; resultados não são aprovados automaticamente.

## Testes

```bash
npm install
npm test
npm run check
```
