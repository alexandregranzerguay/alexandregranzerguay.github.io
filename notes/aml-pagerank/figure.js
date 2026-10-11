// Interactive figure for /notes/aml-pagerank/. One neighbourhood of the competition graph; ranks are
// global (all 300,008 customers) at successive steps of the walk, exported by scripts/aml_demo.py.
(() => {
  const fig = document.getElementById("aml-fig");
  if (!fig) return;
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs = {}, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    if (parent) parent.appendChild(e);
    return e;
  };
  const fmt = (x) => x.toLocaleString("en-US");

  fetch(fig.dataset.src).then((r) => r.json()).then((d) => {
    const N = d.n_customers, last = d.steps.length - 1, TOP = 1000;
    fig.textContent = "";
    const controls = document.createElement("p");
    controls.className = "fig-controls";
    controls.innerHTML = '<label for="aml-k">Ranking iterations: <output id="aml-kout">0</output></label>' +
      `<input id="aml-k" type="range" min="0" max="${last}" step="1" value="0">`;
    fig.appendChild(controls);

    const W = 640, H = 400, M = 22;
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, class: "fig aml", role: "img",
      "aria-label": "Neighbourhood of a customer in the competition graph; node size shows global suspicion rank" }, fig);
    const X = (v) => M + v * (W - 2 * M), Y = (v) => M + v * (H - 2 * M);
    const gE = el("g", {}, svg), gN = el("g", {}, svg);
    for (const [s, t, w] of d.edges) {
      const a = d.nodes[s], c = d.nodes[t];
      el("line", { x1: X(a.x), y1: Y(a.y), x2: X(c.x), y2: Y(c.y), class: w >= 1 ? "edge sus" : "edge",
        "stroke-width": (0.7 + 1.2 * Math.log1p(w)).toFixed(2) }, gE);
    }
    const dots = d.nodes.map((x, i) => {
      if (x.beta > 0) el("circle", { cx: X(x.x), cy: Y(x.y), r: 14, class: "ring flag" }, gN);
      const c = el("circle", { cx: X(x.x), cy: Y(x.y), r: 4, class: "node" }, gN);
      c.addEventListener("click", () => select(i));
      return c;
    });
    const center = d.nodes[d.center];
    el("text", { x: X(center.x), y: Y(center.y) - 20, "text-anchor": "middle", class: "label" }, svg).textContent = "no red flags";

    const caption = document.createElement("figcaption");
    const detail = document.createElement("p");
    detail.className = "meta";
    detail.textContent = "Rings mark customers with a positive customer score. Click a customer to inspect its score and rank.";
    fig.append(caption, detail);

    const kIn = document.getElementById("aml-k");
    let chosen = null;
    const rankText = (r, k) => k === 0 && r === d.n_flagged + 1
      ? `is tied at ${fmt(r)} with the ${fmt(N - d.n_flagged - 1)} other customers who have no red flags`
      : `is ranked ${fmt(r)} of ${fmt(N)}`;
    const select = (i) => {
      chosen = i;
      const x = d.nodes[i], k = +kIn.value;
      detail.textContent = `${x.flags.length ? "Customer indicators: " + x.flags.join(", ") : "Customer score is zero"}. ` +
        `Own score ${x.beta.toFixed(2)}, total edge weight ${x.strength.toFixed(2)}, γ = ${x.gamma.toFixed(2)}. ` +
        `At step ${d.steps[k]} it ${rankText(x.rank[k], k)}.`;
    };
    const draw = () => {
      const k = +kIn.value;
      let inTop = 0;
      d.nodes.forEach((x, i) => {
        const r = x.rank[k];
        const size = 1 - Math.log(r) / Math.log(N);
        dots[i].setAttribute("r", (2.5 + 11 * size * size).toFixed(1));
        dots[i].setAttribute("class", r <= TOP ? "node top" : "node");
        if (r <= TOP) inTop++;
      });
      document.getElementById("aml-kout").textContent = d.steps[k];
      caption.textContent = `Step ${d.steps[k]}: the customer at the centre ${rankText(center.rank[k], k)}. ` +
        `Customers shown in the global top ${fmt(TOP)} (filled): ${inTop} of ${d.nodes.length}.`;
      if (chosen !== null) select(chosen);
    };
    kIn.addEventListener("input", draw);
    draw();
  });
})();
