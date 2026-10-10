// Interactive figure for /notes/sparse-frontier/. Data precomputed by scripts/frontier.py.
(() => {
  const fig = document.getElementById("frontier-fig");
  if (!fig) return;
  const NS = "http://www.w3.org/2000/svg";
  const SHORT = ["Gov", "IG", "HY", "US", "Intl", "EM", "RE", "Cmdty"];
  const el = (tag, attrs = {}, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    if (parent) parent.appendChild(e);
    return e;
  };
  const W = 640, H = 290, M = { l: 44, r: 14, t: 10, b: 34 };
  const X0 = 0, X1 = 24, Y0 = 3.6, Y1 = 9;
  const sx = (v) => M.l + ((v - X0) / (X1 - X0)) * (W - M.l - M.r);
  const sy = (v) => H - M.b - ((v - Y0) / (Y1 - Y0)) * (H - M.t - M.b);

  fetch(fig.dataset.src).then((r) => r.json()).then((d) => {
    fig.textContent = "";
    const controls = document.createElement("p");
    controls.className = "fig-controls";
    controls.innerHTML = '<label for="k">Maximum number of assets, <var>K</var> = <output id="kout">3</output></label> ' +
      '<input id="k" type="range" min="2" max="8" step="1" value="3">';
    fig.appendChild(controls);

    const plot = el("svg", { viewBox: `0 0 ${W} ${H}`, class: "fig", role: "img",
      "aria-label": "Mean-variance frontier with and without a cardinality constraint" }, fig);
    const axis = el("g", { class: "axis" }, plot);
    el("path", { d: `M${M.l},${M.t}V${H - M.b}H${W - M.r}` }, axis);
    for (let x = 0; x <= 20; x += 5) {
      el("text", { x: sx(x), y: H - M.b + 16, "text-anchor": "middle" }, axis).textContent = x + "%";
    }
    for (let y = 4; y <= 9; y++) {
      el("text", { x: M.l - 6, y: sy(y) + 4, "text-anchor": "end" }, axis).textContent = y + "%";
    }
    el("text", { x: W - M.r, y: H - 4, "text-anchor": "end" }, axis).textContent = "volatility";
    el("text", { x: M.l + 4, y: M.t + 10 }, axis).textContent = "expected return";

    const line = (pts) => "M" + pts.map((p) => `${sx(p[1]).toFixed(1)},${sy(p[0]).toFixed(1)}`).join("L");
    el("path", { d: line(d.frontier["8"]), class: "full" }, plot);
    const cur = el("path", { class: "cur" }, plot);
    const kinks = el("g", { class: "kinks" }, plot);
    d.mu.forEach((m, i) => {
      const g = el("g", { class: "asset" }, plot);
      el("circle", { cx: sx(d.vol[i]), cy: sy(m), r: 3 }, g);
      el("text", { x: sx(d.vol[i]) + 6, y: sy(m) + 4 }, g).textContent = SHORT[i];
    });

    // Holdings strip: one row per asset, one column per target return, shaded by weight.
    const grid = d.frontier["8"].map((p) => p[0]);
    const SW = 640, SH = 8 * 13 + 26, sl = 44, cw = (SW - sl - 14) / grid.length;
    const strip = el("svg", { viewBox: `0 0 ${SW} ${SH}`, class: "fig strip", role: "img",
      "aria-label": "Assets held by the optimal portfolio at each target return" }, fig);
    SHORT.forEach((s, i) => {
      el("text", { x: sl - 6, y: i * 13 + 10, "text-anchor": "end", class: "axis-t" }, strip).textContent = s;
    });
    [4, 5, 6, 7, 8].forEach((r) => {
      const j = grid.findIndex((g) => Math.abs(g - r) < 1e-9);
      el("text", { x: sl + (j + 0.5) * cw, y: SH - 6, "text-anchor": "middle", class: "axis-t" }, strip).textContent = r + "%";
    });
    const cells = el("g", { class: "cells" }, strip);

    const caption = document.createElement("figcaption");
    fig.appendChild(caption);
    const binom = (n, k) => (k === 0 ? 1 : (n * binom(n - 1, k - 1)) / k);
    // One-way turnover between neighbouring targets: half the L1 change in weights.
    const steps = (pts) => pts.slice(1).map((p, j) => 0.5 * p[3].reduce((a, w, i) => a + Math.abs(w - pts[j][3][i]), 0));
    const JUMP = 0.15;
    const fullMax = Math.max(...steps(d.frontier["8"]));
    const pct = (x) => Math.round(100 * x) + "%";

    const draw = (K) => {
      const pts = d.frontier[String(K)];
      const to = steps(pts);
      cur.setAttribute("d", line(pts));
      kinks.textContent = "";
      cells.textContent = "";
      pts.forEach((p, j) => {
        if (j > 0 && to[j - 1] > JUMP) el("circle", { cx: sx(p[1]), cy: sy(p[0]), r: 2.5 }, kinks);
        const col = grid.findIndex((g) => Math.abs(g - p[0]) < 1e-9);
        p[3].forEach((w, i) => {
          if (p[2] & (1 << i)) {
            el("rect", { x: sl + col * cw + 0.5, y: i * 13 + 2, width: cw - 1, height: 10,
              style: `opacity:${(0.2 + 0.8 * w).toFixed(2)}` }, cells);
          }
        });
      });
      document.getElementById("kout").textContent = K;
      caption.textContent = K === 8
        ? `K = 8: no cardinality limit. The largest change between neighbouring targets is ${pct(fullMax)} of the portfolio.`
        : `K = ${K}: ${binom(8, K)} subsets searched at each target return. The largest change between ` +
          `neighbouring targets (0.1 points apart) is ${pct(Math.max(...to))} of the portfolio, against ` +
          `${pct(fullMax)} unconstrained. Dots mark steps above ${pct(JUMP)}; shading is weight.`;
    };
    const input = document.getElementById("k");
    input.addEventListener("input", () => draw(+input.value));
    draw(3);
  });
})();
