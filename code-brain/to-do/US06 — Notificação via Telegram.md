# US06 — Notificação via Telegram

Objetivo: garantir que **falhas críticas na orquestração** sejam notificadas em um canal de Telegram via Bot API, **sem nunca impedir** a entrega do HTML (mesmo em caso de erro na própria notificação).

Todas as tasks são **anatômicas**, **granulares** e com **um único objetivo por task**.

---

## 📄 Definição e documentação

### **T06-001 — Criar documento inicial de US06**

Criar `docs/us06.md` com a descrição do objetivo da notificação via Telegram.

---

### **T06-002 — Documentar formato mínimo da mensagem de erro**

No `docs/us06.md`, especificar quais campos devem existir na mensagem enviada ao Telegram:

* timestamp
* página afetada (URL ou path)
* descrição resumida do erro

---

### **T06-003 — Documentar momento em que a notificação deve ser disparada**

No `docs/us06.md`, definir que a notificação só será enviada quando:

* houver erro que dispare o fallback (US05)

---

## 🔐 Configuração de credenciais e destino

### **T06-004 — Adicionar campo de token do bot à configuração**

Adicionar em `edge/config.js` a chave `telegramBotToken` com valor vazio.

---

### **T06-005 — Adicionar campo de chat id à configuração**

Adicionar em `edge/config.js` a chave `telegramChatId` com valor vazio.

---

### **T06-006 — Documentar uso de variáveis de ambiente (opcional)**

No `docs/us06.md`, indicar que token e chat id podem ser lidos de variáveis de ambiente, se desejado.

---

## 🧱 Funções puras de montagem de dados

### **T06-007 — Criar função pura para gerar timestamp em formato string**

Implementar função que retorna um timestamp em formato legível (ex.: ISO string).

---

### **T06-008 — Criar teste automatizado para a função de timestamp**

Garantir que a função devolve uma string não vazia.

---

### **T06-009 — Criar função pura para montar descrição de erro**

Função que recebe um objeto de erro e retorna uma string curta e descritiva.

---

### **T06-010 — Criar teste automatizado para montagem de descrição de erro**

Garantir que a string de saída contém pelo menos alguma referência à mensagem do erro.

---

### **T06-011 — Criar função pura para montar o corpo da mensagem de Telegram**

Função deve receber:

* timestamp
* url/path
* descrição de erro
  E retornar uma string final de mensagem.

---

### **T06-012 — Criar teste automatizado para o corpo da mensagem**

Validar que o corpo da mensagem contém os três elementos: timestamp, página, descrição.

---

## 🌐 Função de envio HTTP (lado Telegram)

### **T06-013 — Criar função utilitária para montar URL da Bot API**

Função pura que recebe o token do bot e retorna a URL base de envio de mensagem.

---

### **T06-014 — Criar teste automatizado da URL da Bot API**

Garantir que a URL gerada segue o padrão `https://api.telegram.org/bot<TOKEN>/sendMessage`.

---

### **T06-015 — Criar função assíncrona de envio de mensagem ao Telegram**

Função recebe:

* token
* chat id
* texto da mensagem
  E realiza uma chamada HTTP POST para a Bot API.

---

### **T06-016 — Criar função para tratar erro de requisição ao Telegram**

Função que recebe um erro de requisição e retorna um objeto com informações resumidas do erro (sem lançar exceção).

---

## 🧪 Testes da função de envio (nível de isolamento)

> Observação: aqui os testes podem ser feitos com mocks / stubs da chamada HTTP.

### **T06-017 — Testar envio bem-sucedido simulando resposta positiva do Telegram**

Mockar a resposta da API como sucesso e garantir que a função de envio resolve sem lançar erro.

---

### **T06-018 — Testar envio com erro simulando falha de rede**

Mockar erro de rede e validar que a função de envio não lança exceção para o chamador.

---

### **T06-019 — Testar envio com erro simulando resposta inválida do Telegram**

Mockar uma resposta inválida e garantir que o erro é tratado e não interrompe o fluxo.

---

## 🔗 Integração com o fluxo de fallback

### **T06-020 — Criar função pura `buildTelegramNotificationPayload`**

Função que recebe:

* HTML original
* HTML resultante ou nulo
* contexto (ex.: URL da página)
* lista de erros capturados na pipeline
  E retorna um objeto com campos necessários para montar mensagem.

---

### **T06-021 — Criar teste automatizado para `buildTelegramNotificationPayload`**

Validar que o objeto gerado contém:

* referência à página
* pelo menos um erro

---

### **T06-022 — Criar função `notifyFailureViaTelegram`**

Função que:

* recebe o payload de notificação
* lê token/chat id da config
* monta corpo da mensagem
* chama função de envio

---

### **T06-023 — Criar teste automatizado para `notifyFailureViaTelegram` com dependências mockadas**

Mockar envio e garantir que:

* a função de envio é chamada
* o texto utilizado contém as informações do payload

---

## 🌐 Integração com a Edge Function (sem bloquear resposta)

### **T06-024 — Determinar ponto único de disparo da notificação**

Decidir, em código, que a notificação só será chamada após a decisão de fallback (US05), e documentar isso em comentário.

---

### **T06-025 — Integrar chamada a `notifyFailureViaTelegram` na Edge Function**

Dentro de `edge/handler.js`, após decidir pelo fallback, chamar `notifyFailureViaTelegram` passando o contexto e erros.

---

### **T06-026 — Garantir que erro no envio ao Telegram não interrompe a resposta**

Encapsular chamada a `notifyFailureViaTelegram` em bloco que ignore qualquer exceção, garantindo que a função handler sempre retorna HTML.

---

### **T06-027 — Criar teste end-to-end simulando erro interno + notificação bem-sucedida**

Simular erro na pipeline → fallback ativado → envio ao Telegram mockado com sucesso.
Validar que o HTML ainda é retornado corretamente.

---

### **T06-028 — Criar teste end-to-end simulando erro interno + falha no Telegram**

Simular erro na pipeline → fallback ativado → envio ao Telegram mockado com falha.
Validar que o HTML ainda é retornado corretamente.

---

## 👁️ Validação manual e documentação

### **T06-029 — Testar manualmente notificação real em canal de Telegram**

Configurar token e chat id reais, provocar um erro intencional e validar o recebimento da mensagem no canal.

---

### **T06-030 — Atualizar `docs/us06.md` com fluxo final**

Documentar:

* quando a notificação dispara
* o que é enviado
* o que acontece em caso de falha do Telegram
* relação com o fluxo de fallback (US05).
