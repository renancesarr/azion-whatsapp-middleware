# US05 — Fallback Seguro (Versão Anatômica Revisada)

Objetivo: garantir que **qualquer falha na pipeline da Edge Function** resulte na entrega do HTML original, sem modificações. O fallback deve ser totalmente previsível, totalmente isolado e 100% testável etapa por etapa.

Cada task abaixo é **anatômica**, **granular**, **única**, **sem ações implícitas**, **sem múltiplos critérios misturados**.

---

## 📝 T05-001 — Documentar o escopo do fallback

Criar `docs/us05.md` explicando *apenas*: o fallback devolve o HTML original quando qualquer etapa falha.

---

## ⚙️ T05-002 — Criar função pura `safeTry`

Função recebe outra função e a executa dentro de `try/catch`, retornando:

* `{ ok: true, value }` se não lançar erro.
* `{ ok: false, error }` se lançar erro.

---

## 🧪 T05-003 — Testar `safeTry` quando função não lança erro

Validar:

* `ok === true`
* `value` é o retorno da função

---

## 🧪 T05-004 — Testar `safeTry` quando função lança erro

Validar:

* `ok === false`
* `error` contém a mensagem lançada

---

## 🧱 T05-005 — Criar função pura `fallbackReturnOriginalHtml`

Função retorna *exatamente* o HTML original, byte a byte.

---

## 🧪 T05-006 — Testar `fallbackReturnOriginalHtml`

Validar:

* retorno é idêntico ao input original

---

## 🔗 T05-007 — Aplicar `safeTry` na etapa de identificação de CTAs

Encapsular *somente* a função de identificação com `safeTry`.

---

## 🧪 T05-008 — Testar erro capturado na etapa de identificação

Criar teste que força erro na identificação e valida:

* `ok === false`

---

## 🔗 T05-009 — Aplicar `safeTry` na etapa de seleção de número

Encapsular função de seleção de número com `safeTry`.

---

## 🧪 T05-010 — Testar erro capturado na etapa de seleção de número

Forçar erro e validar retorno com `ok === false`.

---

## 🔗 T05-011 — Aplicar `safeTry` na etapa de seleção de mensagem

Encapsular função de seleção de mensagem com `safeTry`.

---

## 🧪 T05-012 — Testar erro capturado na etapa de seleção de mensagem

Forçar erro e validar `ok === false`.

---

## 🔗 T05-013 — Aplicar `safeTry` na etapa de construção da URL

Encapsular a função que monta a URL.

---

## 🧪 T05-014 — Testar erro capturado na etapa de construção da URL

Forçar erro e validar `ok === false`.

---

## 🔗 T05-015 — Aplicar `safeTry` na etapa de reescrita de elemento individual

Encapsular função de injeção/substituição de `href`.

---

## 🧪 T05-016 — Testar erro capturado na etapa de reescrita de elemento

Forçar erro e validar `ok === false`.

---

## 🔗 T05-017 — Aplicar `safeTry` na etapa de reconstrução do HTML final

Encapsular função que substitui trechos no HTML.

---

## 🧪 T05-018 — Testar erro capturado na reconstrução do HTML final

Forçar erro e validar `ok === false`.

---

## 🧩 T05-019 — Criar função pura `shouldUseFallback`

Recebe lista de resultados (cada um com `ok` booleano) e retorna:

* `true` se qualquer elemento possui `ok === false`
* `false` caso todos possuam `ok === true`

---

## 🧪 T05-020 — Testar `shouldUseFallback` com tudo OK

Lista sem erros → retorno deve ser `false`.

---

## 🧪 T05-021 — Testar `shouldUseFallback` com um erro

Lista contendo 1 erro → retorno deve ser `true`.

---

## 🧪 T05-022 — Testar `shouldUseFallback` com múltiplos erros

Retorno deve ser `true`.

---

## 🔄 T05-023 — Criar função pura `orchestrateFallbackDecision`

Função deve:

* receber HTML original
* receber lista de resultados
* retornar:

  * HTML reescrito se `shouldUseFallback` for false
  * HTML original se `shouldUseFallback` for true

---

## 🧪 T05-024 — Testar orquestração — cenário sem erro

Validar:

* retorno é HTML reescrito

---

## 🧪 T05-025 — Testar orquestração — cenário com erro

Validar:

* retorno é HTML original

---

## 🌐 T05-026 — Integrar fallback completo ao handler da edge

Modificar `edge/handler.js` para:

* executar pipeline
* registrar resultados via `safeTry`
* decidir fallback via `orchestrateFallbackDecision`
* retornar HTML correto
  Sem Telegram ainda.

---

## 🧪 T05-027 — Criar teste end-to-end do fallback

Testar:

* pipeline sem erro → HTML reescrito
* pipeline com erro → HTML original

---

## 👁️ T05-028 — Validar manualmente o fallback

Rodar script de teste manual e validar comportamento nos dois cenários.

---

## 🧾 T05-029 — Documentar fluxo final no `docs/us05.md`

Adicionar:

* pipeline completa
* pontos de erro
* diagrama do fluxo
* exemplos de saída
