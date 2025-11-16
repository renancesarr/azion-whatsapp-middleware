# US09 — Performance e Latência em Edge

Objetivo: garantir que a execução das funções de orquestração, reescrita e lógica auxiliar seja **ultrarapida**, respeitando limites de tempo e consumo de CPU típicos de ambientes edge. O sistema deve operar com overhead mínimo, garantindo tempo de resposta previsível e mantendo a experiência de usuário intacta.

Todas as tasks são absolutamente anatômicas: uma única ação, um único critério, nenhuma ambiguidade.

---

## 📘 T09-001 — Criar documento inicial de performance

Criar `docs/us09.md` com explicação dos objetivos de performance.

---

## ⏱️ T09-002 — Registrar limites típicos de latência na edge

Documentar em `docs/us09.md` os limites esperados (ex.: 10ms–40ms por execução).

---

## 🔍 T09-003 — Identificar funções críticas para latência

Criar lista das funções que executam por CTA:

* identificação de CTA
* seleção de número/mensagem
* construção de URL
* reescrita de elemento
* reconstrução do HTML

---

## 🧪 T09-004 — Criar benchmark básico da função de identificação de CTAs

Implementar microbenchmark medindo tempo médio de execução.

---

## 🧪 T09-005 — Criar benchmark da seleção de número

Benchmark isolado da função de seleção.

---

## 🧪 T09-006 — Criar benchmark da seleção de mensagem

Benchmark isolado.

---

## 🧪 T09-007 — Criar benchmark da montagem de URL

Benchmark isolado.

---

## 🧪 T09-008 — Criar benchmark da reescrita de elemento

Benchmark isolado.

---

## 🧪 T09-009 — Criar benchmark da reescrita do HTML final

Benchmark isolado.

---

## 📊 T09-010 — Criar função para registrar tempos em um objeto interno

Função pura que recebe nome da etapa + tempo e retorna objeto com medidas.

---

## 🧪 T09-011 — Testar função de registro de tempos

Validar que armazena dados corretamente.

---

## 🔗 T09-012 — Integrar registros de tempo na função orquestradora

Adicionar medição de início/fim em cada etapa.

---

## 🧪 T09-013 — Criar teste automatizado verificando presença dos tempos

Mockar orquestração e garantir que campos de latência estejam presentes.

---

## ⚠️ T09-014 — Criar função pura `isExecutionTooSlow`

Regra simples:

* recebe tempos registrados
* retorna true se alguma etapa exceder limite pré-documentado

---

## 🧪 T09-015 — Criar teste para `isExecutionTooSlow`

Testar:

* tempos dentro do limite → false
* tempos fora do limite → true

---

## 🧩 T09-016 — Integrar `isExecutionTooSlow` com fallback

Se qualquer etapa exceder limite → tratar como erro e ativar fallback (US05).

---

## 🧪 T09-017 — Testar fallback causado por lentidão

Simular lentidão e garantir que:

* fallback retorna HTML original
* medição de tempo está presente

---

## 📉 T09-018 — Implementar minimização de parse de HTML

Criar função que reaproveita estrutura intermediária quando possível.

---

## 🧪 T09-019 — Testar ganho de performance do parse otimizado

Comparar tempo antes vs depois.

---

## 🔧 T09-020 — Implementar cache interno de funções puras

Exemplo: cache de textos encodeados.

---

## 🧪 T09-021 — Testar cache para verificar redução de tempo

Comparar execuções repetidas.

---

## ⚡ T09-022 — Validar que o sistema funciona mesmo sem otimizações

Desabilitar otimizações e garantir funcionalidade idêntica.

---

## 🧾 T09-023 — Atualizar `docs/us09.md` com métricas finais

Documentar:

* benchmarks
* otimizações usadas
* limites máximos
* comportamento quando o limite é estourado.
