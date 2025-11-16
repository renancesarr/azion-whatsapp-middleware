# US00 --- Arquitetura e Bootstrap do Projeto

Objetivo: definir a arquitetura base do projeto, preparar o ambiente
mínimo, criar a espinha dorsal da pipeline e deixar tudo pronto para que
os demais US (US01, US02, etc.) só encaixem código em cima dessa
estrutura.

Todas as tasks são **anatômicas**: uma ação, um critério, nada
implícito.

---

## 1. Documentação de Arquitetura

### T00-001 --- Criar documento de visão de arquitetura

Criar `docs/architecture-overview.md` descrevendo em texto:\

- camadas principais do sistema\
- papel da edge function\
- fluxo básico: request → processamento → resposta

---

### T00-002 --- Definir e documentar módulos lógicos

No mesmo `docs/architecture-overview.md`, listar módulos previstos:\

- `src/core/`\
- `src/pipeline/`\
- `src/utils/`\
- `src/providers/`\
- `src/debug/`\
- `config/`

Sem criar pastas ainda.

---

### T00-003 --- Documentar o fluxo da pipeline em alto nível

Descrever, em ordem, os passos da pipeline:\

- receber HTML\
- identificar CTAs\
- selecionar número/mensagem\
- montar URL\
- reescrever elementos\
- reconstruir HTML\
- fallback\
- notificação\
- debug

---

## 2. Estrutura de Pastas do Projeto

### T00-004 --- Criar pasta `/src`

Criar diretório `src/` vazio.

---

### T00-005 --- Criar pasta `/src/core`

Criar `src/core/` vazia.

---

### T00-006 --- Criar pasta `/src/pipeline`

Criar `src/pipeline/` vazia.

---

### T00-007 --- Criar pasta `/src/utils`

Criar `src/utils/` vazia.

---

### T00-008 --- Criar pasta `/src/providers`

Criar `src/providers/` vazia.

---

### T00-009 --- Criar pasta `/src/debug`

Criar `src/debug/` vazia.

---

### T00-010 --- Criar pasta `/config`

Criar `config/` vazia (separada de src).

---

## 3. Arquivos de Configuração Base

### T00-011 --- Criar config principal em `/config`

Criar `config/index.js` contendo objeto vazio exportado:

```js
module.exports = {};
```

---

### T00-012 --- Documentar responsabilidade do módulo de config

Em `docs/architecture-overview.md`, adicionar seção explicando:\

- config é a única fonte de verdade\
- módulos só leem valores, nunca definem

---

## 4. Skeleton da Pipeline

### T00-013 --- Criar arquivo de pipeline principal

Criar `src/pipeline/index.js` com:

```js
function processHtml(html, context) {
  return html;
}

module.exports = { processHtml };
```

---

### T00-014 --- Documentar interface de `processHtml`

Descrever em `docs/architecture-overview.md`:\

- `html`: string\
- `context`: objeto\
- retorno: string

---

### T00-015 --- Criar módulo para criar contexto

Criar `src/core/context.js`:

```js
function createContext(initial) {
  return { ...initial };
}

module.exports = { createContext };
```

---

### T00-016 --- Documentar papel do contexto

Explicar que o contexto carrega:\

- dados do request\
- provider\
- dados auxiliares

---

## 5. Skeleton da Edge Function / Handler

### T00-017 --- Criar entrypoint da edge

Criar `edge/handler.js` contendo:\

- import de `processHtml`\
- função `handler(request)` que:\
- lê o HTML\
- chama `processHtml`\
- retorna o mesmo HTML

---

### T00-018 --- Documentar interface do handler

Descrever em `docs/architecture-overview.md`:\

- assinatura\
- formato da resposta (HTML puro)

---

## 6. Normalização de Request/Response (base vazia)

### T00-019 --- Criar módulo de compatibilidade de provider

Criar `src/providers/compat.js`:

```js
function normalizeRequest(rawRequest) {
  return rawRequest;
}

function createResponse(body, init) {
  return { body, init };
}

module.exports = { normalizeRequest, createResponse };
```

---

### T00-020 --- Documentar objetivo do compat layer

Em `docs/architecture-overview.md`, explicar:\

- isolamento de runtime\
- padronização de entrada/saída

---

## 7. Ambiente de Teste Local

### T00-021 --- Criar HTML de teste global

Criar `tests/global-smoke-test.html` contendo HTML mínimo.

---

### T00-022 --- Criar script de teste local

Criar `tests/run-edge-local.js` que:\

- lê o HTML\
- cria request fake\
- chama handler\
- imprime resultado

---

### T00-023 --- Validar retorno manualmente

Rodar script e confirmar que a saída == entrada.

---

## 8. Base de Testes Automatizados

### T00-024 --- Criar estrutura base de testes automatizados

Criar `tests/unit/` e `tests/integration/`.

---

### T00-025 --- Criar teste de fumaça para `processHtml`

Criar `tests/unit/process-html-smoke.test.js` que verifica retorno
idêntico.

---

### T00-026 --- Criar teste de fumaça para o handler

Criar `tests/integration/handler-smoke.test.js` validando retorno
idêntico.

---

## 9. Integração com US01--US11

### T00-027 --- Documentar pontos de extensão

No `docs/architecture-overview.md`, mapear onde cada US entra na
pipeline.

---

### T00-028 --- Adicionar comentários TODO nos módulos principais

Adicionar TODO em:\

- `processHtml`\
- `compat.js`\
- `handler.js`

---

### T00-029 --- Revisar arquitetura manualmente

Conferir consistência da estrutura e nomes.

---

### T00-030 --- Registrar versão inicial da arquitetura

Adicionar no `config/index.js`:

```js
module.exports = {
  architectureVersion: "0.1.0",
};
```

E registrar no `docs/architecture-overview.md`.
