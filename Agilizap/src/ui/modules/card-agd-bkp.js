/**
 * ======================================================
 * Agilizap - Observer
 * Versão: 0.10.2 (STABLE)
 * 22/01/2026
 * Desenvolvimento: Soluzap - Soluções em Automação
 * ======================================================
 */

console.log("🧠 Agilizap Observer ativo — versão 0.10.2");

// ---------- ESTADO GLOBAL ----------
window.AgilizapState = window.AgilizapState || {};
AgilizapState.conversas = AgilizapState.conversas || {};
AgilizapState.historico = AgilizapState.historico || {};
AgilizapState.pendencias = AgilizapState.pendencias || {};
AgilizapState.alertas = AgilizapState.alertas || {};

// ---------- UTILS ----------
const agora = () => Date.now();

function calcularStatus(segundos) {
  if (segundos < 30) return "ok";
  if (segundos < 90) return "alerta";
  return "critico";
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

// ---------- LISTA ----------
const encontrarLista = () =>
  document.querySelector('[aria-label="Lista de conversas"]');

// ---------- BADGE ----------
const encontrarBadge = item =>
  item.querySelector('span[aria-label*="mensagem"]') ||
  item.querySelector('span[data-testid*="unread"]');

// ---------- EXTRAIR PREVIEW ----------
function extrairMensagem(item) {
  const linhas = item.innerText.split("\n");

  return {
    contato: linhas[0] || "",
    texto: linhas[linhas.length - 1] || "",
    hora: linhas[linhas.length - 2] || ""
  };
}

// ---------- PROCESSAR ITEM ----------
function processarItem(item) {
  const badge = encontrarBadge(item);
  const { contato, texto, hora } = extrairMensagem(item);

  if (!contato) return;

  const hasTag = /\([A-Z]{3}\)/.test(contato);

  const isAGD = contato.includes("(AGD)");
  const isPDA = contato.includes("(PDA)");
  const isALT = contato.includes("(ALT)");
  const isGRP = contato.includes("(GRP)");
  const isATV = contato.includes("(ATV)");

  // 🔵 AGENDA (HISTÓRICO / MURAL)
  if (isAGD) {
    AgilizapState.historico[contato] = {
      texto,
      hora,
      atualizadoEm: agora()
    };
    return;
  }

  // 🟠 PENDÊNCIAS (RESERVADO)
  if (isPDA) {
    AgilizapState.pendencias[contato] = {
      texto,
      hora,
      atualizadoEm: agora()
    };
    return;
  }

  // 🔴 ALERTAS (RESERVADO)
  if (isALT) {
    AgilizapState.alertas[contato] = {
      texto,
      hora,
      atualizadoEm: agora()
    };
    return;
  }

  // ⛔ QUALQUER TAG (EXCETO GRP) NÃO ENTRA COMO CONVERSA
  if (hasTag && !isGRP) return;

  // ---------- SLA NORMAL ----------
  if (badge) {
    if (!AgilizapState.conversas[contato]) {
      AgilizapState.conversas[contato] = {
        contato,
        tipo: isGRP ? "grupo" : "privado",
        categoria: isATV ? "ATV" : "NORMAL",
        iniciadoEm: agora(),
        segundos: 0,
        status: "ok"
      };

      console.log("Agilizap: nova conversa pendente", contato);
      window.dispatchEvent(new Event("agilizap:update"));
    }
  } else {
    if (AgilizapState.conversas[contato]) {
      delete AgilizapState.conversas[contato];
      console.log("Agilizap: conversa resolvida", contato);
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
