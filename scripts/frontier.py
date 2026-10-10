"""Precompute long-only, cardinality-constrained mean-variance frontiers for the note
"Sparsity breaks the efficient frontier". Run locally (needs cvxpy, see requirements-dev.txt);
the JSON output is committed, so the site build never solves anything.

For each K, the frontier is computed exactly by enumerating every support of size K
(zero weights allowed, so smaller supports are included) and keeping, at each target
return, the support with the lowest variance.

Usage: python scripts/frontier.py  ->  notes/sparse-frontier/frontier.json
"""

from __future__ import annotations

import itertools
import json
from pathlib import Path

import cvxpy as cp
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "notes" / "sparse-frontier" / "frontier.json"

# Illustrative long-run capital-market assumptions (annualized, %). Not a forecast.
ASSETS = ["Government bonds", "IG credit", "High yield", "US equity",
          "Intl. equity", "EM equity", "Real estate", "Commodities"]
MU = np.array([4.0, 4.8, 6.0, 7.0, 7.3, 8.5, 7.0, 5.0])
VOL = np.array([5.0, 6.5, 9.5, 16.0, 17.0, 22.0, 19.0, 18.0])
CORR = np.array([
    [1.00, 0.80, 0.20, -0.10, -0.10, -0.05, 0.10, -0.10],
    [0.80, 1.00, 0.55, 0.30, 0.30, 0.30, 0.35, 0.10],
    [0.20, 0.55, 1.00, 0.65, 0.65, 0.65, 0.60, 0.35],
    [-0.10, 0.30, 0.65, 1.00, 0.85, 0.75, 0.70, 0.30],
    [-0.10, 0.30, 0.65, 0.85, 1.00, 0.85, 0.65, 0.40],
    [-0.05, 0.30, 0.65, 0.75, 0.85, 1.00, 0.60, 0.45],
    [0.10, 0.35, 0.60, 0.70, 0.65, 0.60, 1.00, 0.25],
    [-0.10, 0.10, 0.35, 0.30, 0.40, 0.45, 0.25, 1.00],
])
GRID = np.round(np.arange(4.0, 8.5001, 0.1), 2)


def subset_frontier(S: tuple[int, ...], cov: np.ndarray) -> dict[float, float]:
    """Minimum volatility at each grid return for a long-only portfolio supported on S."""
    mu, L = MU[list(S)], np.linalg.cholesky(cov[np.ix_(S, S)] + 1e-10 * np.eye(len(S)))
    w, r = cp.Variable(len(S), nonneg=True), cp.Parameter()
    prob = cp.Problem(cp.Minimize(cp.sum_squares(L.T @ w)), [cp.sum(w) == 1, mu @ w == r])
    out = {}
    for target in GRID:
        if not (mu.min() - 1e-9 <= target <= mu.max() + 1e-9):
            continue
        r.value = float(target)
        prob.solve(solver=cp.CLARABEL)
        if prob.status == cp.OPTIMAL:
            out[float(target)] = float(np.sqrt(max(prob.value, 0.0)))
    return out


def main() -> None:
    cov = CORR * np.outer(VOL, VOL)
    assert np.linalg.eigvalsh(CORR).min() > 0, "correlation matrix must be positive definite"
    n = len(MU)
    frontiers = {S: subset_frontier(S, cov) for k in range(2, n + 1) for S in itertools.combinations(range(n), k)}
    data = {"assets": ASSETS, "mu": MU.tolist(), "vol": VOL.tolist(), "frontier": {}}
    for K in range(2, n + 1):
        pts = []
        for target in GRID:
            best = min(((f[float(target)], S) for S, f in frontiers.items() if len(S) == K and float(target) in f),
                       default=None)
            if best:
                vol, S = best
                pts.append([float(target), round(vol, 3), sum(1 << i for i in S)])
        data["frontier"][str(K)] = pts
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, separators=(",", ":")))
    print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size} bytes, {len(frontiers)} supports)")


if __name__ == "__main__":
    main()
