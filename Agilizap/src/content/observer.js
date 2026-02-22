/**
 * ======================================================
 * Agilizap - Observer Core (imutável)
 * Versão: 0.10.1 (CORE)
 * ======================================================
 */

console.log("🧠 Agilizap Observer Core ativo — versão 0.10.1");

// ---------- ESTADO GLOBAL ----------
window.AgilizapState = window.AgilizapState || {};
AgilizapState.conversas = AgilizapState.conversas || {};
AgilizapState.historico = AgilizapState.historico || {};

// ---------- CONFIG ----------
const CATEGORIAS_EXTERNAS = ["AGD", "PDA", "ALT"];

// ---------- UTILS ----------
const agora = () => Date.now();

function calcularStatus(segundos) {
  if (segundos < 30) return "ok";
  if (segundos < 90) return "alerta";
  return "critico";
}

function extrairTag(contato) {
  const match = contato.match(/\(([^)]+)\)/);
  return match ? match[1].toUpperCase() : null;
}

// ---------- TIMER SLA ----------
setInterval(() => {
  let mudou = false;

  Object.values(AgilizapState.conversas).forEach(conv => {
    const segundos = Math.floor((agora() - conv.iniciadoEm) / 1000);
    const status = calcularStatus(segundos);

    if (conv.segundos !== segundos || conv.status !== status) {
      conv.segundos = segundos;
      conv.status = status;
      mudou = true;
    }
  });

  if (mudou) window.dispatchEvent(new Event("agilizap:update"));
}, 1000);

// ---------- DOM ----------
const encontrarLista = () =>
  document.querySelector('[aria-label="Lista de conversas"]');

const encontrarBadge = item =>
  item.querySelector('span[aria-label*="mensagem"]') ||
  item.querySelector('span[data-testid*="unread"]');

// ---------- EXTRAIR DADOS ----------
function extrairMensagem(item) {
  const linhas = item.innerText.split("\n");
  return {
    contato: linhas[0] || "",
    texto: linhas[linhas.length - 1] || "",
    hora: linhas[linhas.length - 2] || ""
  };
}

// ---------- PROCESSAMENTO ----------
function processarItem(item) {
  const badge = encontrarBadge(item);
  const { contato } = extrairMensagem(item);

  if (!contato) return;

  const tag = extrairTag(contato);

  // 👉 CATEGORIAS DE BAIXO: IGNORA TOTALMENTE
  if (tag && CATEGORIAS_EXTERNAS.includes(tag)) {
    return;
  }

  const isGRP = tag === "GRP";
  const isATV = tag === "ATV";

  // ---------- COM MENSAGEM ----------
  if (badge) {
    if (!AgilizapState.conversas[contato]) {
      AgilizapState.conversas[contato] = {
        contato,
        tipo: isGRP ? "grupo" : "privado",
        categoria: isATV ? "ATV" : isGRP ? "GRP" : "NORMAL",
        iniciadoEm: agora(),
        segundos: 0,
        status: "ok"
      };

      window.dispatchEvent(new Event("agilizap:update"));
    }
  }

  // ---------- SEM MENSAGEM ----------
  else {
    if (AgilizapState.conversas[contato]) {
      AgilizapState.historico[contato] = {
        ...AgilizapState.conversas[contato],
        finalizadoEm: agora()
      };

      delete AgilizapState.conversas[contato];
      window.dispatchEvent(new Event("agilizap:update"));
    }
  }
}

// ---------- OBSERVER ----------
const intervalo = setInterval(() => {
  const lista = encontrarLista();
  if (!lista) return;

  clearInterval(intervalo);
  console.log("✅ Agilizap: Lista de conversas encontrada");

  lista.querySelectorAll('[role="row"]').forEach(processarItem);

  const observer = new MutationObserver(() => {
    lista.querySelectorAll('[role="row"]').forEach(processarItem);
  });

  observer.observe(lista, { childList: true, subtree: true });
}, 1500);
