# Project Guide

## Visão Geral

Landing pages costumam utilizar CTAs para WhatsApp com números e mensagens estáticas. Essa abordagem limita a distribuição de contato, gera repetição de links e prejudica SEO. Além disso, crawlers não interpretam bem modificações feitas apenas via JavaScript no cliente.

Este projeto implementa uma camada de **orquestração de contato em nível de Edge Function**. A função intercepta o HTML no momento da entrega, identifica elementos marcados com `data-*` e reescreve dinamicamente os links de WhatsApp. O HTML final já chega ao usuário e aos buscadores com links atualizados, mantendo a página estática enquanto permite decisões dinâmicas.

Essa arquitetura garante conteúdo estável para SEO, flexibilidade na distribuição dos contatos e simplicidade na manutenção.

---

## Resultados Esperados

**SEO consistente:** O HTML entregue já contém os links finais, evitando problemas de indexação associados à manipulação client-side.

**Distribuição equilibrada de contatos:** A Edge Function alterna números por lógica simples (random, round-robin ou pesos fixos), evitando saturação e reduzindo riscos de bloqueio.

**Variação dinâmica de mensagens:** Mensagens podem ser alternadas diretamente na borda sem necessidade de alterar arquivos estáticos.

**Arquitetura leve:** As páginas permanecem estáticas, utilizando HTML e Tailwind. A inteligência mora exclusivamente na edge.

**Facilidade de uso:** A marcação dos CTAs é feita via `data-*`, mantendo o projeto organizado e previsível.

---

## Futuro

**Tracking na edge:** Possibilidade de registrar decisões e métricas sem afetar o front-end.

**Lógica de canal cheio:** Seleção de números baseada em uso recente ou volume de acionamentos, exigindo persistência leve.

**Grupos de contato:** Suporte para conjuntos específicos de números e mensagens definidos por `data-contact-group`.

**Configurações externas:** Evolução natural para carregar configurações de uma API ou KV store, aproximando o projeto de um modelo SaaS.
