# US08 — Controle de Versão das Regras

Objetivo: garantir que **todas as regras de seleção, grupos, mensagens e fallback** possam evoluir ao longo do tempo sem quebrar implementações anteriores. O sistema deve permitir versionamento explícito das regras e seleção determinística da versão usada em cada CTA.

Cada task abaixo é estritamente anatômica, uma ação única, um critério único.

---

## 📘 T08-001 — Criar documento inicial de versionamento

Criar `docs/us08.md` explicando o objetivo do versionamento das regras.

---

## 📦 T08-002 — Adicionar campo `rulesVersion` no arquivo de configuração

Adicionar em `edge/config.js` a chave:

```js
rulesVersion: "1.0.0"
```

Valor estático inicial.

---

## 📄 T08-003 — Documentar formato de versão em `docs/us08.md`

Explicar que o formato segue padrão semântico:

```html
MAJOR.MINOR.PATCH
```

---

## 🏷️ T08-004 — Criar função pura `getCurrentRulesVersion`

Função retorna valor de `rulesVersion` do config.

---

## 🧪 T08-005 — Criar teste automatizado para `getCurrentRulesVersion`

Garantir que função retorna exatamente o valor definido no config.

---

## 🧱 T08-006 — Criar função pura `tagHtmlWithRulesVersion`

Função recebe HTML final e insere comentário HTML no topo:

```html
<!-- rules-version: X.Y.Z -->
```

---

## 🧪 T08-007 — Criar teste para `tagHtmlWithRulesVersion`

Verificar:

* comentário aparece na primeira linha
* versão está correta

---

## 🔎 T08-008 — Adicionar atributo `data-rules-version` no CTA

Criar função que adiciona nos CTAs modificados:

```html
data-rules-version="X.Y.Z"
```

---

## 🧪 T08-009 — Criar teste para atributo de versão no CTA

Validar que:

* atributo foi adicionado
* nenhum outro atributo foi alterado

---

## 🔗 T08-010 — Integrar versão na função orquestradora

Alterar `processHtmlForWhatsappCtas` para:

1. ler versão das regras
2. aplicar atributo `data-rules-version`
3. inserir comentário de versão no documento final

---

## 🧪 T08-011 — Criar teste automatizado da integração de versão

Testar que:

* versão está no HTML final
* CTAs contém atributo da versão

---

## 🔧 T08-012 — Criar campo `supportedVersions` no config

Adicionar:

```js
supportedVersions: ["1.0.0"]
```

---

## 📘 T08-013 — Documentar `supportedVersions` e sua função

Explicar em `docs/us08.md` que este array determina quais versões são reconhecidas.

---

## 🧩 T08-014 — Criar função pura `isVersionSupported`

Recebe uma string de versão e retorna true/false com base em `supportedVersions`.

---

## 🧪 T08-015 — Criar teste para `isVersionSupported`

Validar:

* versão suportada → true
* versão não suportada → false

---

## 🔧 T08-016 — Permitir que CTA especifique versão via `data-rules-version`

Criar função que:

* lê atributo `data-rules-version` do CTA
* se existir → usar essa versão
* se não existir → usar versão atual

---

## 🧪 T08-017 — Criar teste para leitura de versão no CTA

Testar:

* CTA com versão → retorna versão do CTA
* CTA sem versão → retorna versão global

---

## 🔄 T08-018 — Criar função de seleção de regras baseada na versão

Função pura que recebe versão e retorna:

* mensagens
* números
* grupos
  Referente àquela versão específica.

---

## 🧪 T08-019 — Criar teste da seleção de regras por versão

Testar seleção de recursos diferentes para versões diferentes.

---

## ⛔ T08-020 — Criar função que gera erro quando versão não é suportada

Função pura:

* recebe versão
* se não reconhecida → retorna objeto de erro
  Não lança erro.

---

## 🧪 T08-021 — Testar geração de erro para versão não suportada

Validar que função retorna objeto contendo:

* versão pedida
* mensagem de erro

---

## 🔗 T08-022 — Integrar erro de versão com fallback (US05)

Se CTA pedir versão não suportada → pipeline registra erro via `safeTry` → fallback acionado.

---

## 🧪 T08-023 — Testar fallback causado por versão inválida

Simular CTA pedindo versão inexistente e garantir que:

* fallback retorna HTML original
* versão inválida aparece nos logs de erro

---

## 🧾 T08-024 — Atualizar `docs/us08.md` com fluxo final

Adicionar:

* como versões são lidas
* como CTAs escolhem versão
* como erros de versão causam fallback
* como evoluir versões futuras
