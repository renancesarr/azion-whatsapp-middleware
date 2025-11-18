# Visão de Arquitetura — Orquestração de CTAs WhatsApp

## 1. Camadas Principais e Papel da Edge Function (T00-001)
- **Entrada**: Edge function recebe requisições HTTP com HTML bruto diretamente do provider (Azion, Cloudflare, Vercel etc.).
- **Processamento**: Pipeline central analisa o documento, aplica regras de reescrita de CTAs e registra eventos/falhas.
- **Saída**: Resposta permanece HTML puro pronto para bots e navegadores, preservando SEO.
- A edge function atua como guardião entre o origin e o cliente, garantindo baixo acoplamento com providers e assegurando o fluxo request → processamento → resposta.

## 2. Módulos Lógicos Previsto (T00-002)
| Módulo | Responsabilidade |
| --- | --- |
| `src/core/` | Objetos de contexto, estado da requisição e utilitários compartilhados entre camadas. |
| `src/pipeline/` | Regras de parsing, seleção de contatos e reescrita de HTML. |
| `src/utils/` | Funções auxiliares que não pertencem ao core/pipeline (ex.: formatadores). |
| `src/providers/` | Adaptadores específicos (compat layer) para normalizar request/response por provedor. |
| `src/debug/` | Coleta de métricas, logs e ferramentas de depuração seguras. |
| `config/` | Fonte única de configurações e toggles versionados. |

## 3. Fluxo da Pipeline em Alto Nível (T00-003)
1. Receber HTML do origin após a edge ler `request.body`.
2. Identificar CTAs marcados via atributos `data-*` relevantes.
3. Selecionar número/mensagem de WhatsApp conforme regras configuradas (`src/core/groups.js` + `src/core/selection.js` fornecem o roteamento global/grupo utilizando estratégia randômica inicial).
4. Montar URL final (`https://wa.me/<number>?text=<message>`).
5. Reescrever elementos HTML alvo com os novos atributos/links.
6. Reconstruir o HTML mantendo a estrutura original.
7. Acionar fallback seguro se algum passo falhar.
8. Disparar notificação (ex.: Telegram) em caso de erros relevantes.
9. Registrar dados de debug para rastreabilidade.

## 4. Configurações como Fonte de Verdade (T00-012)
- `config/` define todos os parâmetros de números, mensagens, grupos, feature flags e provedores suportados.
- Módulos consumidores apenas leem valores; qualquer alteração deve ocorrer via versionamento desse diretório.
- A ausência de valores defaulters deve ser tratada dentro do pipeline, nunca redefinindo constantes em módulos de negócio.

## 5. Interface de `processHtml` (T00-014)
- **Assinatura**: `processHtml(html, context)`.
- **Parâmetros**:
  - `html` (string) — documento bruto recebido do origin.
  - `context` (objeto) — estado derivado do request, provider atual e configurações ativas.
- **Retorno**: string com HTML transformado. No MVP permanece o mesmo documento até que regras sejam implementadas.

## 6. Papel do Contexto (T00-016)
- O contexto encapsula dados do request (URL, headers, corpo), metadata do provider e caches calculados.
- Carrega referências ao config ativo para evitar múltiplas leituras.
- É a superfície para compartilhar dados auxiliares (ex.: resultados de seleção round-robin) entre etapas da pipeline.

## 7. Interface do Handler da Edge (T00-018)
- **Assinatura**: `async function handler(request)`.
- **Entrada**: request normalizado (`normalizeRequest`) contendo métodos para acesso ao body e metadados.
- **Saída**: objeto `{ body: string, init: Record<string, any> }` compatível com o provider, contendo HTML puro pronto para envio.
- Responsável por orquestrar leitura do HTML, delegar ao `processHtml` e retornar a resposta sem alterar cabeçalhos críticos.

## 8. Compat Layer de Providers (T00-020)
- Objetivo: isolar diferenças de runtime (Request/Response) entre Azion, Cloudflare, Vercel e demais providers.
- `normalizeRequest` converte o objeto nativo para estrutura comum; `createResponse` gera saída uniforme viabilizando portabilidade.
- Ao manter esse isolamento, testes locais podem simular múltiplos providers sem bifurcar a lógica principal da pipeline.

## 9. Pontos de Extensão por User Story (T00-027)
| User Story | Ponto na Pipeline |
| --- | --- |
| US01 (CTA básico) | Passos 2-5 ao identificar elementos e montar URLs. |
| US02 (Números dinâmicos) | Seleção de número no passo 3, utilizando config + utils. |
| US03 (Mensagens dinâmicas) | Complementa passo 3 com regras de textos. |
| US04 (Grupos) | Passos 2-3 ao filtrar CTAs por `data-contact-group`. |
| US05 (Fallback) | Passo 7 garantindo retorno do HTML original. |
| US06 (Telegram) | Passo 8 adicionando provider de notificação. |
| US07 (SEO) | Passos 5-6 assegurando consistência de saída. |
| US08 (Performance) | Observabilidade em passos 3-6 + `src/debug/`. |
| US09 (Portabilidade) | Compat layer (`src/providers/`) e handler. |
| US10 (Debug seguro) | `src/debug/` integrando logs e trace seguro. |
| US11 (Suporte multi-edge) | Integrações adicionais dentro de `src/providers/` e ajustes no handler.

## 10. Versão da Arquitetura (T00-030)
- Versão atual registrada: **0.1.0** (mantida em `config/index.js`).
- Qualquer alteração estrutural futura deve atualizar esse valor e descrever mudanças na seção apropriada deste documento.
