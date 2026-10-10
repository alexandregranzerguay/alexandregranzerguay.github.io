"""Contour header: level sets of a smoothed sparse risk-parity objective, plus one
gradient-descent path per page. Everything is computed at build time and inlined
as SVG; the browser runs no code.

The landscape is a three-asset portfolio x = (a, b, 1 - a - b). The objective is
the squared deviation of relative risk contributions from equal risk, plus a
smoothed cardinality penalty sum_i (1 - exp(-x_i^2 / eps)) that creates the
sparse basins which make the problem non-convex.
"""

from __future__ import annotations

from functools import lru_cache

import numpy as np
from contourpy import contour_generator

W, H = 1000, 170  # SVG viewBox; the band is ~6:1

VOL = np.array([0.06, 0.16, 0.22])
CORR = np.array([[1.0, 0.2, 0.1], [0.2, 1.0, 0.7], [0.1, 0.7, 1.0]])
SIGMA = CORR * np.outer(VOL, VOL)
LAM, EPS = 0.12, 0.012

A_RANGE = (-0.35, 1.35)  # horizontal axis: weight of asset 1
B_RANGE = (-0.12, 0.70)  # vertical axis: weight of asset 2


def objective(a: np.ndarray, b: np.ndarray) -> np.ndarray:
    x = np.stack([a, b, 1.0 - a - b])  # (3, ...)
    sx = np.einsum("ij,j...->i...", SIGMA, x)
    var = np.einsum("i...,i...->...", x, sx)
    rc = x * sx / var
    rp = ((rc - 1.0 / 3.0) ** 2).sum(axis=0)
    card = (1.0 - np.exp(-(x**2) / EPS)).sum(axis=0)
    return np.log1p(rp + LAM * card)


def to_px(a: np.ndarray, b: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    px = (a - A_RANGE[0]) / (A_RANGE[1] - A_RANGE[0]) * W
    py = (B_RANGE[1] - b) / (B_RANGE[1] - B_RANGE[0]) * H
    return px, py


def from_px(px: float, py: float) -> tuple[float, float]:
    a = A_RANGE[0] + px / W * (A_RANGE[1] - A_RANGE[0])
    b = B_RANGE[1] - py / H * (B_RANGE[1] - B_RANGE[0])
    return a, b


def _rdp(pts: np.ndarray, tol: float) -> np.ndarray:
    """Ramer-Douglas-Peucker simplification."""
    if len(pts) < 3:
        return pts
    start, end = pts[0], pts[-1]
    seg = end - start
    norm = np.hypot(*seg)
    if norm == 0:
        d = np.hypot(*(pts - start).T)
    else:
        d = np.abs(seg[0] * (pts[:, 1] - start[1]) - seg[1] * (pts[:, 0] - start[0])) / norm
    i = int(np.argmax(d))
    if d[i] > tol:
        return np.vstack([_rdp(pts[: i + 1], tol)[:-1], _rdp(pts[i:], tol)])
    return np.vstack([start, end])


def _path(pts: np.ndarray) -> str:
    pts = np.round(pts).astype(int)
    keep = np.ones(len(pts), bool)
    keep[1:] = np.any(pts[1:] != pts[:-1], axis=1)
    pts = pts[keep]
    if len(pts) < 2:
        return ""
    return "M" + " ".join(f"{x},{y}" for x, y in pts)


@lru_cache(maxsize=1)
def contour_paths(levels: int = 15, tol: float = 0.9) -> str:
    nx, ny = 420, 90
    a = np.linspace(*A_RANGE, nx)
    b = np.linspace(*B_RANGE, ny)
    aa, bb = np.meshgrid(a, b)
    z = objective(aa, bb)
    px, py = to_px(aa, bb)
    gen = contour_generator(px, py, z)
    lo, hi = np.quantile(z, [0.02, 0.97])
    out = []
    for lvl in np.linspace(lo, hi, levels):
        for line in gen.lines(lvl):
            simplified = _rdp(np.asarray(line), tol)
            p = _path(simplified)
            if p:
                out.append(p)
    return "".join(out)


def _grad(a: float, b: float, h: float = 1e-5) -> tuple[float, float]:
    f = lambda u, v: float(objective(np.array(u), np.array(v)))
    return (f(a + h, b) - f(a - h, b)) / (2 * h), (f(a, b + h) - f(a, b - h)) / (2 * h)


def descent(start_px: tuple[float, float], steps: int = 600, lr: float = 0.004, beta: float = 0.85,
            diverge: bool = False) -> list[tuple[float, float]]:
    """Heavy-ball gradient descent in weight space; returns pixel coordinates."""
    a, b = from_px(*start_px)
    va = vb = 0.0
    pts = []
    for _ in range(steps):
        ga, gb = _grad(a, b)
        if diverge:
            ga, gb = -ga * 6, -gb * 6
        va, vb = beta * va - lr * ga, beta * vb - lr * gb
        a, b = a + va, b + vb
        px, py = to_px(np.array(a), np.array(b))
        pts.append((float(px), float(py)))
        if diverge and not (-50 < px < W + 50 and -50 < py < H + 50):
            break
        if not diverge and np.hypot(va, vb) < 1e-6:
            break
    return [start_px] + pts


def header_svg(start_px: tuple[float, float], diverge: bool = False, label: str = "") -> str:
    pts = descent(start_px, diverge=diverge)
    # thin the iterates so the dots read as a dotted line
    dots, last = [], None
    for x, y in pts:
        if last is None or np.hypot(x - last[0], y - last[1]) > 9:
            dots.append((x, y))
            last = (x, y)
    dot_svg = "".join(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="2"/>' for x, y in dots[:-1])
    end = pts[-1]
    end_svg = "" if diverge else f'<circle class="min" cx="{end[0]:.0f}" cy="{end[1]:.0f}" r="5"/>'
    return (
        f'<svg class="landscape" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice" '
        f'role="img" aria-label="{label}">'
        f'<path class="lvl" d="{contour_paths()}"/>'
        f'<g class="path">{dot_svg}{end_svg}</g></svg>'
    )


# Start points (pixels) per page. Each lands in a different basin; home finds the global minimum.
STARTS = {
    "home": (315, 160),      # -> global minimum
    "research": (40, 160),   # -> left basin
    "projects": (990, 10),   # -> upper-right basin
    "notes": (415, 10),      # -> global minimum, from above
    "cv": (65, 130),         # -> left basin, from below
    "404": (500, 85),        # ascent; leaves the plot
}


if __name__ == "__main__":
    import sys

    key = sys.argv[1] if len(sys.argv) > 1 else "home"
    svg = header_svg(STARTS.get(key, STARTS["home"]), diverge=key == "404")
    style = "<style>.lvl{fill:none;stroke:#999;stroke-width:1}.path{fill:#222}.min{fill:#000}</style>"
    sys.stdout.write(svg.replace("<path", style + "<path", 1).replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ', 1))
