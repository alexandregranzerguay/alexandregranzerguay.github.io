---
title: Sparsity breaks the efficient frontier
date: 2026-10-09
summary: A cardinality constraint barely moves the mean-variance frontier, but it makes the optimal holdings jump. Eight asset classes, every support enumerated.
tags: [portfolio optimization, mixed-integer programming, cardinality constraints]
script: figure.js
draft: false
---

Long-only mean-variance optimization is a convex quadratic program:

$$\min_{w}\; w^\top \Sigma w \quad \text{s.t.} \quad \mu^\top w = r,\quad \mathbf{1}^\top w = 1,\quad w \ge 0.$$

Add one practical requirement, that the portfolio holds at most $K$ assets,

$$\|w\|_0 \le K,$$

and the feasible set becomes a union of $\binom{n}{K}$ faces of the simplex. It is no longer convex, and neither is the problem.

## What the figure shows

Eight asset classes with illustrative long-run assumptions (table below). For each $K$ the frontier is exact. Every support of size $K$ is solved as its own QP, and at each target return the lowest-variance support wins. With $n = 8$ that is at most $\binom{8}{4} = 70$ QPs per point, which is why exhaustive search works here.

<figure id="frontier-fig" data-src="/notes/sparse-frontier/frontier.json">
<noscript><p>This figure needs JavaScript. The data is in <a href="/notes/sparse-frontier/frontier.json">frontier.json</a>.</p></noscript>
</figure>

Two things stand out.

**The frontier barely moves.** At a 6% target, the best three-asset portfolio has 8.85% volatility, against 8.80% for the unconstrained one. Even two assets cost only about 0.6 points of volatility. Judged by the curve alone, sparsity looks almost free.

**The holdings jump.** The bottom panel shows which assets the optimal portfolio holds at each target return. With $K = 3$ the support changes ten times between 4% and 8.5%. Between a 5.6% and a 5.7% target, government bonds are swapped out for investment-grade credit in a single step. The unconstrained portfolio moves weight continuously. The sparse one cannot, so a small change in the target, or in an estimate of $\mu$ or $\Sigma$, can force a complete trade. Each switch is a kink in the frontier, where two subset frontiers cross.

That is what non-convexity means to a portfolio manager: the optimal portfolio is not a continuous function of the inputs. What sparsity costs is turnover, not risk.

## Solving it at scale

Enumeration stops working quickly. With 500 assets and $K = 30$ there are about $10^{48}$ supports. The standard formulation adds binary variables $z_i$,

$$w_i \le z_i, \qquad \sum_i z_i \le K, \qquad z \in \{0, 1\}^n,$$

which gives a mixed-integer QP that branch-and-bound solves exactly for moderate universes (Bienstock, 1996; Bertsimas and Shioda, 2009). Perspective reformulations tighten its continuous relaxation considerably (Frangioni and Gentile, 2006). Larger instances fall to heuristics, from the early metaheuristics of Chang et al. (2000), who showed that the cardinality-constrained frontier can be discontinuous, to ADMM methods that alternate a convex step with a projection onto the sparse set (Takapoui et al., 2020).

## Assumptions

| Asset class | Expected return | Volatility |
|---|---|---|
| Government bonds | 4.0% | 5.0% |
| Investment-grade credit | 4.8% | 6.5% |
| High yield | 6.0% | 9.5% |
| US equity | 7.0% | 16.0% |
| International equity | 7.3% | 17.0% |
| Emerging-market equity | 8.5% | 22.0% |
| Real estate | 7.0% | 19.0% |
| Commodities | 5.0% | 18.0% |

These are illustrative long-run assumptions, not a forecast. Correlations and the code that produced the figure are in [`scripts/frontier.py`](https://github.com/alexandregranzerguay/alexandregranzerguay.github.io/blob/main/scripts/frontier.py).

## References

- Bertsimas, D. and Shioda, R. (2009). Algorithm for cardinality-constrained quadratic optimization. *Computational Optimization and Applications*, 43(1), 1–22.
- Bienstock, D. (1996). Computational study of a family of mixed-integer quadratic programming problems. *Mathematical Programming*, 74(2), 121–140.
- Chang, T.-J., Meade, N., Beasley, J. E. and Sharaiha, Y. M. (2000). Heuristics for cardinality constrained portfolio optimisation. *Computers & Operations Research*, 27(13), 1271–1302.
- Frangioni, A. and Gentile, C. (2006). Perspective cuts for a class of convex 0–1 mixed integer programs. *Mathematical Programming*, 106(2), 225–236.
- Takapoui, R., Moehle, N., Boyd, S. and Bemporad, A. (2020). A simple effective heuristic for embedded mixed-integer quadratic programming. *International Journal of Control*, 93(1), 2–12.
