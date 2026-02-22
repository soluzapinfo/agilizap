/**
 * ======================================================
 * Agilizap - Bootstrap Global
 * ======================================================
 * Versão: 0.6.1-stable
 *
 * Responsabilidade:
 * - Criar e manter o ESTADO GLOBAL ÚNICO da aplicação
 * - Servir como ponto de bootstrap do Agilizap
 * - Garantir compatibilidade entre Observer e Painel Full Screen
 *
 * Arquitetura atual:
 * - Observer captura eventos e mensagens do WhatsApp Web
 * - Panel renderiza UI Full Screen com cards dinâmicos
 * - Não existe sidebar ativa neste projeto
 *
 * Cards estáveis nesta versão:
 * - Agenda (AGD)     → mini-feed em tempo real
 * - Pendências (PDA) → controle operacional
 * - Alertas (ALT)    → eventos críticos
 *
 * Regras críticas:
 * - NENHUM outro arquivo pode criar window.AgilizapState
 * - Todos os módulos devem apenas CONSUMIR ou ATUALIZAR este estado
 * - Este arquivo é considerado BASE ESTÁVEL do sistema
 *
 * Histórico de versões:
 * - 0.4.0 → Introdução do estado global
 * - 0.5.0 → Painel Full Screen estabilizado
 *           Cards únicos (sem duplicação)
 *           Manifest funcional
 * - 0.6.0 → Promoção para STABLE
 *           Arquitetura validada em uso real
 * - 0.6.1 → Consolidação dos cards AGD, PDA e ALT
 */

console.log("⚡ Agilizap 0.6.1-stable carregado");

// ---------- ESTADO GLOBAL ÚNICO ----------
if (!window.AgilizapState) {
  window.AgilizapState = {
    conversas: {}, // privadas e grupos

    stats: {
      ativas: 0,
      grupos: 0,
      ativacao: 0
    },

    meta: {
      startedAt: Date.now(),
      version: "0.6.1-stable"
    }
  };
}
