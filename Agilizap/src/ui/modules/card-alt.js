/**
 * ======================================================
 * Agilizap - Card Alertas (ALT)
 * ======================================================
 */

(function () {
  let mensagens = [];

  function iniciarCardALT() {
    const board = document.getElementById("agilizap-board");
    if (!board) return false;

    if (document.getElementById("agz-card-alt")) return true;

    /* ========= CSS ========= */
    const style = document.createElement("style");
    style.innerHTML = `
      .line-alt { background: #e74c3c; }

      .alt-item {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        font-size: 14px;
        font-weight: bold;
        padding: 8px;
        border-radius: 6px;
        background: var(--bg-item);
        margin-bottom: 6px;
      }

      .alt-dot {
        width: 8px;
        height: 8px;
        margin-top: 6px;
        border-radius: 50%;
        background: #e74c3c;
        flex-shrink: 0;
      }
    `;
    document.head.appendChild(style);

    /* ========= HTML ========= */
    const col = document.createElement("div");
    col.className = "agz-column";
    col.id = "agz-card-alt";

    col.innerHTML = `
      <h2>Alertas <span id="count-alt">(0)</span></h2>
      <div class="agz-line line-alt"></div>
      <div id="list-alt" class="agz-list"></div>
    `;

    board.appendChild(col);

    console.log("🔴 Agilizap Card ALT criado");
    render();
    return true;
  }

  function render() {
    const list = document.getElementById("list-alt");
    if (!list) return;

    list.innerHTML = "";

    mensagens.forEach(msg => {
      const item = document.createElement("div");
      item.className = "alt-item";
      item.innerHTML = `
        <span class="alt-dot"></span>
        <span>${msg}</span>
      `;
      list.appendChild(item);
    });

    document.getElementById("count-alt").innerText = `(${mensagens.length})`;
  }

  // escuta o observer ALT
  window.addEventListener("agilizap:alt:update", (e) => {
    mensagens = e.detail.lista || [];
    render();
  });

  // espera o painel existir
  const intervalo = setInterval(() => {
    if (iniciarCardALT()) clearInterval(intervalo);
  }, 300);
})();
