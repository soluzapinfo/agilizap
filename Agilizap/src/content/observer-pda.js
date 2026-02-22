/**
 * ======================================================
 * Agilizap - Observer PDA
 * Captura as 4 últimas mensagens do grupo (PDA)
 * ======================================================
 */

(() => {
  console.log("🟠 Agilizap Observer PDA iniciado");

  const estadoPDA = {
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

  function processarPDA(item) {
    const { contato, texto } = extrairMensagem(item);

    if (!contato || !texto) return;
    if (!contato.includes("(PDA)")) return;

    // ignora estados transitórios
    const t = texto.toLowerCase();
    if (t.includes("digitando") || t.includes("gravando")) return;

    // evita duplicar sequência
    if (estadoPDA.mensagens[estadoPDA.mensagens.length - 1] === texto) return;

    estadoPDA.mensagens.push(texto);
    estadoPDA.mensagens = estadoPDA.mensagens.slice(-4);

    window.dispatchEvent(
      new CustomEvent("agilizap:pda:update", {
        detail: {
          lista: [...estadoPDA.mensagens]
        }
      })
    );
  }

  const intervaloPDA = setInterval(() => {
    const lista = encontrarLista();
    if (!lista) return;

    clearInterval(intervaloPDA);

    const processarTudo = () => {
      lista.querySelectorAll('[role="row"]').forEach(processarPDA);
    };

    // inicial
    processarTudo();

    // observer agressivo (igual AGD)
    const observerPDA = new MutationObserver(() => {
      processarTudo();
    });

    observerPDA.observe(lista, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });

    console.log("🟠 Observer PDA em modo realtime");
  }, 1200);
})();
