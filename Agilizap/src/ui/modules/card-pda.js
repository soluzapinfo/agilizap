/**
 * ======================================================
 * Agilizap - Card Pendências (PDA)
 * ======================================================
 */

(function () {
  let mensagens = [];

  function iniciarCardPDA() {
    const board = document.getElementById("agilizap-board");
    if (!board) return false;

    if (document.getElementById("agz-card-pda")) return true;

    /* ========= CSS ========= */
    const style = document.createElement("style");
    style.innerHTML = `
      .line-pda { background: #e67e22; }

      .pda-item {
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

      .pda-dot {
        width: 8px;
        height: 8px;
        margin-top: 6px;
        border-radius: 50%;
        background: #e67e22;
        flex-shrink: 0;
      }
    `;
    document.head.appendChild(style);

    /* ========= HTML ========= */
    const col = document.createElement("div");
    col.className = "agz-column";
    col.id = "agz-card-pda";

    col.innerHTML = `
      <h2>Pendências <span id="count-pda">(0)</span></h2>
      <div class="agz-line line-pda"></div>
      <div id="list-pda" class="agz-list"></div>
    `;

    board.appendChild(col);

    console.log("🟠 Agilizap Card PDA criado");
    render();
    return true;
  }

  function render() {
    const list = document.getElementById("list-pda");
    if (!list) return;

    list.innerHTML = "";

    mensagens.forEach(msg => {
      const item = document.createElement("div");
      item.className = "pda-item";
      item.innerHTML = `
        <span class="pda-dot"></span>
        <span>${msg}</span>
      `;
      list.appendChild(item);
    });

    document.getElementById("count-pda").innerText = `(${mensagens.length})`;
  }

  // escuta o observer PDA
  window.addEventListener("agilizap:pda:update", (e) => {
    mensagens = e.detail.lista || [];
    render();
  });

  // espera o painel existir
  const intervalo = setInterval(() => {
    if (iniciarCardPDA()) clearInterval(intervalo);
  }, 300);
})();
