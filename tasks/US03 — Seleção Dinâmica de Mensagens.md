# US03 — Seleção Dinâmica de Mensagens

Objetivo: permitir que cada CTA identificado receba **uma mensagem dinâmica**, selecionada a partir de uma lista configurada na edge, usando regras simples (random ou round-robin). A mensagem deve ser corretamente URL-encoded e integrada à URL do WhatsApp.

Todas as tasks são **anatômicas**, indivisíveis e com escopo mínimo.

---

## **T03-001 — Criar lista estática de mensagens na configuração**

Adicionar ao arquivo `edge/config.js` o array:

```js
messages: []
```

Apenas inserir o array vazio.

---

## **T03-002 — Documentar estrutura da lista de mensagens**

Documentar em `docs/us03.md` como as mensagens devem ser armazenadas:

* tipo (string)
* exemplo
* restrições

---

## **T03-003 — Preencher lista de mensagens com valores de teste**

Adicionar ao array `messages` valores estáticos simples, sem lógica.

---

## **T03-004 — Implementar função pura para seleção random de mensagem**

Criar função que:

* recebe array de mensagens
* retorna mensagem aleatória
  Não usa estado externo.

---

## **T03-005 — Criar teste automatizado para seleção random**

Testar:

* mensagem retornada pertence ao array
* nenhuma mensagem fora da lista aparece

---

## **T03-006 — Implementar função pura para seleção round-robin de mensagem**

Criar função que:

* recebe array de mensagens
* recebe índice atual
* retorna próximo índice e mensagem

---

## **T03-007 — Criar teste automatizado para round-robin**

Testar:

* incremento de índice
* retorno ao início da lista

---

## **T03-008 — Criar função para roteamento da estratégia de mensagens**

Função pura que:

* recebe lista
* recebe estratégia (`"random"` ou `"rr"`)
* retorna mensagem selecionada

---

## **T03-009 — Criar teste automatizado para roteamento de estratégia**

Testar:

* seleção correta de método
* erro claro em caso de estratégia inválida

---

## **T03-010 — Implementar função pura de encoding da mensagem**

Criar função que executa `encodeURIComponent()` ou equivalente sobre a mensagem.
Nenhuma montagem de URL ainda.

---

## **T03-011 — Criar teste automatizado do encoding**

Garantir que:

* espaços viram `%20`
* caracteres especiais são codificados

---

## **T03-012 — Integrar mensagem dinâmica na construção da URL**

Modificar a função de montagem da URL para receber:

* número selecionado (US02)
* mensagem selecionada (US03)
* mensagem já encodeada
  E montar:

```html
https://wa.me/<numero>?text=<mensagemCodificada>
```

---

## **T03-013 — Criar teste automatizado da URL final**

Validar:

* a URL contém o número correto
* a mensagem está corretamente encodeada
* não há artefatos como `undefined` ou `null`

---

## **T03-014 — Integrar seleção de mensagem na função orquestradora**

Modificar `processHtmlForWhatsappCtas` para:

* selecionar mensagem
* encodear mensagem
* montar URL com número (US02) + mensagem (US03)
* continuar o fluxo normal de reescrita

---

## **T03-015 — Criar HTML de teste específico para US03**

Criar arquivo `tests/us03-test.html` contendo:

* CTA com `data-contact="whatsapp"`
* textos diferentes para validar impacto mínimo no HTML

---

## **T03-016 — Criar script de teste manual para US03**

Criar `tests/test-us03.js` que:

* carrega `us03-test.html`
* chama função orquestradora
* imprime HTML final

---

## **T03-017 — Validar manualmente a variação de mensagens**

Executar script diversas vezes e confirmar se:

* mensagem alterna (random)
* segue ordem (round-robin)

---

## **T03-018 — Documentar fluxo final de US03**

Atualizar `docs/us03.md` com:

* exemplos de entrada/saída
* estratégias implementadas
* regras de encoding
