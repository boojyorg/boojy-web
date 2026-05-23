/**
 * Boojy Dev Tools — floating panel for live UI testing
 * Only activates on localhost or with ?dev=1 query param
 */
(function () {
  const isLocal = location.hostname === "localhost" || location.hostname === "127.0.0.1";
  const hasParam = new URLSearchParams(location.search).get("dev") === "1";
  if (!isLocal && !hasParam) return;

  // Defaults (must match shared.css :root)
  const DEFAULTS = {
    accent: "#F5A623",
    bg: "#13151C",
    bgCard: "#2C2C32",
    cloudCard: "#2C2C32",
    cloudCta: "#D9D9D9",
    glowOpacity: 75,
    glowSize: 1400,
    glowColor: [196, 197, 255],
  };

  const PRESETS = {
    gold: "#F5A623",
    purple: "#8B5CF6",
    sun: "#FBBF24",
    nebula: "#A78BFA",
  };

  // --- Helpers ---
  function hexToRgb(hex) {
    const n = parseInt(hex.replace("#", ""), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
  }

  function setVar(name, value) {
    document.documentElement.style.setProperty(name, value);
  }

  function showToast(msg) {
    let t = document.querySelector(".dt-toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "dt-toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("dt-toast-show");
    clearTimeout(t._tid);
    t._tid = setTimeout(() => t.classList.remove("dt-toast-show"), 1500);
  }

  // --- Inject CSS ---
  const style = document.createElement("style");
  style.textContent = `
    .dt-gear {
      position: fixed; bottom: 16px; right: 16px; z-index: 10001;
      width: 32px; height: 32px; border-radius: 50%;
      background: rgba(28, 28, 38, 0.85); backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.1); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s, background 0.2s;
    }
    .dt-gear:hover { transform: scale(1.1); background: rgba(28,28,38,1); }
    .dt-gear.dt-active { background: rgba(139,92,246,0.3); }
    .dt-gear svg { width: 16px; height: 16px; fill: #9CA3AF; }
    .dt-gear.dt-active svg { fill: #c4b5fd; }

    .dt-panel {
      position: fixed; bottom: 56px; right: 16px; z-index: 10000;
      width: 280px; max-height: 70vh; overflow-y: auto;
      background: rgba(18, 18, 28, 0.95); backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
      padding: 16px; font-family: -apple-system, sans-serif;
      display: none; animation: dt-slide 0.15s ease;
    }
    .dt-panel.dt-open { display: block; }
    @keyframes dt-slide { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    .dt-panel::-webkit-scrollbar { width: 4px; }
    .dt-panel::-webkit-scrollbar-track { background: transparent; }
    .dt-panel::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }

    .dt-title { font-size: 11px; font-weight: 700; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px; }
    .dt-group { margin-bottom: 14px; }
    .dt-label { font-size: 11px; color: #9CA3AF; margin-bottom: 6px; display: flex; align-items: center; justify-content: space-between; }
    .dt-swatch { width: 14px; height: 14px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.15); display: inline-block; }
    .dt-hex { font-family: monospace; font-size: 10px; color: #6B7280; }

    .dt-slider { width: 100%; height: 4px; -webkit-appearance: none; appearance: none; background: rgba(255,255,255,0.1); border-radius: 2px; outline: none; margin: 4px 0; }
    .dt-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; border-radius: 50%; cursor: pointer; }
    .dt-slider.dt-r::-webkit-slider-thumb { background: #EF4444; }
    .dt-slider.dt-g::-webkit-slider-thumb { background: #22C55E; }
    .dt-slider.dt-b::-webkit-slider-thumb { background: #3B82F6; }

    .dt-section { font-size: 10px; font-weight: 700; color: #6B7280; text-transform: uppercase; letter-spacing: 0.08em; margin: 16px 0 10px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.06); }
    .dt-slider.dt-generic::-webkit-slider-thumb { background: #9CA3AF; }
    .dt-val { font-family: monospace; font-size: 10px; color: #6B7280; }

    .dt-presets { display: flex; gap: 6px; margin-bottom: 14px; }
    .dt-btn { flex: 1; padding: 6px 0; border: 1px solid rgba(255,255,255,0.12); border-radius: 6px;
      background: rgba(255,255,255,0.04); color: #D1D5DB; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .dt-btn:hover { background: rgba(255,255,255,0.1); }
    .dt-btn-reset { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.2); color: #FCA5A5; }
    .dt-btn-reset:hover { background: rgba(239,68,68,0.2); }

    .dt-toast {
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 600;
      background: rgba(28,28,38,0.95); color: #D1D5DB; border: 1px solid rgba(255,255,255,0.1);
      backdrop-filter: blur(8px); z-index: 10002;
      opacity: 0; transition: opacity 0.2s; pointer-events: none;
    }
    .dt-toast.dt-toast-show { opacity: 1; }

    .dt-guide-v {
      position: fixed; top: 0; width: 1px; height: 100vh;
      background: red; z-index: 9999; cursor: col-resize;
      display: none; pointer-events: auto;
    }
    .dt-guide-v.dt-guide-visible { display: block; }
    .dt-guide-v .dt-guide-label {
      position: absolute; top: 8px; left: 6px;
    }

    .dt-guide-h {
      position: fixed; left: 0; height: 1px; width: 100vw;
      background: red; z-index: 9999; cursor: row-resize;
      display: none; pointer-events: auto;
    }
    .dt-guide-h.dt-guide-visible { display: block; }
    .dt-guide-h .dt-guide-label {
      position: absolute; top: 6px; left: 8px;
    }

    .dt-guide-label {
      font-size: 10px; font-family: monospace; color: red;
      background: rgba(0,0,0,0.7); padding: 1px 4px; border-radius: 3px;
      white-space: nowrap; pointer-events: none; user-select: none;
    }

    .dt-toggle-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
    .dt-toggle-label { font-size: 11px; color: #9CA3AF; }
    .dt-toggle {
      width: 32px; height: 18px; border-radius: 9px; border: none; cursor: pointer;
      background: rgba(255,255,255,0.1); position: relative; transition: background 0.2s;
    }
    .dt-toggle.dt-on { background: rgba(239,68,68,0.5); }
    .dt-toggle::after {
      content: ''; position: absolute; top: 2px; left: 2px;
      width: 14px; height: 14px; border-radius: 50%; background: #D1D5DB;
      transition: transform 0.2s;
    }
    .dt-toggle.dt-on::after { transform: translateX(14px); }
  `;
  document.head.appendChild(style);

  // --- Build DOM ---
  // Gear button
  const gear = document.createElement("button");
  gear.className = "dt-gear";
  gear.innerHTML = `<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.48.48 0 00-.48-.41h-3.84a.48.48 0 00-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.74 8.87a.48.48 0 00.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.26.41.48.41h3.84c.24 0 .44-.17.48-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 00-.12-.61l-2.03-1.58zM12 15.6A3.6 3.6 0 1115.6 12 3.6 3.6 0 0112 15.6z"/></svg>`;
  document.body.appendChild(gear);

  // Panel
  const panel = document.createElement("div");
  panel.className = "dt-panel";
  document.body.appendChild(panel);

  // Toggle
  gear.addEventListener("click", () => {
    const open = panel.classList.toggle("dt-open");
    gear.classList.toggle("dt-active", open);
  });

  // --- Slider group builder ---
  function buildRgbGroup(label, cssVar, defaultHex) {
    const group = document.createElement("div");
    group.className = "dt-group";

    let [r, g, b] = hexToRgb(defaultHex);
    const swatch = document.createElement("span");
    swatch.className = "dt-swatch";
    swatch.style.background = defaultHex;
    const hexLabel = document.createElement("span");
    hexLabel.className = "dt-hex";
    hexLabel.textContent = defaultHex;

    const lbl = document.createElement("div");
    lbl.className = "dt-label";
    lbl.innerHTML = `<span>${label}</span>`;
    lbl.appendChild(hexLabel);
    lbl.insertBefore(swatch, hexLabel);
    group.appendChild(lbl);

    function update() {
      const hex = rgbToHex(r, g, b);
      swatch.style.background = hex;
      hexLabel.textContent = hex;
      setVar(cssVar, hex);
      // Also update hover variant if it's the accent
      if (cssVar === "--color-accent") {
        const hr = Math.min(255, r + 20);
        const hg = Math.min(255, g + 20);
        const hb = Math.min(255, b + 20);
        setVar("--color-accent-hover", rgbToHex(hr, hg, hb));
      }
      // Also update hover variant for cloud CTA
      if (cssVar === "--color-cloud-cta") {
        const hr = Math.min(255, r + 20);
        const hg = Math.min(255, g + 20);
        const hb = Math.min(255, b + 20);
        setVar("--color-cloud-cta-hover", rgbToHex(hr, hg, hb));
      }
    }

    function makeSlider(channel, value, cls) {
      const s = document.createElement("input");
      s.type = "range"; s.min = 0; s.max = 255; s.value = value;
      s.className = `dt-slider ${cls}`;
      s.addEventListener("input", () => {
        if (channel === "r") r = +s.value;
        if (channel === "g") g = +s.value;
        if (channel === "b") b = +s.value;
        update();
      });
      group.appendChild(s);
      return s;
    }

    const sr = makeSlider("r", r, "dt-r");
    const sg = makeSlider("g", g, "dt-g");
    const sb = makeSlider("b", b, "dt-b");

    group._setHex = (hex) => {
      [r, g, b] = hexToRgb(hex);
      sr.value = r; sg.value = g; sb.value = b;
      update();
    };

    return group;
  }

  // --- Populate panel ---
  const title = document.createElement("div");
  title.className = "dt-title";
  title.textContent = "Dev Tools";
  panel.appendChild(title);

  // Presets
  const presets = document.createElement("div");
  presets.className = "dt-presets";
  presets.style.flexWrap = "wrap";
  const btnGold = document.createElement("button");
  btnGold.className = "dt-btn";
  btnGold.textContent = "Gold";
  const btnPurple = document.createElement("button");
  btnPurple.className = "dt-btn";
  btnPurple.textContent = "Purple";
  const btnSun = document.createElement("button");
  btnSun.className = "dt-btn";
  btnSun.textContent = "Sun";
  const btnNebula = document.createElement("button");
  btnNebula.className = "dt-btn";
  btnNebula.textContent = "Nebula";
  presets.appendChild(btnGold);
  presets.appendChild(btnPurple);
  presets.appendChild(btnSun);
  presets.appendChild(btnNebula);
  panel.appendChild(presets);

  // Color groups
  const accentGroup = buildRgbGroup("Accent Color", "--color-accent", DEFAULTS.accent);
  const bgGroup = buildRgbGroup("Background", "--color-bg", DEFAULTS.bg);
  const cardGroup = buildRgbGroup("Card Background", "--color-bg-card", DEFAULTS.bgCard);

  panel.appendChild(accentGroup);
  panel.appendChild(bgGroup);
  panel.appendChild(cardGroup);

  // --- Cloud Card section ---
  const cloudSection = document.createElement("div");
  cloudSection.className = "dt-section";
  cloudSection.textContent = "Cloud Card";
  panel.appendChild(cloudSection);

  const cloudCardGroup = buildRgbGroup("Card Background", "--color-cloud-card", DEFAULTS.cloudCard);
  const cloudCtaGroup = buildRgbGroup("Button", "--color-cloud-cta", DEFAULTS.cloudCta);
  panel.appendChild(cloudCardGroup);
  panel.appendChild(cloudCtaGroup);

  // --- Hero Glow section ---
  const glowEl = document.querySelector(".hub-hero-glow");

  if (glowEl) {
    function setGlowVar(name, value) {
      glowEl.style.setProperty(name, value);
    }

    const glowSection = document.createElement("div");
    glowSection.className = "dt-section";
    glowSection.textContent = "Hero Glow";
    panel.appendChild(glowSection);

    // Opacity slider
    const opacityGroup = document.createElement("div");
    opacityGroup.className = "dt-group";
    const opacityVal = document.createElement("span");
    opacityVal.className = "dt-val";
    opacityVal.textContent = DEFAULTS.glowOpacity + "%";
    const opacityLbl = document.createElement("div");
    opacityLbl.className = "dt-label";
    opacityLbl.innerHTML = "<span>Opacity</span>";
    opacityLbl.appendChild(opacityVal);
    opacityGroup.appendChild(opacityLbl);
    const opacitySlider = document.createElement("input");
    opacitySlider.type = "range"; opacitySlider.min = 0; opacitySlider.max = 100; opacitySlider.value = DEFAULTS.glowOpacity;
    opacitySlider.className = "dt-slider dt-generic";
    opacitySlider.addEventListener("input", () => {
      const v = +opacitySlider.value;
      opacityVal.textContent = v + "%";
      setGlowVar("--glow-opacity", v / 100);
    });
    opacityGroup.appendChild(opacitySlider);
    panel.appendChild(opacityGroup);

    // Size slider
    const sizeGroup = document.createElement("div");
    sizeGroup.className = "dt-group";
    const sizeVal = document.createElement("span");
    sizeVal.className = "dt-val";
    sizeVal.textContent = DEFAULTS.glowSize + "px";
    const sizeLbl = document.createElement("div");
    sizeLbl.className = "dt-label";
    sizeLbl.innerHTML = "<span>Size</span>";
    sizeLbl.appendChild(sizeVal);
    sizeGroup.appendChild(sizeLbl);
    const sizeSlider = document.createElement("input");
    sizeSlider.type = "range"; sizeSlider.min = 200; sizeSlider.max = 1800; sizeSlider.value = DEFAULTS.glowSize;
    sizeSlider.className = "dt-slider dt-generic";
    sizeSlider.addEventListener("input", () => {
      const w = +sizeSlider.value;
      const h = Math.round(w * 0.71);
      sizeVal.textContent = w + "px";
      setGlowVar("--glow-width", w + "px");
      setGlowVar("--glow-height", h + "px");
    });
    sizeGroup.appendChild(sizeSlider);
    panel.appendChild(sizeGroup);

    // Glow RGB group builder (sets comma-separated RGB string)
    function buildGlowRgbGroup(label, cssVar, defaultRgb) {
      const group = document.createElement("div");
      group.className = "dt-group";

      let [r, g, b] = defaultRgb;
      const swatch = document.createElement("span");
      swatch.className = "dt-swatch";
      swatch.style.background = rgbToHex(r, g, b);
      const hexLabel = document.createElement("span");
      hexLabel.className = "dt-hex";
      hexLabel.textContent = rgbToHex(r, g, b);

      const lbl = document.createElement("div");
      lbl.className = "dt-label";
      lbl.innerHTML = `<span>${label}</span>`;
      lbl.appendChild(hexLabel);
      lbl.insertBefore(swatch, hexLabel);
      group.appendChild(lbl);

      function update() {
        const hex = rgbToHex(r, g, b);
        swatch.style.background = hex;
        hexLabel.textContent = hex;
        setGlowVar(cssVar, `${r}, ${g}, ${b}`);
      }

      function makeSlider(channel, value, cls) {
        const s = document.createElement("input");
        s.type = "range"; s.min = 0; s.max = 255; s.value = value;
        s.className = `dt-slider ${cls}`;
        s.addEventListener("input", () => {
          if (channel === "r") r = +s.value;
          if (channel === "g") g = +s.value;
          if (channel === "b") b = +s.value;
          update();
        });
        group.appendChild(s);
        return s;
      }

      const sr = makeSlider("r", r, "dt-r");
      const sg = makeSlider("g", g, "dt-g");
      const sb = makeSlider("b", b, "dt-b");

      group._reset = (rgb) => {
        [r, g, b] = rgb;
        sr.value = r; sg.value = g; sb.value = b;
        update();
      };

      return group;
    }

    const glowColorGroup = buildGlowRgbGroup("Color", "--glow-color", DEFAULTS.glowColor);
    panel.appendChild(glowColorGroup);

    // Expose reset for glow controls
    var resetGlow = function () {
      opacitySlider.value = DEFAULTS.glowOpacity;
      opacityVal.textContent = DEFAULTS.glowOpacity + "%";
      setGlowVar("--glow-opacity", DEFAULTS.glowOpacity / 100);

      sizeSlider.value = DEFAULTS.glowSize;
      sizeVal.textContent = DEFAULTS.glowSize + "px";
      setGlowVar("--glow-width", DEFAULTS.glowSize + "px");
      setGlowVar("--glow-height", Math.round(DEFAULTS.glowSize * 0.71) + "px");

      glowColorGroup._reset(DEFAULTS.glowColor);
    };
  }

  // --- Notes Feature Cards section ---
  const notesFeatureCards = document.querySelectorAll(".notes-feature-card");

  if (notesFeatureCards.length) {
    const CARD_PRESETS = {
      "Muted Teal": "#2A3B3D",
      "Notes Teal": "#A4CACE",
      "App Dark":   "#040412",
    };

    const fcSection = document.createElement("div");
    fcSection.className = "dt-section";
    fcSection.textContent = "Feature Cards";
    panel.appendChild(fcSection);

    const fcPresets = document.createElement("div");
    fcPresets.className = "dt-presets";
    fcPresets.style.flexWrap = "wrap";

    let activeBtn = null;

    Object.entries(CARD_PRESETS).forEach(([name, value]) => {
      const btn = document.createElement("button");
      btn.className = "dt-btn";
      btn.textContent = name;
      btn.addEventListener("click", () => {
        setVar("--notes-card-bg", value);
        if (activeBtn) activeBtn.style.borderColor = "rgba(255,255,255,0.12)";
        btn.style.borderColor = "#A4CACE";
        activeBtn = btn;
        showToast("Cards → " + name);
      });
      fcPresets.appendChild(btn);
    });

    panel.appendChild(fcPresets);

    // Expose reset
    var resetNotesCards = function () {
      document.documentElement.style.removeProperty("--notes-card-bg");
      if (activeBtn) { activeBtn.style.borderColor = "rgba(255,255,255,0.12)"; activeBtn = null; }
    };
  }

  // --- Notes Hero Glow section ---
  const notesGlowEl = document.querySelector(".notes-hero-glow");

  if (notesGlowEl) {
    function setNotesGlowVar(name, value) {
      notesGlowEl.style.setProperty(name, value);
    }

    const NOTES_GLOW_DEFAULTS = {
      glowOpacity: 75,
      glowSize: 1400,
      glowColor: [218, 240, 244],
    };

    const notesGlowSection = document.createElement("div");
    notesGlowSection.className = "dt-section";
    notesGlowSection.textContent = "Hero Glow";
    panel.appendChild(notesGlowSection);

    // Opacity slider
    const nOpacityGroup = document.createElement("div");
    nOpacityGroup.className = "dt-group";
    const nOpacityVal = document.createElement("span");
    nOpacityVal.className = "dt-val";
    nOpacityVal.textContent = NOTES_GLOW_DEFAULTS.glowOpacity + "%";
    const nOpacityLbl = document.createElement("div");
    nOpacityLbl.className = "dt-label";
    nOpacityLbl.innerHTML = "<span>Opacity</span>";
    nOpacityLbl.appendChild(nOpacityVal);
    nOpacityGroup.appendChild(nOpacityLbl);
    const nOpacitySlider = document.createElement("input");
    nOpacitySlider.type = "range"; nOpacitySlider.min = 0; nOpacitySlider.max = 100; nOpacitySlider.value = NOTES_GLOW_DEFAULTS.glowOpacity;
    nOpacitySlider.className = "dt-slider dt-generic";
    nOpacitySlider.addEventListener("input", () => {
      const v = +nOpacitySlider.value;
      nOpacityVal.textContent = v + "%";
      setNotesGlowVar("--glow-opacity", v / 100);
    });
    nOpacityGroup.appendChild(nOpacitySlider);
    panel.appendChild(nOpacityGroup);

    // Size slider
    const nSizeGroup = document.createElement("div");
    nSizeGroup.className = "dt-group";
    const nSizeVal = document.createElement("span");
    nSizeVal.className = "dt-val";
    nSizeVal.textContent = NOTES_GLOW_DEFAULTS.glowSize + "px";
    const nSizeLbl = document.createElement("div");
    nSizeLbl.className = "dt-label";
    nSizeLbl.innerHTML = "<span>Size</span>";
    nSizeLbl.appendChild(nSizeVal);
    nSizeGroup.appendChild(nSizeLbl);
    const nSizeSlider = document.createElement("input");
    nSizeSlider.type = "range"; nSizeSlider.min = 200; nSizeSlider.max = 1800; nSizeSlider.value = NOTES_GLOW_DEFAULTS.glowSize;
    nSizeSlider.className = "dt-slider dt-generic";
    nSizeSlider.addEventListener("input", () => {
      const w = +nSizeSlider.value;
      const h = Math.round(w * 0.71);
      nSizeVal.textContent = w + "px";
      setNotesGlowVar("--glow-width", w + "px");
      setNotesGlowVar("--glow-height", h + "px");
    });
    nSizeGroup.appendChild(nSizeSlider);
    panel.appendChild(nSizeGroup);

    // Glow RGB group builder (sets comma-separated RGB string)
    function buildNotesGlowRgbGroup(label, cssVar, defaultRgb) {
      const group = document.createElement("div");
      group.className = "dt-group";

      let [r, g, b] = defaultRgb;
      const swatch = document.createElement("span");
      swatch.className = "dt-swatch";
      swatch.style.background = rgbToHex(r, g, b);
      const hexLabel = document.createElement("span");
      hexLabel.className = "dt-hex";
      hexLabel.textContent = rgbToHex(r, g, b);

      const lbl = document.createElement("div");
      lbl.className = "dt-label";
      lbl.innerHTML = `<span>${label}</span>`;
      lbl.appendChild(hexLabel);
      lbl.insertBefore(swatch, hexLabel);
      group.appendChild(lbl);

      function update() {
        const hex = rgbToHex(r, g, b);
        swatch.style.background = hex;
        hexLabel.textContent = hex;
        setNotesGlowVar(cssVar, `${r}, ${g}, ${b}`);
      }

      function makeSlider(channel, value, cls) {
        const s = document.createElement("input");
        s.type = "range"; s.min = 0; s.max = 255; s.value = value;
        s.className = `dt-slider ${cls}`;
        s.addEventListener("input", () => {
          if (channel === "r") r = +s.value;
          if (channel === "g") g = +s.value;
          if (channel === "b") b = +s.value;
          update();
        });
        group.appendChild(s);
        return s;
      }

      const sr = makeSlider("r", r, "dt-r");
      const sg = makeSlider("g", g, "dt-g");
      const sb = makeSlider("b", b, "dt-b");

      group._reset = (rgb) => {
        [r, g, b] = rgb;
        sr.value = r; sg.value = g; sb.value = b;
        update();
      };

      return group;
    }

    const notesGlowColorGroup = buildNotesGlowRgbGroup("Color", "--glow-color", NOTES_GLOW_DEFAULTS.glowColor);
    panel.appendChild(notesGlowColorGroup);

    // Expose reset for notes glow controls
    var resetNotesGlow = function () {
      nOpacitySlider.value = NOTES_GLOW_DEFAULTS.glowOpacity;
      nOpacityVal.textContent = NOTES_GLOW_DEFAULTS.glowOpacity + "%";
      setNotesGlowVar("--glow-opacity", NOTES_GLOW_DEFAULTS.glowOpacity / 100);

      nSizeSlider.value = NOTES_GLOW_DEFAULTS.glowSize;
      nSizeVal.textContent = NOTES_GLOW_DEFAULTS.glowSize + "px";
      setNotesGlowVar("--glow-width", NOTES_GLOW_DEFAULTS.glowSize + "px");
      setNotesGlowVar("--glow-height", Math.round(NOTES_GLOW_DEFAULTS.glowSize * 0.71) + "px");

      notesGlowColorGroup._reset(NOTES_GLOW_DEFAULTS.glowColor);
    };
  }

  // --- Audio Hero Glow section ---
  const audioGlowEl = document.querySelector(".audio-hero-glow");

  if (audioGlowEl) {
    function setAudioGlowVar(name, value) {
      audioGlowEl.style.setProperty(name, value);
    }

    const AUDIO_GLOW_DEFAULTS = {
      glowOpacity: 90,
      glowSize: 1400,
      glowColor: [86, 177, 255],
    };

    const audioGlowSection = document.createElement("div");
    audioGlowSection.className = "dt-section";
    audioGlowSection.textContent = "Hero Glow";
    panel.appendChild(audioGlowSection);

    // Opacity slider
    const aOpacityGroup = document.createElement("div");
    aOpacityGroup.className = "dt-group";
    const aOpacityVal = document.createElement("span");
    aOpacityVal.className = "dt-val";
    aOpacityVal.textContent = AUDIO_GLOW_DEFAULTS.glowOpacity + "%";
    const aOpacityLbl = document.createElement("div");
    aOpacityLbl.className = "dt-label";
    aOpacityLbl.innerHTML = "<span>Opacity</span>";
    aOpacityLbl.appendChild(aOpacityVal);
    aOpacityGroup.appendChild(aOpacityLbl);
    const aOpacitySlider = document.createElement("input");
    aOpacitySlider.type = "range"; aOpacitySlider.min = 0; aOpacitySlider.max = 100; aOpacitySlider.value = AUDIO_GLOW_DEFAULTS.glowOpacity;
    aOpacitySlider.className = "dt-slider dt-generic";
    aOpacitySlider.addEventListener("input", () => {
      const v = +aOpacitySlider.value;
      aOpacityVal.textContent = v + "%";
      setAudioGlowVar("--glow-opacity", v / 100);
    });
    aOpacityGroup.appendChild(aOpacitySlider);
    panel.appendChild(aOpacityGroup);

    // Size slider
    const aSizeGroup = document.createElement("div");
    aSizeGroup.className = "dt-group";
    const aSizeVal = document.createElement("span");
    aSizeVal.className = "dt-val";
    aSizeVal.textContent = AUDIO_GLOW_DEFAULTS.glowSize + "px";
    const aSizeLbl = document.createElement("div");
    aSizeLbl.className = "dt-label";
    aSizeLbl.innerHTML = "<span>Size</span>";
    aSizeLbl.appendChild(aSizeVal);
    aSizeGroup.appendChild(aSizeLbl);
    const aSizeSlider = document.createElement("input");
    aSizeSlider.type = "range"; aSizeSlider.min = 200; aSizeSlider.max = 1800; aSizeSlider.value = AUDIO_GLOW_DEFAULTS.glowSize;
    aSizeSlider.className = "dt-slider dt-generic";
    aSizeSlider.addEventListener("input", () => {
      const w = +aSizeSlider.value;
      const h = Math.round(w * 0.71);
      aSizeVal.textContent = w + "px";
      setAudioGlowVar("--glow-width", w + "px");
      setAudioGlowVar("--glow-height", h + "px");
    });
    aSizeGroup.appendChild(aSizeSlider);
    panel.appendChild(aSizeGroup);

    // Glow RGB group builder (sets comma-separated RGB string)
    function buildAudioGlowRgbGroup(label, cssVar, defaultRgb) {
      const group = document.createElement("div");
      group.className = "dt-group";

      let [r, g, b] = defaultRgb;
      const swatch = document.createElement("span");
      swatch.className = "dt-swatch";
      swatch.style.background = rgbToHex(r, g, b);
      const hexLabel = document.createElement("span");
      hexLabel.className = "dt-hex";
      hexLabel.textContent = rgbToHex(r, g, b);

      const lbl = document.createElement("div");
      lbl.className = "dt-label";
      lbl.innerHTML = `<span>${label}</span>`;
      lbl.appendChild(hexLabel);
      lbl.insertBefore(swatch, hexLabel);
      group.appendChild(lbl);

      function update() {
        const hex = rgbToHex(r, g, b);
        swatch.style.background = hex;
        hexLabel.textContent = hex;
        setAudioGlowVar(cssVar, `${r}, ${g}, ${b}`);
      }

      function makeSlider(channel, value, cls) {
        const s = document.createElement("input");
        s.type = "range"; s.min = 0; s.max = 255; s.value = value;
        s.className = `dt-slider ${cls}`;
        s.addEventListener("input", () => {
          if (channel === "r") r = +s.value;
          if (channel === "g") g = +s.value;
          if (channel === "b") b = +s.value;
          update();
        });
        group.appendChild(s);
        return s;
      }

      const sr = makeSlider("r", r, "dt-r");
      const sg = makeSlider("g", g, "dt-g");
      const sb = makeSlider("b", b, "dt-b");

      group._reset = (rgb) => {
        [r, g, b] = rgb;
        sr.value = r; sg.value = g; sb.value = b;
        update();
      };

      return group;
    }

    const audioGlowColorGroup = buildAudioGlowRgbGroup("Color", "--glow-color", AUDIO_GLOW_DEFAULTS.glowColor);
    panel.appendChild(audioGlowColorGroup);

    // Expose reset for audio glow controls
    var resetAudioGlow = function () {
      aOpacitySlider.value = AUDIO_GLOW_DEFAULTS.glowOpacity;
      aOpacityVal.textContent = AUDIO_GLOW_DEFAULTS.glowOpacity + "%";
      setAudioGlowVar("--glow-opacity", AUDIO_GLOW_DEFAULTS.glowOpacity / 100);

      aSizeSlider.value = AUDIO_GLOW_DEFAULTS.glowSize;
      aSizeVal.textContent = AUDIO_GLOW_DEFAULTS.glowSize + "px";
      setAudioGlowVar("--glow-width", AUDIO_GLOW_DEFAULTS.glowSize + "px");
      setAudioGlowVar("--glow-height", Math.round(AUDIO_GLOW_DEFAULTS.glowSize * 0.71) + "px");

      audioGlowColorGroup._reset(AUDIO_GLOW_DEFAULTS.glowColor);
    };
  }

  // --- Legal Hero Glow section ---
  const legalGlowEl = document.querySelector(".legal-hero-glow");

  if (legalGlowEl) {
    function setLegalGlowVar(name, value) {
      legalGlowEl.style.setProperty(name, value);
    }

    const LEGAL_GLOW_DEFAULTS = {
      glowOpacity: 55,
      glowSize: 1000,
      glowColor: [196, 197, 255],
    };

    const legalGlowSection = document.createElement("div");
    legalGlowSection.className = "dt-section";
    legalGlowSection.textContent = "Hero Glow";
    panel.appendChild(legalGlowSection);

    // Opacity slider
    const lgOpacityGroup = document.createElement("div");
    lgOpacityGroup.className = "dt-group";
    const lgOpacityVal = document.createElement("span");
    lgOpacityVal.className = "dt-val";
    lgOpacityVal.textContent = LEGAL_GLOW_DEFAULTS.glowOpacity + "%";
    const lgOpacityLbl = document.createElement("div");
    lgOpacityLbl.className = "dt-label";
    lgOpacityLbl.innerHTML = "<span>Opacity</span>";
    lgOpacityLbl.appendChild(lgOpacityVal);
    lgOpacityGroup.appendChild(lgOpacityLbl);
    const lgOpacitySlider = document.createElement("input");
    lgOpacitySlider.type = "range"; lgOpacitySlider.min = 0; lgOpacitySlider.max = 100; lgOpacitySlider.value = LEGAL_GLOW_DEFAULTS.glowOpacity;
    lgOpacitySlider.className = "dt-slider dt-generic";
    lgOpacitySlider.addEventListener("input", () => {
      const v = +lgOpacitySlider.value;
      lgOpacityVal.textContent = v + "%";
      setLegalGlowVar("--glow-opacity", v / 100);
    });
    lgOpacityGroup.appendChild(lgOpacitySlider);
    panel.appendChild(lgOpacityGroup);

    // Size slider
    const lgSizeGroup = document.createElement("div");
    lgSizeGroup.className = "dt-group";
    const lgSizeVal = document.createElement("span");
    lgSizeVal.className = "dt-val";
    lgSizeVal.textContent = LEGAL_GLOW_DEFAULTS.glowSize + "px";
    const lgSizeLbl = document.createElement("div");
    lgSizeLbl.className = "dt-label";
    lgSizeLbl.innerHTML = "<span>Size</span>";
    lgSizeLbl.appendChild(lgSizeVal);
    lgSizeGroup.appendChild(lgSizeLbl);
    const lgSizeSlider = document.createElement("input");
    lgSizeSlider.type = "range"; lgSizeSlider.min = 200; lgSizeSlider.max = 1800; lgSizeSlider.value = LEGAL_GLOW_DEFAULTS.glowSize;
    lgSizeSlider.className = "dt-slider dt-generic";
    lgSizeSlider.addEventListener("input", () => {
      const w = +lgSizeSlider.value;
      const h = Math.round(w * 0.71);
      lgSizeVal.textContent = w + "px";
      setLegalGlowVar("--glow-width", w + "px");
      setLegalGlowVar("--glow-height", h + "px");
    });
    lgSizeGroup.appendChild(lgSizeSlider);
    panel.appendChild(lgSizeGroup);

    // Glow color RGB
    function buildLegalGlowRgbGroup(label, cssVar, defaultRgb) {
      const group = document.createElement("div");
      group.className = "dt-group";

      let [r, g, b] = defaultRgb;
      const swatch = document.createElement("span");
      swatch.className = "dt-swatch";
      swatch.style.background = rgbToHex(r, g, b);
      const hexLabel = document.createElement("span");
      hexLabel.className = "dt-hex";
      hexLabel.textContent = rgbToHex(r, g, b);

      const lbl = document.createElement("div");
      lbl.className = "dt-label";
      lbl.innerHTML = `<span>${label}</span>`;
      lbl.appendChild(hexLabel);
      lbl.insertBefore(swatch, hexLabel);
      group.appendChild(lbl);

      function update() {
        const hex = rgbToHex(r, g, b);
        swatch.style.background = hex;
        hexLabel.textContent = hex;
        setLegalGlowVar(cssVar, `${r}, ${g}, ${b}`);
      }

      function makeSlider(channel, value, cls) {
        const s = document.createElement("input");
        s.type = "range"; s.min = 0; s.max = 255; s.value = value;
        s.className = `dt-slider ${cls}`;
        s.addEventListener("input", () => {
          if (channel === "r") r = +s.value;
          if (channel === "g") g = +s.value;
          if (channel === "b") b = +s.value;
          update();
        });
        group.appendChild(s);
        return s;
      }

      const sr = makeSlider("r", r, "dt-r");
      const sg = makeSlider("g", g, "dt-g");
      const sb = makeSlider("b", b, "dt-b");

      group._reset = (rgb) => {
        [r, g, b] = rgb;
        sr.value = r; sg.value = g; sb.value = b;
        update();
      };

      return group;
    }

    const legalGlowColorGroup = buildLegalGlowRgbGroup("Color", "--glow-color", LEGAL_GLOW_DEFAULTS.glowColor);
    panel.appendChild(legalGlowColorGroup);

    // Expose reset for legal glow controls
    var resetLegalGlow = function () {
      lgOpacitySlider.value = LEGAL_GLOW_DEFAULTS.glowOpacity;
      lgOpacityVal.textContent = LEGAL_GLOW_DEFAULTS.glowOpacity + "%";
      setLegalGlowVar("--glow-opacity", LEGAL_GLOW_DEFAULTS.glowOpacity / 100);

      lgSizeSlider.value = LEGAL_GLOW_DEFAULTS.glowSize;
      lgSizeVal.textContent = LEGAL_GLOW_DEFAULTS.glowSize + "px";
      setLegalGlowVar("--glow-width", LEGAL_GLOW_DEFAULTS.glowSize + "px");
      setLegalGlowVar("--glow-height", Math.round(LEGAL_GLOW_DEFAULTS.glowSize * 0.71) + "px");

      legalGlowColorGroup._reset(LEGAL_GLOW_DEFAULTS.glowColor);
    };
  }

  // --- Logo Test Glow section ---
  const logoGlowEl = document.querySelector(".logo-page-glow");

  if (logoGlowEl) {
    function setLogoGlowVar(name, value) {
      logoGlowEl.style.setProperty(name, value);
    }

    const LOGO_GLOW_DEFAULTS = {
      glowOpacity: 75,
      glowSize: 1400,
      glowColor: [196, 197, 255],
      glowBlur: 80,
    };

    const logoGlowSection = document.createElement("div");
    logoGlowSection.className = "dt-section";
    logoGlowSection.textContent = "Nebula";
    panel.appendChild(logoGlowSection);

    // Opacity slider
    const lOpacityGroup = document.createElement("div");
    lOpacityGroup.className = "dt-group";
    const lOpacityVal = document.createElement("span");
    lOpacityVal.className = "dt-val";
    lOpacityVal.textContent = LOGO_GLOW_DEFAULTS.glowOpacity + "%";
    const lOpacityLbl = document.createElement("div");
    lOpacityLbl.className = "dt-label";
    lOpacityLbl.innerHTML = "<span>Opacity</span>";
    lOpacityLbl.appendChild(lOpacityVal);
    lOpacityGroup.appendChild(lOpacityLbl);
    const lOpacitySlider = document.createElement("input");
    lOpacitySlider.type = "range"; lOpacitySlider.min = 0; lOpacitySlider.max = 100; lOpacitySlider.value = LOGO_GLOW_DEFAULTS.glowOpacity;
    lOpacitySlider.className = "dt-slider dt-generic";
    lOpacitySlider.addEventListener("input", () => {
      const v = +lOpacitySlider.value;
      lOpacityVal.textContent = v + "%";
      setLogoGlowVar("--glow-opacity", v / 100);
    });
    lOpacityGroup.appendChild(lOpacitySlider);
    panel.appendChild(lOpacityGroup);

    // Size slider
    const lSizeGroup = document.createElement("div");
    lSizeGroup.className = "dt-group";
    const lSizeVal = document.createElement("span");
    lSizeVal.className = "dt-val";
    lSizeVal.textContent = LOGO_GLOW_DEFAULTS.glowSize + "px";
    const lSizeLbl = document.createElement("div");
    lSizeLbl.className = "dt-label";
    lSizeLbl.innerHTML = "<span>Size</span>";
    lSizeLbl.appendChild(lSizeVal);
    lSizeGroup.appendChild(lSizeLbl);
    const lSizeSlider = document.createElement("input");
    lSizeSlider.type = "range"; lSizeSlider.min = 200; lSizeSlider.max = 2400; lSizeSlider.value = LOGO_GLOW_DEFAULTS.glowSize;
    lSizeSlider.className = "dt-slider dt-generic";
    lSizeSlider.addEventListener("input", () => {
      const w = +lSizeSlider.value;
      const h = Math.round(w * 0.71);
      lSizeVal.textContent = w + "px";
      setLogoGlowVar("--glow-width", w + "px");
      setLogoGlowVar("--glow-height", h + "px");
    });
    lSizeGroup.appendChild(lSizeSlider);
    panel.appendChild(lSizeGroup);

    // Blur slider
    const lBlurGroup = document.createElement("div");
    lBlurGroup.className = "dt-group";
    const lBlurVal = document.createElement("span");
    lBlurVal.className = "dt-val";
    lBlurVal.textContent = LOGO_GLOW_DEFAULTS.glowBlur + "px";
    const lBlurLbl = document.createElement("div");
    lBlurLbl.className = "dt-label";
    lBlurLbl.innerHTML = "<span>Blur</span>";
    lBlurLbl.appendChild(lBlurVal);
    lBlurGroup.appendChild(lBlurLbl);
    const lBlurSlider = document.createElement("input");
    lBlurSlider.type = "range"; lBlurSlider.min = 0; lBlurSlider.max = 200; lBlurSlider.value = LOGO_GLOW_DEFAULTS.glowBlur;
    lBlurSlider.className = "dt-slider dt-generic";
    lBlurSlider.addEventListener("input", () => {
      const v = +lBlurSlider.value;
      lBlurVal.textContent = v + "px";
      logoGlowEl.style.filter = `blur(${v}px)`;
    });
    lBlurGroup.appendChild(lBlurSlider);
    panel.appendChild(lBlurGroup);

    // Glow color RGB
    function buildLogoGlowRgbGroup(label, cssVar, defaultRgb) {
      const group = document.createElement("div");
      group.className = "dt-group";

      let [r, g, b] = defaultRgb;
      const swatch = document.createElement("span");
      swatch.className = "dt-swatch";
      swatch.style.background = rgbToHex(r, g, b);
      const hexLabel = document.createElement("span");
      hexLabel.className = "dt-hex";
      hexLabel.textContent = rgbToHex(r, g, b);

      const lbl = document.createElement("div");
      lbl.className = "dt-label";
      lbl.innerHTML = `<span>${label}</span>`;
      lbl.appendChild(hexLabel);
      lbl.insertBefore(swatch, hexLabel);
      group.appendChild(lbl);

      function update() {
        const hex = rgbToHex(r, g, b);
        swatch.style.background = hex;
        hexLabel.textContent = hex;
        setLogoGlowVar(cssVar, `${r}, ${g}, ${b}`);
      }

      function makeSlider(channel, value, cls) {
        const s = document.createElement("input");
        s.type = "range"; s.min = 0; s.max = 255; s.value = value;
        s.className = `dt-slider ${cls}`;
        s.addEventListener("input", () => {
          if (channel === "r") r = +s.value;
          if (channel === "g") g = +s.value;
          if (channel === "b") b = +s.value;
          update();
        });
        group.appendChild(s);
        return s;
      }

      const sr = makeSlider("r", r, "dt-r");
      const sg = makeSlider("g", g, "dt-g");
      const sb = makeSlider("b", b, "dt-b");

      group._reset = (rgb) => {
        [r, g, b] = rgb;
        sr.value = r; sg.value = g; sb.value = b;
        update();
      };

      return group;
    }

    const logoGlowColorGroup = buildLogoGlowRgbGroup("Color", "--glow-color", LOGO_GLOW_DEFAULTS.glowColor);
    panel.appendChild(logoGlowColorGroup);

    var resetLogoGlow = function () {
      lOpacitySlider.value = LOGO_GLOW_DEFAULTS.glowOpacity;
      lOpacityVal.textContent = LOGO_GLOW_DEFAULTS.glowOpacity + "%";
      setLogoGlowVar("--glow-opacity", LOGO_GLOW_DEFAULTS.glowOpacity / 100);

      lSizeSlider.value = LOGO_GLOW_DEFAULTS.glowSize;
      lSizeVal.textContent = LOGO_GLOW_DEFAULTS.glowSize + "px";
      setLogoGlowVar("--glow-width", LOGO_GLOW_DEFAULTS.glowSize + "px");
      setLogoGlowVar("--glow-height", Math.round(LOGO_GLOW_DEFAULTS.glowSize * 0.71) + "px");

      lBlurSlider.value = LOGO_GLOW_DEFAULTS.glowBlur;
      lBlurVal.textContent = LOGO_GLOW_DEFAULTS.glowBlur + "px";
      logoGlowEl.style.filter = `blur(${LOGO_GLOW_DEFAULTS.glowBlur}px)`;

      logoGlowColorGroup._reset(LOGO_GLOW_DEFAULTS.glowColor);
    };
  }

  // --- Alignment Guides ---
  // Vertical guides
  const guideV1 = document.createElement("div");
  guideV1.className = "dt-guide-v";
  guideV1.innerHTML = '<span class="dt-guide-label">V1: 400px</span>';
  guideV1.style.left = "400px";
  document.body.appendChild(guideV1);

  const guideV2 = document.createElement("div");
  guideV2.className = "dt-guide-v";
  guideV2.innerHTML = '<span class="dt-guide-label">V2: 600px</span>';
  guideV2.style.left = "600px";
  document.body.appendChild(guideV2);

  const guideV3 = document.createElement("div");
  guideV3.className = "dt-guide-v";
  guideV3.innerHTML = '<span class="dt-guide-label">V3: 800px</span>';
  guideV3.style.left = "800px";
  document.body.appendChild(guideV3);

  // Horizontal guides
  const guideH1 = document.createElement("div");
  guideH1.className = "dt-guide-h";
  guideH1.innerHTML = '<span class="dt-guide-label">H1: 200px</span>';
  guideH1.style.top = "200px";
  document.body.appendChild(guideH1);

  const guideH2 = document.createElement("div");
  guideH2.className = "dt-guide-h";
  guideH2.innerHTML = '<span class="dt-guide-label">H2: 400px</span>';
  guideH2.style.top = "400px";
  document.body.appendChild(guideH2);

  const guideH3 = document.createElement("div");
  guideH3.className = "dt-guide-h";
  guideH3.innerHTML = '<span class="dt-guide-label">H3: 600px</span>';
  guideH3.style.top = "600px";
  document.body.appendChild(guideH3);

  function makeVGuideDraggable(el, name) {
    let dragging = false;
    el.addEventListener("mousedown", (e) => { e.preventDefault(); dragging = true; });
    document.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      const x = Math.max(0, Math.min(e.clientX, window.innerWidth));
      el.style.left = x + "px";
      el.querySelector(".dt-guide-label").textContent = `${name}: ${x}px`;
    });
    document.addEventListener("mouseup", () => { dragging = false; });
  }

  function makeHGuideDraggable(el, name) {
    let dragging = false;
    el.addEventListener("mousedown", (e) => { e.preventDefault(); dragging = true; });
    document.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      const y = Math.max(0, Math.min(e.clientY, window.innerHeight));
      el.style.top = y + "px";
      el.querySelector(".dt-guide-label").textContent = `${name}: ${y}px`;
    });
    document.addEventListener("mouseup", () => { dragging = false; });
  }

  makeVGuideDraggable(guideV1, "V1");
  makeVGuideDraggable(guideV2, "V2");
  makeVGuideDraggable(guideV3, "V3");
  makeHGuideDraggable(guideH1, "H1");
  makeHGuideDraggable(guideH2, "H2");
  makeHGuideDraggable(guideH3, "H3");

  const guidesSection = document.createElement("div");
  guidesSection.className = "dt-section";
  guidesSection.textContent = "Alignment Guides";
  panel.appendChild(guidesSection);

  // Vertical toggle
  const vToggleRow = document.createElement("div");
  vToggleRow.className = "dt-toggle-row";
  const vToggleLabel = document.createElement("span");
  vToggleLabel.className = "dt-toggle-label";
  vToggleLabel.textContent = "Vertical lines";
  const vToggleBtn = document.createElement("button");
  vToggleBtn.className = "dt-toggle";
  vToggleBtn.addEventListener("click", () => {
    const on = vToggleBtn.classList.toggle("dt-on");
    guideV1.classList.toggle("dt-guide-visible", on);
    guideV2.classList.toggle("dt-guide-visible", on);
    guideV3.classList.toggle("dt-guide-visible", on);
  });
  vToggleRow.appendChild(vToggleLabel);
  vToggleRow.appendChild(vToggleBtn);
  panel.appendChild(vToggleRow);

  // Horizontal toggle
  const hToggleRow = document.createElement("div");
  hToggleRow.className = "dt-toggle-row";
  const hToggleLabel = document.createElement("span");
  hToggleLabel.className = "dt-toggle-label";
  hToggleLabel.textContent = "Horizontal lines";
  const hToggleBtn = document.createElement("button");
  hToggleBtn.className = "dt-toggle";
  hToggleBtn.addEventListener("click", () => {
    const on = hToggleBtn.classList.toggle("dt-on");
    guideH1.classList.toggle("dt-guide-visible", on);
    guideH2.classList.toggle("dt-guide-visible", on);
    guideH3.classList.toggle("dt-guide-visible", on);
  });
  hToggleRow.appendChild(hToggleLabel);
  hToggleRow.appendChild(hToggleBtn);
  panel.appendChild(hToggleRow);

  // Reset button
  const resetWrap = document.createElement("div");
  resetWrap.className = "dt-presets";
  const btnReset = document.createElement("button");
  btnReset.className = "dt-btn dt-btn-reset";
  btnReset.textContent = "Reset All";
  resetWrap.appendChild(btnReset);
  panel.appendChild(resetWrap);

  // --- Event handlers ---
  btnGold.addEventListener("click", () => {
    accentGroup._setHex(PRESETS.gold);
    showToast("Accent → Gold");
  });

  btnPurple.addEventListener("click", () => {
    accentGroup._setHex(PRESETS.purple);
    showToast("Accent → Purple");
  });

  btnSun.addEventListener("click", () => {
    accentGroup._setHex(PRESETS.sun);
    showToast("Accent → Sun");
  });

  btnNebula.addEventListener("click", () => {
    accentGroup._setHex(PRESETS.nebula);
    showToast("Accent → Nebula");
  });

  btnReset.addEventListener("click", () => {
    accentGroup._setHex(DEFAULTS.accent);
    bgGroup._setHex(DEFAULTS.bg);
    cardGroup._setHex(DEFAULTS.bgCard);
    cloudCardGroup._setHex(DEFAULTS.cloudCard);
    cloudCtaGroup._setHex(DEFAULTS.cloudCta);
    if (typeof resetGlow === "function") resetGlow();
    if (typeof resetNotesCards === "function") resetNotesCards();
    if (typeof resetNotesGlow === "function") resetNotesGlow();
    if (typeof resetAudioGlow === "function") resetAudioGlow();
    if (typeof resetLegalGlow === "function") resetLegalGlow();
    if (typeof resetLogoGlow === "function") resetLogoGlow();
    showToast("Reset to defaults");
  });
})();
