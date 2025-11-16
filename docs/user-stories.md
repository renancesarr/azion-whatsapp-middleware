# User Stories e Casos de Uso

Este documento descreve as principais user stories e casos de uso do sistema de orquestração de CTAs para WhatsApp em Edge Function, incluindo critérios de aceitação e formas práticas de teste.

---

## US01 — Configurar CTA básico com WhatsApp

**Como** desenvolvedor de landing pages
**Quero** marcar botões ou links com atributos `data-*`
**Para** que a Edge Function reescreva automaticamente o link de WhatsApp.

### Critérios de Aceitação — US01

* Dado um HTML contendo um link ou botão com `data-contact="whatsapp"`,
  Quando a página for entregue pela edge,
  Então o atributo `href` deve apontar para uma URL válida de WhatsApp (ex.: `https://wa.me/<numero>?text=<mensagem>`).
* CTAs sem `data-contact="whatsapp"` não devem ser alterados.

### Como Testar — US01

1. Criar uma landing page simples com um botão:

   ```html
   <a data-contact="whatsapp">Falar no WhatsApp</a>
   ```

2. Fazer uma requisição à página passando pela edge (ambiente de teste).
3. Verificar o HTML retornado:

   * O elemento deve possuir `href` preenchido com a URL de WhatsApp.
   * O texto do botão pode permanecer inalterado.
4. Confirmar que outros elementos sem `data-contact` permanecem intactos.

---

## US02 — Selecionar número de WhatsApp dinamicamente

**Como** responsável por atendimento
**Quero** distribuir os contatos entre diferentes números de WhatsApp
**Para** evitar sobrecarga em um único canal.

### Critérios de Aceitação — US02

* A configuração deve permitir definir uma lista de números de WhatsApp.
* A Edge Function deve selecionar um número com base em uma regra simples (ex.: random ou round-robin).
* Em múltiplas requisições simuladas, deve ser possível observar variação entre os números retornados (exceto quando houver apenas um número configurado).

### Como Testar — US02

1. Configurar dois ou mais números na lista interna da Edge Function.
2. Realizar diversas requisições à mesma landing page.
3. Inspecionar o HTML retornado e anotar os valores usados em `href`.
4. Confirmar que mais de um número aparece ao longo das requisições.
5. Se estiver usando round-robin, verificar se a ordem de seleção segue o padrão esperado (ex.: N1, N2, N3, N1, N2, ...).

---

## US03 — Selecionar mensagem dinamicamente

**Como** responsável de marketing
**Quero** alternar mensagens pré-definidas no link de WhatsApp
**Para** testar abordagens diferentes de copy sem alterar o HTML.

### Critérios de Aceitação — US03

* A configuração deve permitir definir uma lista de mensagens possíveis.
* A Edge Function deve montar a URL de WhatsApp com uma mensagem válida e corretamente codificada (URL encoded).
* Em múltiplas requisições, deve ser possível observar variação de mensagens, conforme a regra escolhida.

### Como Testar — US03

1. Definir no código da Edge Function uma lista de mensagens (ex.: M1, M2, M3).
2. Fazer várias requisições à página.
3. Conferir o `href` dos CTAs, verificando o parâmetro `text` da URL.
4. Confirmar que as diferentes mensagens aparecem ao longo das requisições e que os caracteres especiais estão corretamente codificados.

---

## US04 — Utilizar grupos de contato

**Como** desenvolvedor
**Quero** marcar CTAs com grupos de contato (ex.: `comercial`, `suporte`)
**Para** direcionar cada botão a listas específicas de números e mensagens.

### Critérios de Aceitação — US04

* CTAs com `data-contact="whatsapp"` e `data-contact-group="comercial"` devem utilizar números/mensagens da configuração "comercial".
* CTAs com outro grupo (ex.: `suporte`) devem utilizar configurações distintas.
* CTAs sem grupo devem usar a configuração padrão.

### Como Testar — US04

1. Configurar pelo menos dois grupos distintos na Edge Function: `comercial` e `suporte`.
2. Criar uma landing com três botões:

   ```html
   <a data-contact="whatsapp" data-contact-group="comercial">Comercial</a>
   <a data-contact="whatsapp" data-contact-group="suporte">Suporte</a>
   <a data-contact="whatsapp">Padrão</a>
   ```

3. Requisitar a página e inspecionar cada CTA:

   * Verificar que o `href` de cada botão está usando o número/mensagem correto para seu grupo.

---

## US05 — Garantir fallback seguro em caso de falha

**Como** desenvolvedor
**Quero** que os CTAs continuem funcionais mesmo que a Edge Function falhe
**Para** não perder leads por causa de erros na orquestração.

### Critérios de Aceitação — US05

* Se a Edge Function lançar exceção ou não conseguir processar o HTML:

  * O conteúdo original do HTML deve ser entregue sem alterações.
  * CTAs que já possuírem um `href` padrão devem continuar utilizáveis.

### Como Testar — US05

1. Introduzir intencionalmente uma falha na Edge Function (por exemplo, lançar erro em um ponto controlado).
2. Requisitar a página passando pela edge.
3. Verificar que o HTML retornado é o original, sem remoção de CTAs.
4. Confirmar que, se o CTA tiver um `href` estático no HTML fonte, ele segue clicável e funcional.

---

## US06 — Receber notificação de erro via Telegram

**Como** responsável pela operação
**Quero** ser notificado em um canal de Telegram quando ocorrer falha na orquestração
**Para** agir rapidamente em caso de problema.

### Critérios de Aceitação — US06

* Em caso de erro relevante (por exemplo, falha de parsing ou reescrita geral):

  * A Edge Function deve chamar a API do Telegram Bot.
  * A mensagem enviada deve conter: timestamp, página afetada (URL ou path) e descrição resumida do erro.
* A falha no envio da mensagem ao Telegram não deve impedir a entrega da página ao usuário.

### Como Testar — US06

1. Configurar um Bot de Telegram e o ID do chat/canal.
2. Forçar uma falha na Edge Function (ex.: input que quebre parsing controlado).
3. Fazer uma requisição à página.
4. Verificar se a mensagem chega no Telegram com as informações mínimas definidas.
5. Testar também um cenário em que a API do Telegram está indisponível e garantir que a página ainda é entregue.

---

## US07 — Preservar SEO e consistência de conteúdo

**Como** responsável por SEO
**Quero** que bots de busca e usuários recebam o mesmo HTML final
**Para** evitar problemas de indexação ou penalizações.

### Critérios de Aceitação — US07

* O HTML entregue à maioria dos user agents (navegadores, crawlers, ferramentas) deve ser o mesmo para uma mesma URL.
* Não deve haver lógica condicional baseada no user agent para alterar CTAs.

### Como Testar — US07

1. Fazer requisições à mesma URL usando:

   * um navegador comum,
   * um HTTP client simples (curl, HTTPie),
   * uma ferramenta que permita mudar o user agent (simulando crawler).
2. Comparar o HTML retornado (ignorando headers específicos ou detalhes de transporte).
3. Validar que os CTAs reescritos são equivalentes entre os cenários.

---

## US08 — Manter baixa latência

**Como** usuário final
**Quero** que a página carregue rapidamente
**Para** não perceber impacto causado pela orquestração.

### Critérios de Aceitação — US08

* A adição da Edge Function não deve aumentar o TTFB de forma perceptível além de um limite aceitável definido para o projeto.
* O tempo médio de resposta deve se manter dentro de padrões adequados a landing pages (por exemplo, poucos milissegundos adicionais em relação ao HTML estático puro).

### Como Testar — US08

1. Medir o TTFB da página servida de forma estática (sem Edge Function).
2. Ativar a Edge Function e repetir o teste em múltiplas requisições.
3. Comparar os tempos médios.
4. Validar que o aumento está dentro do limite aceitável definido (por exemplo: +5ms, +10ms, dependendo do provedor).

---

## US09 — Garantir portabilidade entre provedores de edge

**Como** mantenedor do projeto
**Quero** que a lógica da Edge Function seja portável entre diferentes provedores
**Para** evitar acoplamento forte com uma única plataforma.

### Critérios de Aceitação — US09

* O código deve evitar o uso de APIs proprietárias específicas, a menos que encapsuladas.
* Qualquer dependência específica de provedor deve estar isolada em um ponto bem definido do código.

### Como Testar — US09

1. Revisar o código da Edge Function identificando chamadas específicas ao runtime.
2. Verificar se a lógica de reescrita e seleção de contatos é agnóstica ao provedor.
3. Opcionalmente, portar um exemplo mínimo para outro provedor de edge e validar comportamento equivalente.

---

Este documento serve como base prática para implementação, testes manuais e, futuramente, automação de testes de integração e end-to-end.
