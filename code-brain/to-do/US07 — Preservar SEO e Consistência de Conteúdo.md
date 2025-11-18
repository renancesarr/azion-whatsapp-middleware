# US07 — Preservar SEO e Consistência de Conteúdo

Objetivo: garantir que a reescrita dos CTAs **não altere a estrutura semântica**, não quebre heurísticas de SEO, não introduza duplicação de conteúdo e mantenha completa previsibilidade para buscadores. A edge function deve operar de forma minimamente invasiva.

Todas as tasks são 100% anatômicas e indivisíveis.

---

## 🔍 T07-001 — Documentar princípios SEO relevantes ao projeto

Criar `docs/us07.md` explicando:

* atributos que nunca devem ser alterados
* elementos que não podem ter ordem mudada
* proibição de alterar o conteúdo textual do CTA

---

## 📦 T07-002 — Criar função pura para extrair texto interno de um CTA

Função deve:

* receber trecho HTML do CTA
* retornar apenas o texto visível

---

## 🧪 T07-003 — Criar teste automatizado para extração de texto

Validar que:

* texto interno é retornado exatamente
* atributos não são retornados

---

## 🔒 T07-004 — Criar função para comparar texto original vs texto após reescrita

Função deve verificar se:

* conteúdo textual é idêntico

---

## 🧪 T07-005 — Criar teste automatizado para comparação de texto

Validar que a função detecta:

* igualdade perfeita
* qualquer modificação mínima

---

## 🛠️ T07-006 — Criar função pura que valida integridade estrutural do elemento

Função deve garantir que:

* tag não mudou (`a` continua `a`, `button` continua `button`)
* atributos não são removidos
* ordem de atributos não importa

---

## 🧪 T07-007 — Criar teste automatizado para integridade estrutural

Validar que:

* elemento modificado preserva tag
* elemento preserva atributos existentes

---

## 🔗 T07-008 — Integrar validação de integridade antes de substituir elemento

Ao reescrever o CTA, verificar:

* texto preservado
* atributos preservados
* tag preservada
  Se falhar → tratar como erro (US05).

---

## 🧪 T07-009 — Criar teste automatizado de fluxo completo de validação

Testar pipeline de:

1. extrair texto
2. validar integridade
3. reescrever CTA
4. validar texto idêntico

---

## 📄 T07-010 — Criar função que valida que somente `href` foi alterado

Função deve comparar HTML original vs modificado e garantir:

* única diferença → atributo `href`

---

## 🧪 T07-011 — Criar teste automatizado para validação de alteração mínima

Testar que:

* somente o `href` muda
* qualquer outra mudança é detectada

---

## 🌐 T07-012 — Integrar validação SEO na função orquestradora

Antes de retornar HTML reescrito, chamar validações:

* integridade
* texto preservado
* alteração mínima
  Se violar qualquer regra → fallback.

---

## 🧪 T07-013 — Criar teste end-to-end dos critérios SEO

Criar cenário completo verificando:

* CTA reescrito com preservação total
* erros propositalmente injetados → fallback ativo

---

## 👁️ T07-014 — Validar manualmente HTML final em ferramenta de diff

Usar diff simples para verificar que a única alteração entre original e final é:

* `href` atualizado

---

## 🧾 T07-015 — Atualizar `docs/us07.md` com regras finais de SEO

Documento deve conter:

* regras aplicadas
* validações implementadas
* limites do sistema
* restrições estruturais
