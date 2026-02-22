/**
 * ======================================================
 * Agilizap - Observer ALT
 * Captura as 4 últimas mensagens do grupo (ALT)
 * ======================================================
 */

(() => {
  console.log("🔴 Agilizap Observer ALT iniciado");

  const estadoALT = {
    mensagens: []
  };

  function encontrarLista() {
    return document.querySelector('[aria-label="Lista de conversas"]');
  }

  function extrairMensagem(item) {
    const textoCompleto = item.innerText || "";
    const linhas = textoCompleto.split("\n");

    return {
      contato: linhas[0] || "",
      texto: linhas[linhas.length - 1] || ""
    };
  }

  function processarALT(item) {
    const { contato, texto } = extrairMensagem(item);

    if (!contato || !texto) return;
    if (!contato.includes("(ALT)")) return;

    // ignora estados transitórios
    const t = texto.toLowerCase();
    if (t.includes("digitando") || t.includes("gravando")) return;

    // evita duplicar sequência
    if (estadoALT.mensagens[estadoALT.mensagens.length - 1] === texto) return;

    estadoALT.mensagens.push(texto);
    estadoALT.mensagens = estadoALT.mensagens.slice(-4);

    window.dispatchEvent(
      new CustomEvent("agilizap:alt:update", {
        detail: {
          lista: [...estadoALT.mensagens]
        }
      })
    );
  }

  const intervaloALT = setInterval(() => {
    const lista = encontrarLista();
    if (!lista) return;

    clearInterval(intervaloALT);

    const processarTudo = () => {
      lista.querySelectorAll('[role="row"]').forEach(processarALT);
    };

    // estado inicial
    processarTudo();

    // observer realtime
    const observerALT = new MutationObserver(() => {
      processarTudo();
    });

    observerALT.observe(lista, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });

    console.log("🔴 Observer ALT em modo realtime");
  }, 1200);
})();
