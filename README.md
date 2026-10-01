# SQK Competitive — Bot de WhatsApp

Bot de WhatsApp para administrar o competitivo da SQK por conversa privada.

## O que já está implementado

- Acesso do **dono por número + palavra-chave**.
- Dono cadastra **capitães com número + palavra-chave individual**.
- Capitão pode inscrever **quantas equipes precisar**; o limite é apenas o total de vagas da Scrim.
- Dono pode cadastrar várias Scrims. Todas as Scrims abertas aparecem automaticamente no menu de inscrição.
- Inscrição exige: nome do time, line, reserva opcional, **logo do time** e **comprovante PIX**.
- **Sem comprovante, a inscrição não é criada/concluída.**
- Dono consegue visualizar comprovantes e marcar como validado ou recusado.
- Resultado exige: time, queda, **colocação** e **print da tela final**.
- Com `OPENAI_API_KEY`, o bot tenta reconhecer as kills no print. Se não tiver segurança, pede kills manualmente.
- Pontuação padrão SQK/EWC por queda: Top 1 = 1.6x kills; Top 2–5 = 1.4x; Top 6–10 = 1.2x; Top 11–16 = 1.0x.
- Ranking atualizado assim que o resultado é confirmado.
- Gera card 1080x1080 de inscrição e ranking em tema clean branco/azul metálico.
- Perguntas públicas sobre Scrims, ranking, regras e pagamento.
- Com IA configurada, responde perguntas livres usando somente a base cadastrada do competitivo.

## Instalação

1. Instale Node.js 20 ou superior.
2. Copie `.env.example` para `.env`.
3. Preencha `OWNER_PHONE`, `OWNER_KEYWORD` e `KEYWORD_SECRET`.
4. Opcional: preencha `OPENAI_API_KEY` para leitura automática de prints e perguntas livres.
5. Rode:

```bash
npm install
npm start
```

No primeiro início aparecerá um QR no terminal. No WhatsApp que será usado como bot, abra **Configurações > Aparelhos conectados > Conectar aparelho** e escaneie.

## Primeiro acesso do dono

Envie no privado do número do bot exatamente a palavra definida em `OWNER_KEYWORD` usando o número definido em `OWNER_PHONE`.

O menu do dono permite cadastrar Scrims e capitães. O capitão autentica do próprio WhatsApp com a palavra-chave que o dono cadastrou.

## Fluxo de inscrição

`palavra-chave -> 1 Inscrever time -> Scrim -> nome -> line -> reserva -> logo -> PIX/comprovante -> inscrição concluída`

O slot só é criado quando o comprovante é recebido.

## Fluxo de resultado

`palavra-chave -> 3 Enviar resultado -> equipe -> queda -> colocação -> print -> IA lê kills (ou pede manual) -> confirmação -> ranking`

## Persistência

As informações ficam em `DATA_DIR` e a sessão do WhatsApp em `AUTH_DIR`. Em hospedagem/Docker, **essas duas pastas precisam de volume persistente**. Não coloque a pasta `auth` em repositório público.

## Observação sobre WhatsApp

Este projeto usa Baileys (WhatsApp Web não oficial). Não use para spam ou disparos em massa. Para operação comercial com suporte oficial da Meta, migre a camada de transporte para a WhatsApp Business Platform mantendo os mesmos fluxos e banco de dados.
