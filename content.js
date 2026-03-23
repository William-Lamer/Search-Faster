const CONFIG = {
  maxHints: 9,
  highlightDuration: 700, // ms the glow stays
  navigateDelay: 100,     // adding delay so the user sees the glow
};

let hintElements = [];
let injectedStyleEl = null;


document.addEventListener(
  "keydown",
  (e) => {
    if (e.key === "Alt") {
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat && hintElements.length === 0) showHints();
      return;
    }

    if (!e.altKey) return;
    if (!e.code.startsWith("Digit")) return;

    e.preventDefault();
    e.stopPropagation();

    const num = parseInt(e.code.replace("Digit", ""), 10);
    if (isNaN(num) || num < 1 || num > CONFIG.maxHints) return;

    const results = getSearchResults();
    hideHints();

    if (!e.shiftKey) {
      // Alt + i to open result i in current tab
      const target = results[num - 1];
      if (!target) return;
      applyGlow(target, "single");
      setTimeout(() => window.open(target.href, "_self"), CONFIG.navigateDelay);
    } else {
      // Alt + Shift + i to open first i results in background tabs
      results.slice(0, num).forEach((link) => {
        applyGlow(link, "multi");
        chrome.runtime.sendMessage({ openBackgroundTab: link.href });
      });
    }
  },
  true
);

document.addEventListener(
  "keyup",
  (e) => {
    if (e.key === "Alt") {
      e.preventDefault();
      e.stopPropagation();
      hideHints();
    }
    if (e.key === "Shift" && hintElements.length > 0) {
      setBadgeMode("single");
    }
  },
  true
);

document.addEventListener(
  "keydown",
  (e) => {
    if (e.key === "Shift" && !e.repeat && hintElements.length > 0) {
      setBadgeMode("multi");
    }
  },
  true
);




function getSearchResults() {
  const rso = document.querySelector("#rso");
  if (!rso) return [];
  try {
    return [...rso.querySelectorAll('a[jsname="UWckNb"]')].filter((a) => {
      if (!a.href.startsWith("http")) return false;
      if (a.closest('[jsname="yEVEwb"]')) return false; // exclude People Also Ask
      return true;
    });
  } catch (err) {
    console.warn("LEAPER: getSearchResults failed:", err);
    return [];
  }
}



function getResultContainer(link) {
  return link.closest("[data-hveid]") || link;
}



function showHints() {
  hideHints();
  injectStyles();

  const results = getSearchResults();
  results.slice(0, CONFIG.maxHints).forEach((link, i) => {
    const rect = link.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const badge = document.createElement("div");
    badge.className = "srx-badge";
    badge.textContent = i + 1;

    badge.style.left = `${Math.max(4, window.scrollX + rect.left - 32)}px`;
    badge.style.top = `${window.scrollY + rect.top + rect.height / 2 - 12}px`;

    document.body.appendChild(badge);
    hintElements.push(badge);
  });
}



function hideHints() {
  hintElements.forEach((el) => el.remove());
  hintElements = [];
}



function setBadgeMode(mode) {
  hintElements.forEach((badge) =>
    badge.classList.toggle("srx-badge--multi", mode === "multi")
  );
}



function applyGlow(link, mode) {
  injectStyles();
  const container = getResultContainer(link);
  const cls = mode === "multi" ? "srx-glow-multi" : "srx-glow-single";
  container.classList.add(cls);
  setTimeout(() => container.classList.remove(cls), CONFIG.highlightDuration);
}





function injectStyles() {
  if (injectedStyleEl) return;
  injectedStyleEl = document.createElement("style");
  injectedStyleEl.textContent = `
    .srx-badge {
      position: absolute;
      pointer-events: none;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 7px;
      font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #fff;
      background: linear-gradient(145deg, #1d4ed8, #6d28d9);
      box-shadow:
        0 2px 8px rgba(109, 40, 217, 0.55),
        0 0 0 1px rgba(255, 255, 255, 0.12) inset;
      animation: srx-pop .15s cubic-bezier(0.34, 1.56, 0.64, 1) both;
      transition: background 0.12s ease, box-shadow 0.12s ease;
      user-select: none;
      /* Sit below Google's sticky header (z-index ~1000) but above page content */
      z-index: 900;
    }

    /* holding shift */
    .srx-badge--multi {
      background: linear-gradient(145deg, #059669, #0d9488);
      box-shadow:
        0 2px 8px rgba(5, 150, 105, 0.55),
        0 0 0 1px rgba(255, 255, 255, 0.12) inset;
    }

    @keyframes srx-pop {
      from { opacity: 0; transform: scale(0.5) translateY(4px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }

    /* Single-open glow — green */
    .srx-glow-single {
      outline: 2px solid #4f46e5 !important;
      outline-offset: 4px !important;
      border-radius: 6px !important;
      box-shadow:
        0 0 0 5px rgba(79, 70, 229, 0.18),
        0 0 24px rgba(79, 70, 229, 0.25) !important;
      transition: outline 0.08s ease, box-shadow 0.08s ease !important;
    }

    /* Multi-open glow — green */
    .srx-glow-multi {
      outline: 2px solid #059669 !important;
      outline-offset: 4px !important;
      border-radius: 6px !important;
      box-shadow:
        0 0 0 5px rgba(5, 150, 105, 0.16),
        0 0 24px rgba(5, 150, 105, 0.22) !important;
      transition: outline 0.08s ease, box-shadow 0.08s ease !important;
    }
  `;
  document.head.appendChild(injectedStyleEl);
}

