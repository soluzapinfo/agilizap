/**
 * ======================================================
 * Agilizap - Observer AGD
 * Captura as 4 últimas mensagens do grupo (AGD)
 * ======================================================
 */

(() => {
  console.log("🔵 Agilizap Observer AGD iniciado");

  const estadoAGD = {
    mensagens: []
  };

  function encontrarLista() {
    return document.querySelector('[aria-label="Lista de conversas"]');
  }

  function extrairMensagem(item) {
    const linhas = item.innerText
      .split("\n")
      .map(l => l.trim())
      .filter(l => l.length > 0)
      // remove contadores tipo "1", "2"
      .filter(l => !/^\d+$/.test(l));

    return {
      contato: linhas[0] || "",
      texto: linhas[linhas.length - 1] || ""
    };
  }

  function processarAGD(item) {
    const { contato, texto } = extrairMensagem(item);

    if (!contato || !texto) return;
    if (!contato.includes("(AGD)")) return;
    if (/digitando/i.test(texto)) return;

    // evita duplicar a última mensagem
    if (estadoAGD.mensagens[estadoAGD.mensagens.length - 1] === texto) return;

    estadoAGD.mensagens.push(texto);
    estadoAGD.mensagens = estadoAGD.mensagens.slice(-4);

    window.dispatchEvent(
      new CustomEvent("agilizap:agd:update", {
        detail: {
          mensagens: [...estadoAGD.mensagens]
        }
      })
    );
  }

  const intervaloAGD = setInterval(() => {
    const lista = encontrarLista();
    if (!lista) return;

    clearInterval(intervaloAGD);

    // processa estado inicial
    lista.querySelectorAll('[role="row"]').forEach(processarAGD);

    const observerAGD = new MutationObserver(() => {
      lista.querySelectorAll('[role="row"]').forEach(processarAGD);
    });

    observerAGD.observe(lista, { childList: true, subtree: true });

    console.log("🔵 Observer AGD monitorando grupo Agenda");
  }, 1500);
})();
