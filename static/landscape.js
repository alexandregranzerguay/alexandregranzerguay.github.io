// Header landscape: click anywhere to run heavy-ball gradient descent to a local minimum.
// Mirrors scripts/contours.py exactly (same objective, axis ranges and step rule).
(() => {
  const svg = document.querySelector(".landscape");
  if (!svg) return;
  const hint = document.querySelector(".landscape-hint");
  if (hint) hint.hidden = false;
  svg.classList.add("interactive");

  const NS = "http://www.w3.org/2000/svg";
  const W = 1000, H = 170, A0 = -0.35, A1 = 1.35, B0 = -0.12, B1 = 0.7, LAM = 0.12, EPS = 0.012;
  const VOL = [0.06, 0.16, 0.22];
  const CORR = [[1, 0.2, 0.1], [0.2, 1, 0.7], [0.1, 0.7, 1]];
  const S = CORR.map((row, i) => row.map((c, j) => c * VOL[i] * VOL[j]));

  // Smoothed sparse risk-parity objective over x = (a, b, 1 - a - b).
  const f = (a, b) => {
    const x = [a, b, 1 - a - b];
    const sx = S.map((r) => r[0] * x[0] + r[1] * x[1] + r[2] * x[2]);
    const v = x[0] * sx[0] + x[1] * sx[1] + x[2] * sx[2];
    let rp = 0, card = 0;
    for (let i = 0; i < 3; i++) {
      rp += (x[i] * sx[i] / v - 1 / 3) ** 2;
      card += 1 - Math.exp(-(x[i] * x[i]) / EPS);
    }
    return Math.log1p(rp + LAM * card);
  };
  const toPx = (a, b) => [((a - A0) / (A1 - A0)) * W, ((B1 - b) / (B1 - B0)) * H];
  const fromPx = (x, y) => [A0 + (x / W) * (A1 - A0), B1 - (y / H) * (B1 - B0)];

  const descend = (x0, y0) => {
    let [a, b] = fromPx(x0, y0), va = 0, vb = 0;
    const h = 1e-5, pts = [[x0, y0]];
    for (let k = 0; k < 600; k++) {
      const ga = (f(a + h, b) - f(a - h, b)) / (2 * h);
      const gb = (f(a, b + h) - f(a, b - h)) / (2 * h);
      va = 0.85 * va - 0.004 * ga;
      vb = 0.85 * vb - 0.004 * gb;
      a += va;
      b += vb;
      pts.push(toPx(a, b));
      if (Math.hypot(va, vb) < 1e-6) break;
    }
    return pts;
  };

  const group = svg.querySelector(".path");
  const dot = (q, r, cls) => {
    const c = document.createElementNS(NS, "circle");
    c.setAttribute("cx", q[0].toFixed(0));
    c.setAttribute("cy", q[1].toFixed(0));
    c.setAttribute("r", r);
    if (cls) c.setAttribute("class", cls);
    group.appendChild(c);
  };

  let timer;
  svg.addEventListener("click", (e) => {
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM().inverse());
    const pts = descend(p.x, p.y);
    const dots = [];
    let last;
    for (const q of pts) {
      if (!last || Math.hypot(q[0] - last[0], q[1] - last[1]) > 9) {
        dots.push(q);
        last = q;
      }
    }
    const end = pts[pts.length - 1];
    clearInterval(timer);
    group.textContent = "";
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dots.forEach((q) => dot(q, 2));
      dot(end, 5, "min");
      return;
    }
    let i = 0;
    timer = setInterval(() => {
      if (i < dots.length) dot(dots[i++], 2);
      else {
        clearInterval(timer);
        dot(end, 5, "min");
      }
    }, 28);
  });
})();
