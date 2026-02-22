/**
 * ======================================================
 * Agilizap - Card Agenda (AGD)
 * ======================================================
 */

(function () {
  let ultima = "";
  let penultima = "";

  function iniciarCardAGD() {
    const board = document.getElementById("agilizap-board");
    if (!board) return false;

    if (document.getElementById("agz-card-agd")) return true;

    /* ========= CSS ========= */
    const style = document.createElement("style");
    style.innerHTML = `
      .line-agd { background: #3498db; }

      .agd-item {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        font-size: 15px;
        font-weight: bold;
        line-height: 1.4;
        margin-bottom: 10px;
      }

      .agd-dot {
        width: 8px;
        height: 8px;
        margin-top: 6px;
        border-radius: 50%;
        background: #3498db;
        flex-shrink: 0;
      }
    `;
    document.head.appendChild(style);

    /* ========= HTML ========= */
    const col = document.createElement("div");
    col.className = "agz-column";
    col.id = "agz-card-agd";

    col.innerHTML = `
      <h2>Agenda <span id="count-agd">(0)</span></h2>
      <div class="agz-line line-agd"></div>
      <div id="list-agd" class="agz-list"></div>
    `;

    board.appendChild(col);

    console.log("🔵 Agilizap Card AGD criado");
    render();
    return true;
  }

  function render() {
    const list = document.getElementById("list-agd");
    if (!list) return;

    list.innerHTML = "";
    let count = 0;

    // penúltima em cima
    if (penultima) {
      list.innerHTML += `
        <div class="agd-item">
          <span class="agd-dot"></span>
          <span>${penultima}</span>
        </div>
      `;
      count++;
    }

    // última embaixo
    if (ultima) {
      list.innerHTML += `
        <div class="agd-item">
          <span class="agd-dot"></span>
          <span>${ultima}</span>
        </div>
      `;
      count++;
    }

    document.getElementById("count-agd").innerText = "(" + count + ")";
  }

  // escuta o observer AGD
  window.addEventListener("agilizap:agd:update", (e) => {
    if (!e || !e.detail) return;
    ultima = e.detail.ultima || "";
    penultima = e.detail.penultima || "";
    render();
  });

  // espera o painel existir
  const intervalo = setInterval(() => {
    if (iniciarCardAGD()) clearInterval(intervalo);
  }, 300);
})();
