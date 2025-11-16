# US10 — Modo Debug / Logs Seguros

Objetivo geral: fornecer um modo de depuração seguro, detalhado e não invasivo, além de permitir que o mesmo código opere de forma previsível em **Cloudflare**, **Vercel Edge**, **Azion**, **Fastly** ou qualquer outro ambiente edge compatível.

Todas as tasks são absolutamente anatômicas: uma ação única, um critério único.

---

## 📘 T10-001 — Criar documento inicial de debug seguro

Criar `docs/us10.md` explicando:

* objetivo do debug
* riscos de vazar dados
* princípios de registro seguro

---

## 🔐 T10-002 — Criar configuração `debugMode` no config

Adicionar em `edge/config.js`:

```js
debugMode: false
```

---

## 📄 T10-003 — Criar função pura `isDebugEnabled`

Retorna true/false baseado em `debugMode`.

---

## 🧪 T10-004 — Testar `isDebugEnabled`

Garantir que retorna corretamente valores diferentes.

---

## 🏗️ T10-005 — Criar função pura para gerar log seguro

Função recebe:

* mensagem
* dados contextuais
  E retorna objeto contendo **somente dados sanitizados**, sem PII.

---

## 🧪 T10-006 — Testar log seguro

Verificar que:

* dados sensíveis não aparecem
* dados permitidos são preservados

---

## 📦 T10-007 — Criar função `debugPrint`

Função que recebe objeto de log e faz `console.log` **apenas se debugMode = true**.

---

## 🧪 T10-008 — Testar `debugPrint` com debug ativo

Validar que `console.log` é chamado.

---

## 🧪 T10-009 — Testar `debugPrint` com debug desativado

Garantir que `console.log` **não** é chamado.

---

## 🔗 T10-010 — Integrar logs seguros nas etapas críticas

Em cada ponto da pipeline, adicionar chamadas:

* início da etapa
* fim da etapa
  Somente se debug ativo.

---

## 🧪 T10-011 — Criar teste para logs de pipeline com debug on/off

Garantir que logs aparecem apenas quando debug = true.

---

## 📄 T10-012 — Criar função `debugSummary`

Função gera um resumo final com:

* número de CTAs processados
* tempo total de execução
* tempo médio por CTA

---

## 🧪 T10-013 — Testar geração de `debugSummary`

Verificar que objeto retornado contém todos os campos.

---

## 🔻 T10-014 — Criar função para anexar resumo ao HTML (modo debug apenas)

Insere comentário HTML no final:

```html
<!-- debug: {json} -->
```

---

## 🧪 T10-015 — Testar comentário de debug no HTML

Verificar:

* aparece somente em modo debug
* JSON válido

---

## 🧾 T10-016 — Atualizar docs com fluxo final de debug

Adicionar:

* limitações
* formato dos logs
* avisos sobre sensibilidade

---

## 📘 T11-001 — Criar documento inicial multi-edge

Criar `docs/us11.md` explicando diferença entre runtimes:

* Cloudflare Workers
* Vercel Edge
* Azion
* Fastly

---

## 🧱 T11-002 — Criar função pura `detectEdgeProvider`

Função inspeciona ambiente global e retorna:

* `"cloudflare"`
* `"vercel"`
* `"azion"`
* `"fastly"`
* `"unknown"`

---

## 🧪 T11-003 — Criar testes mockados para `detectEdgeProvider`

Mockar diferentes ambientes e validar detecção.

---

## 🧩 T11-004 — Criar função que normaliza objeto `Request` entre providers

Função recebe o request nativo e retorna API comum:

```js
{
  url,
  method,
  headers: {...},
  bodyString
}
```

---

## 🧪 T11-005 — Testar normalização do `Request`

Criar mocks para cada provider e validar saída padronizada.

---

## 🔄 T11-006 — Criar função que normaliza objeto `Response`

Função recebe corpo + headers + status e devolve instância correta para cada provider.

---

## 🧪 T11-007 — Testar normalização do `Response`

Mockar ambientes e verificar criação correta.

---

## ⚙️ T11-008 — Criar wrapper unificado `edgeHandler`

Responsável por:

* detectar provider
* normalizar request
* chamar função principal
* normalizar resposta

---

## 🧪 T11-009 — Testar `edgeHandler` com ambiente mockado

Validar que:

* detecção funciona
* pipeline executa
* resposta correta é criada

---

## 🔗 T11-010 — Integrar handler multi-edge ao `handler.js`

Substituir lógica específica por wrapper moderno.

---

## 🧪 T11-011 — Teste end-to-end: Cloudflare mock

Mocka ambiente Cloudflare e processa HTML.

---

## 🧪 T11-012 — Teste end-to-end: Vercel mock

Mocka ambiente Vercel.

---

## 🧪 T11-013 — Teste end-to-end: Azion mock

Mocka ambiente Azion.

---

## 🧪 T11-014 — Teste end-to-end: Fastly mock

Mocka ambiente Fastly.

---

## 📄 T11-015 — Criar documentação final multi-edge

Explicar suporte, limitações e diferenças de cada ambiente.

---

## 🧾 T11-016 — Atualizar README com aviso de compatibilidade multi-edge

Adicionar nota visível sobre suporte a múltiplos ambientes edge.
