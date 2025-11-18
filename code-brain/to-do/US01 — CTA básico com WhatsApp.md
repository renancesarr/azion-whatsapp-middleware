# US01 — CTA básico com WhatsApp

Objetivo: garantir que elementos com `data-contact="whatsapp"` recebam um `href` de WhatsApp válido, reescrito pela Edge Function, sem alterar outros elementos do HTML.

---

## T01-001 — Descrever interface da função principal de processamento de HTML

Documentar, em texto, qual será a função principal responsável por processar o HTML (nome, parâmetros de entrada, tipo de retorno esperado).

---

## T01-002 — Escolher e documentar a abordagem de parsing de HTML

Definir se o HTML será manipulado via string, parser ou biblioteca, e registrar essa decisão no `docs/us01.md`.

---

## T01-003 — Implementar função de identificação de elementos com `data-contact="whatsapp"`

Criar função pura que recebe o HTML como string e retorna uma lista de representações dos elementos que contêm exatamente `data-contact="whatsapp"`.

---

## T01-004 — Implementar teste automatizado para a função de identificação

Criar teste que valida se a função de identificação encontra apenas elementos com `data-contact="whatsapp"` e ignora os demais.

---

## T01-005 — Implementar função que constrói URL fixa de WhatsApp para teste

Criar função pura que retorna sempre a mesma URL fixa de WhatsApp, sem usar dados externos.

---

## T01-006 — Implementar teste automatizado para construção de URL fixa

Criar teste que verifica se a URL retornada pela função é exatamente a esperada, incluindo o parâmetro `text`.

---

## T01-007 — Implementar função que insere ou substitui o atributo `href` em um único elemento

Criar função pura que recebe o trecho HTML de um elemento e uma URL, e devolve o mesmo trecho com o atributo `href` definido para a URL informada.

---

## T01-008 — Implementar teste automatizado para injeção de `href` em um elemento

Criar teste que garante que a função de injeção de `href`:

- adiciona `href` quando ele não existe
- substitui `href` quando ele existe
- preserva os outros atributos do elemento

---

## T01-009 — Implementar função que aplica a modificação em todos os elementos identificados

Criar função que recebe a lista de elementos identificados e aplica a função de injeção de `href` a cada um, retornando a lista de elementos modificados.

---

## T01-010 — Implementar função que reescreve o HTML completo usando os elementos modificados

Criar função que recebe o HTML original e a lista de elementos modificados e devolve um HTML final com os trechos substituídos, sem alterar o restante do documento.

---

## T01-011 — Implementar teste automatizado para reescrita do HTML completo

Criar teste que garante que:

- apenas os elementos com `data-contact="whatsapp"` foram alterados
- o restante do HTML permaneceu idêntico

---

## T01-012 — Implementar função orquestradora `processHtmlForWhatsappCtas`

Criar função única que:

- recebe HTML bruto
- chama identificação
- constrói URL fixa
- injeta `href`
- reescreve o HTML completo
- retorna o HTML processado

---

## T01-013 — Integrar a função orquestradora na Edge Function

Alterar `edge/handler.js` para chamar `processHtmlForWhatsappCtas` e retornar o HTML modificado na resposta.

---

## T01-014 — Criar HTML de teste específico para US01

Criar arquivo `tests/us01-test.html` contendo:

- pelo menos um elemento com `data-contact="whatsapp"`
- pelo menos um elemento sem esse atributo para controle

---

## T01-015 — Criar script de teste manual para US01

Criar `tests/test-us01.js` que:

- lê `tests/us01-test.html`
- chama `processHtmlForWhatsappCtas`
- imprime o HTML final no console

---

## T01-016 — Validar manualmente o resultado da reescrita

Executar o script manual, inspecionar a saída e confirmar que:

- somente elementos com `data-contact="whatsapp"` possuem `href` de WhatsApp
- os demais elementos não foram alterados
- a URL de WhatsApp é exatamente a URL fixa definida

---

## T01-017 — Documentar o fluxo final de US01

Atualizar `docs/us01.md` descrevendo:

- o fluxo da função orquestradora
- as funções auxiliares envolvidas
- um exemplo de HTML de entrada e saída
