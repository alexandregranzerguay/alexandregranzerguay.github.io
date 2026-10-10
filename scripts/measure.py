"""Page cost model used by budget.py (CI check).

weight   = HTML bytes + every local asset the page loads (scripts, icons, images, data)
requests = 1 (the HTML) + number of those assets
script   = executable JavaScript bytes, inline or external (JSON-LD is data, not script)
"""

from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path

KB = 1024

BUDGETS = {
    "home": {"weight": 50 * KB, "requests": 4, "script": 4 * KB},
    "default": {"weight": 80 * KB, "requests": 6, "script": 12 * KB},
}


class _Assets(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.assets: list[str] = []
        self.inline_js = 0
        self._in_script = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "script":
            if a.get("src"):
                self.assets.append(a["src"])
            elif a.get("type", "text/javascript") in ("text/javascript", "module", ""):
                self._in_script = True
        elif tag == "img" and a.get("src"):
            self.assets.append(a["src"])
        elif tag == "link" and set((a.get("rel") or "").split()) & {"icon", "stylesheet", "preload"}:
            self.assets.append(a["href"])
        if a.get("data-src"):
            self.assets.append(a["data-src"])

    def handle_endtag(self, tag):
        if tag == "script":
            self._in_script = False

    def handle_data(self, data):
        if self._in_script:
            self.inline_js += len(data.encode())


def page_cost(html: str, site: Path) -> dict:
    p = _Assets()
    p.feed(html)
    local = sorted({a for a in p.assets if a.startswith("/") and not a.startswith("//")})
    weight = len(html.encode())
    script = p.inline_js
    for a in local:
        f = site / a.lstrip("/")
        size = f.stat().st_size if f.exists() else 0
        weight += size
        if a.endswith((".js", ".mjs")):
            script += size
    return {"weight": weight, "requests": 1 + len(local), "script": script, "assets": local}


def check(cost: dict, budget: dict) -> list[str]:
    return [f"{k} {cost[k]} > {budget[k]}" for k in ("weight", "requests", "script") if cost[k] > budget[k]]
