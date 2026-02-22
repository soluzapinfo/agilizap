/**
 * ======================================================
 * Agilizap - Painel Full Screen
 * Versão: 1.5.2
 * ======================================================
 */

(function () {
  if (document.getElementById("agilizap-root")) return;

  /* ================= CSS ================= */
  const style = document.createElement("style");
  style.innerHTML = `
    :root {
      --bg-main: #0f0f0f;
      --bg-card: #151515;
      --bg-item: #2a2a2a;
      --line: #333;

      --text-main: #ffffff;
      --text-soft: #aaaaaa;

      --ok: #2ecc71;
      --alerta: #f1c40f;
      --critico: #e74c3c;
      --ativ: #9b59b6;
    }

    body.agz-clean {
      --bg-main: #f4f6f8;
      --bg-card: #ffffff;
      --bg-item: #f1f3f5;
      --line: #dcdcdc;

      --text-main: #1f1f1f;
      --text-soft: #555555;
    }

    #agilizap-toggle {
      position: fixed;
      left: 10px;
      bottom: 150px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--alerta);
      color: #000;
      border: none;
      font-size: 22px;
      cursor: pointer;
      z-index: 10001;
    }

    #agilizap-root {
      position: fixed;
      inset: 0;
      background: var(--bg-main);
      color: var(--text-main);
      font-family: Arial, sans-serif;
      z-index: 10000;
      display: flex;
      flex-direction: column;
    }

    #agilizap-root.hidden { display: none; }

    #agilizap-header {
      padding: 14px 20px;
      background: var(--bg-card);
      border-bottom: 1px solid var(--line);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .agz-title {
      font-size: 22px;
      font-weight: bold;
    }

    .agz-header-actions {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .agz-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 18px;
      color: var(--text-soft);
    }

    #agilizap-board {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      padding: 16px;
      overflow: auto;
    }

    .agz-column {
      background: var(--bg-card);
      border-radius: 10px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--line);
    }

    .agz-column h2 {
      margin: 0;
      font-size: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .agz-line {
      height: 3px;
      width: 100%;
      margin: 6px 0 10px;
      border-radius: 2px;
    }

    .line-ativas { background: var(--ok); }
    .line-grupos { background: var(--alerta); }
    .line-ativ   { background: var(--ativ); }

    .agz-list {
      flex: 1;
      overflow-y: auto;
    }

    .agz-card {
      background: var(--bg-item);
      padding: 10px;
      border-radius: 6px;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
    }

    .agz-ok { border-left: 4px solid var(--ok); }
    .agz-alerta { border-left: 4px solid var(--alerta); }
    .agz-critico { border-left: 4px solid var(--critico); }

    .agz-time {
      font-size: 12px;
      color: var(--text-soft);
    }
  `;
  document.head.appendChild(style);

  /* ================= HTML ================= */
  const root = document.createElement("div");
  root.id = "agilizap-root";
  root.classList.add("hidden");

  root.innerHTML = `
    <div id="agilizap-header">
      <span class="agz-title">⚡ Agilizap — Painel</span>
      <div class="agz-header-actions">
        <button id="agz-theme-toggle" class="agz-btn">🌙</button>
        <button id="agilizap-close" class="agz-btn">✖</button>
      </div>
    </div>

    <div id="agilizap-board">
      <div class="agz-column">
        <h2>Conversas Ativas <span id="count-ativas">(0)</span></h2>
        <div class="agz-line line-ativas"></div>
        <div id="list-ativas" class="agz-list"></div>
      </div>

      <div class="agz-column">
        <h2>Grupos <span id="count-grupos">(0)</span></h2>
        <div class="agz-line line-grupos"></div>
        <div id="list-grupos" class="agz-list"></div>
      </div>

      <div class="agz-column">
        <h2>Ativação <span id="count-ativ">(0)</span></h2>
        <div class="agz-line line-ativ"></div>
        <div id="list-ativ" class="agz-list"></div>
      </div>
    </div>
  `;

  document.body.appendChild(root);

  /* ================= BOTÃO FLUTUANTE ================= */
  const toggleBtn = document.createElement("button");
  toggleBtn.id = "agilizap-toggle";
  toggleBtn.innerText = "⚡";
  document.body.appendChild(toggleBtn);

  function simulateEsc() {
    const evt = new KeyboardEvent("keydown", {
      key: "Escape",
      code: "Escape",
      keyCode: 27,
      which: 27,
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(evt);
  }

  function openPanel() {
    simulateEsc();
    setTimeout(() => {
      root.classList.remove("hidden");
      toggleBtn.style.display = "none"; // 🔴 ESCONDE BOTÃO
    }, 50);
  }

  function closePanel() {
    root.classList.add("hidden");
    toggleBtn.style.display = "block"; // 🟢 MOSTRA BOTÃO
  }

  toggleBtn.onclick = openPanel;
  document.getElementById("agilizap-close").onclick = closePanel;

  /* ================= TEMA ================= */
  const themeBtn = document.getElementById("agz-theme-toggle");

  function applyTheme(theme) {
    document.body.classList.toggle("agz-clean", theme === "clean");
    themeBtn.innerText = theme === "clean" ? "🌙" : "☀️";
    localStorage.setItem("agz-theme", theme);
  }

  applyTheme(localStorage.getItem("agz-theme") || "dark");

  themeBtn.onclick = () => {
    applyTheme(document.body.classList.contains("agz-clean") ? "dark" : "clean");
  };

  /* ================= RENDER ================= */
  function renderPanel() {
    if (!window.AgilizapState) return;

    const a = list("ativas"), g = list("grupos"), v = list("ativ");
    a.innerHTML = g.innerHTML = v.innerHTML = "";

    let na = 0, ng = 0, nv = 0;

    Object.values(window.AgilizapState.conversas || {}).forEach(c => {
      const card = document.createElement("div");
      card.className = `agz-card agz-${c.status}`;
      card.innerHTML = `<strong>${c.contato}</strong><span class="agz-time">${c.segundos}s</span>`;

      if (c.contato?.includes("(ATV)")) { v.appendChild(card); nv++; return; }
      if (c.tipo === "grupo") { g.appendChild(card); ng++; return; }
      a.appendChild(card); na++;
    });

    set("ativas", na);
    set("grupos", ng);
    set("ativ", nv);
  }

  function list(t){ return document.getElementById(`list-${t}`); }
  function set(t,n){ document.getElementById(`count-${t}`).innerText = `(${n})`; }

  window.addEventListener("agilizap:update", renderPanel);

  console.log("⚡ Agilizap Painel Full Screen v1.5.2 carregado (botão inteligente)");
})();
