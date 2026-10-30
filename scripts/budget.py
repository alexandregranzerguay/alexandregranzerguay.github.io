"""CI check: every page must satisfy its weight, request and script constraints, and the
CV must be at most three pages. A violation prints the binding constraints and
exits 1 ("infeasible").

Usage: python scripts/budget.py [_site]
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

from measure import BUDGETS, KB, page_cost, check


def pdf_pages(path: Path) -> int:
    data = path.read_bytes()
    return len(re.findall(rb"/Type\s*/Page(?!s)", data))


def main() -> int:
    site = Path(sys.argv[1] if len(sys.argv) > 1 else "_site")
    failures = []
    for html in sorted(site.rglob("*.html")):
        rel = html.relative_to(site).as_posix()
        if rel.startswith("google") and rel.endswith(".html"):
            continue  # search-console verification file
        budget = BUDGETS["home"] if rel == "index.html" else BUDGETS["default"]
        cost = page_cost(html.read_text(), site)
        bad = check(cost, budget)
        flag = "INFEASIBLE" if bad else "ok"
        print(f"{flag:<10} {rel:<45} {cost['weight'] / KB:6.1f} KB  {cost['requests']} req  "
              f"{cost['script'] / KB:4.1f} KB js")
        failures += [f"{rel}: {b}" for b in bad]
    for pdf, limit in (("cv.pdf", (1, 3)),):
        f = site / pdf
        if f.exists():
            n = pdf_pages(f)
            ok = limit[0] <= n <= limit[1]
            print(f"{'ok' if ok else 'INFEASIBLE':<10} {pdf:<45} {n} page(s)")
            if not ok:
                failures.append(f"{pdf}: {n} pages, allowed {limit[0]}-{limit[1]}")
    if failures:
        print("\nInfeasible. Binding constraints:\n  " + "\n  ".join(failures))
        return 1
    print("\nOptimal solution found.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
