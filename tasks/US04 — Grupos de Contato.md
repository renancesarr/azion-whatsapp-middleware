# US04 — Grupos de Contato

Objetivo: permitir que CTAs individuais utilizem **grupos específicos de números e mensagens**, definidos via `data-contact-group`, permitindo separar fluxos como “comercial”, “suporte” ou qualquer conjunto lógico de canais.

Todas as tasks são **anatômicas**, indivisíveis e sem ações implícitas.

---

## **T04-001 — Criar estrutura vazia de grupos na configuração**

Adicionar no arquivo `edge/config.js` o objeto:

```js
groups: {}
```

Sem adicionar dados ainda.

---

## **T04-002 — Documentar formato da configuração de grupos**

Criar `docs/us04.md` explicando a estrutura:

```js
groups: {
  comercial: { numbers: [...], messages: [...] },
  suporte: { numbers: [...], messages: [...] }
}
```

---

## **T04-003 — Preencher grupos com valores de teste**

Adicionar ao objeto `groups` dois grupos mínimos:

* `comercial`
* `suporte`
  Cada um contendo números e mensagens simples.

---

## **T04-004 — Implementar função para detectar grupo no CTA**

Criar função pura que:

* recebe trecho HTML do CTA
* retorna valor do atributo `data-contact-group` ou `null`
  Não altera HTML.

---

## **T04-005 — Criar teste automatizado da detecção de grupo**

Garantir que:

* retorna nome do grupo quando presente
* retorna `null` quando não existe

---

## **T04-006 — Implementar função de seleção de números baseada no grupo**

Criar função que:

* recebe nome do grupo
* retorna array `numbers` correspondente
* se grupo não existir, retorna lista padrão global

---

## **T04-007 — Criar teste automatizado para seleção de números por grupo**

Validar:

* seleção correta de números para cada grupo
* fallback para números globais quando grupo não existir

---

## **T04-008 — Implementar função de seleção de mensagens baseada no grupo**

Similar à anterior, mas retornando `messages`.

---

## **T04-009 — Criar teste automatizado para seleção de mensagens por grupo**

Validar lista correta por grupo e fallback.

---

## **T04-010 — Integrar lógica de grupo na estratégia de seleção**

Modificar função roteadora (US02/US03) para:

* usar lista do grupo quando identificado
* usar lista padrão quando não houver grupo

---

## **T04-011 — Criar teste da integração de grupo com a construção da URL**

Garantir que:

* número pertence ao grupo correto
* mensagem pertence ao grupo correto

---

## **T04-012 — Integrar lógica de grupo na função orquestradora**

Alterar `processHtmlForWhatsappCtas` para:

* detectar grupo de cada CTA
* selecionar números e mensagens a partir do grupo
* montar URL final

---

## **T04-013 — Criar HTML de teste específico para US04**

Criar `tests/us04-test.html` contendo:

* CTA com `data-contact-group="comercial"`
* CTA com `data-contact-group="suporte"`
* CTA sem grupo

---

## **T04-014 — Criar script de teste manual para US04**

Criar `tests/test-us04.js` que:

* carrega o HTML
* chama função orquestradora
* imprime links gerados

---

## **T04-015 — Validar manualmente o comportamento por grupo**

Garantir:

* cada CTA recebe número/mensagem do grupo correto
* fallback funciona para CTAs sem grupo

---

## **T04-016 — Documentar fluxo final dos grupos**

Atualizar `docs/us04.md` com:

* exemplos claros
* fluxo de decisão
* comportamento de fallback
