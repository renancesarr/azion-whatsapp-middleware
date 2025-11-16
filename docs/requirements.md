# Requisitos do Sistema

Este documento define os requisitos funcionais e não funcionais do projeto de orquestração dinâmica de CTAs para WhatsApp executada via Edge Function.

---

## 🔧 Requisitos Funcionais (RF)

**RF01 — Reescrever links de WhatsApp via Edge Function**
A Edge Function deve interceptar o HTML enviado ao cliente e substituir links ou atributos marcados via `data-*` por um link final válido de WhatsApp.

**RF02 — Identificação de CTAs via `data-*`**
O sistema deve localizar botões ou links marcados com atributos como `data-contact="whatsapp"` ou variações documentadas.

**RF03 — Seleção dinâmica de número de WhatsApp**
Deve selecionar um número a partir de uma lista pré-definida usando regras simples (random, round-robin ou pesos).

**RF04 — Seleção dinâmica de mensagem**
Deve inserir mensagens pré-definidas, selecionadas de acordo com a mesma lógica definida para números ou por regras específicas.

**RF05 — Reescrita do HTML antes da entrega**
O HTML final entregue ao cliente (incluindo crawlers) deve conter os links finais já processados pela Edge Function.

**RF06 — Suporte a grupos de contato (opcional no MVP)**
Quando um CTA usar `data-contact-group`, o sistema deve selecionar entre números e mensagens do grupo especificado.

**RF07 — Fallback seguro em caso de falha**
Se ocorrer erro durante o processamento da Edge Function, o CTA deve permanecer funcional utilizando número/mensagem padrão presente no HTML original.

**RF08 — Notificação de erro via Telegram Bot**
Quando uma falha impedir a reescrita parcial ou total, a Edge Function deve notificar via Telegram (Bot API) com: timestamp, página afetada e descrição do erro. A notificação não deve impedir a entrega da página.

---

## 🧱 Requisitos Não Funcionais (RNF)

**RNF01 — SEO seguro**
O HTML entregue deve ser idêntico para bots e usuários, evitando qualquer comportamento interpretável como cloaking.

**RNF02 — Baixa latência**
A Edge Function deve adicionar o mínimo possível de latência, preservando o TTFB adequado para landing pages.

**RNF03 — Independência de JavaScript no front-end**
A orquestração de contato não deve depender de JavaScript executado no cliente. O front-end pode conter scripts personalizados, mas os CTAs devem permanecer funcionais mesmo com JS desativado.

**RNF04 — Reescrita robusta de HTML**
O método de reescrita deve evitar quebras estruturais e preservar a integridade do documento.

**RNF05 — Configuração simples e versionada**
Listas de números, mensagens e regras de seleção devem ser facilmente editáveis e versionadas dentro do repositório.

**RNF06 — Idempotência operacional**
Entradas idênticas (HTML + configurações) devem produzir resultados consistentes, exceto em casos em que randomização seja intencional.

**RNF07 — Portabilidade entre provedores de edge**
A lógica deve ser compatível com múltiplas plataformas de edge computing (Cloudflare, Vercel Edge Functions, Azion, etc.) e evitar dependências proprietárias.

**RNF08 — Consistência entre cliente e crawler**
Todo requester deve receber o mesmo HTML final, garantindo conformidade com práticas de SEO.

**RNF09 — Resiliência a falhas externas**
Falhas em serviços externos (como Telegram Bot API) não devem impedir a entrega da página. Quando ocorrer, a Edge Function deve registrar a falha (log) e continuar operando normalmente.

---

Este documento servirá como base para user stories, use cases e definição de tarefas nas próximas etapas.
