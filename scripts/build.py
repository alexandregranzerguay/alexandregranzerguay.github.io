"""Build the static site into _site/.

Sources: data/*.yaml, notes/*.md, templates/, static/, cv/*.typ.
Usage:
    python scripts/build.py           # full build (HTML, machine-readable files, PDFs, OG image)
    python scripts/build.py --no-pdf  # skip Typst
    python scripts/build.py --todo    # list open TODOs in data/
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import math
import re
import shutil
import subprocess
import sys
from pathlib import Path
from xml.sax.saxutils import escape as xml_escape

import latex2mathml.converter
import yaml
from jinja2 import Environment, FileSystemLoader, select_autoescape
from markdown_it import MarkdownIt
from markupsafe import Markup
from mdit_py_plugins.dollarmath import dollarmath_plugin

import contours

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "_site"
BASE = "https://alexandregranzerguay.github.io"
SOURCE = "https://github.com/alexandregranzerguay/alexandregranzerguay.github.io"

STATUS = {  # key -> (plain label, schema.org creativeWorkStatus)
    "initialized": ("in preparation", "Draft"),
    "descending": ("working paper", "Draft"),
    "kkt": ("under review", "Submitted"),
    "backtracking": ("revise and resubmit", "Submitted"),
    "converged": ("published", "Published"),
}

LINK_LABELS = {"github": "GitHub", "scholar": "Google Scholar", "orcid": "ORCID", "linkedin": "LinkedIn",
               "doi": "DOI", "arxiv": "arXiv", "pdf": "PDF", "code": "code", "patent": "Google Patents"}

AI_BOTS = [
    "OAI-SearchBot", "ChatGPT-User", "GPTBot", "ClaudeBot", "Claude-SearchBot", "Claude-User",
    "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "CCBot", "Bingbot",
]


# ----------------------------------------------------------------------------- data


def load_data() -> dict:
    d = {k: yaml.safe_load((ROOT / "data" / f"{k}.yaml").read_text()) for k in ("cv", "research", "projects", "overview")}
    d["research_raw"] = sorted((r for r in d["research"] if r.get("listed")), key=lambda r: str(r["date"]), reverse=True)
    d["research"] = [sanitize(r) for r in d["research_raw"]]
    d["notes"] = load_notes()
    return d


def sanitize(r: dict) -> dict:
    """Disclosure rule: unpublished items expose title, authors, year and status only."""
    r = dict(r)
    r["year"] = str(r["date"])[:4]
    r["talks"] = r.get("talks") or []
    if not r.get("public"):
        r.update(abstract=None, links={}, venue=None)
    r["citation"] = r.get("citation") or {}
    label = STATUS[r["status"]][0]
    if r["status"] == "converged" and r["type"] == "thesis":
        label = "completed"
    elif r["status"] == "converged" and r["type"] == "patent":
        label = "granted"
    elif r["status"] == "descending" and r.get("public"):
        label = "preprint"
    r["status_label"] = label
    r["page"] = f"/research/{r['slug']}/" if r.get("public") and r["type"] != "patent" else None
    return r


def load_notes() -> list[dict]:
    notes = []
    for f in sorted((ROOT / "notes").glob("*.md")):
        text = f.read_text()
        m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
        meta, body = (yaml.safe_load(m.group(1)), m.group(2)) if m else ({}, text)
        if meta.get("draft"):
            continue
        meta.update(slug=f.stem, body_md=body, source=f, url=f"/notes/{f.stem}/")
        meta["date"] = str(meta["date"])
        notes.append(meta)
    return sorted(notes, key=lambda n: n["date"], reverse=True)


# ----------------------------------------------------------------------------- rendering helpers


def _math(content: str, display: bool) -> str:
    return latex2mathml.converter.convert(content, display="block" if display else "inline")


def markdown() -> MarkdownIt:
    md = MarkdownIt("commonmark", {"typographer": True}).enable(["table", "replacements", "smartquotes"])
    md.use(dollarmath_plugin, allow_space=True, double_inline=True)
    md.add_render_rule("math_inline", lambda self, tokens, idx, options, env: _math(tokens[idx].content, False))
    md.add_render_rule("math_inline_double", lambda self, tokens, idx, options, env: _math(tokens[idx].content, True))
    md.add_render_rule("math_block", lambda self, tokens, idx, options, env: _math(tokens[idx].content, True) + "\n")
    return md


def _landscape(t: float) -> float:
    """1-D non-convex objective: a local minimum, a hump, then a deeper global minimum."""
    return (1.1 - 0.9 * t + 0.25 * t * t - 0.38 * math.exp(-(((t - 0.30) / 0.085) ** 2))
            - 0.62 * math.exp(-(((t - 0.76) / 0.1) ** 2)))


def glyph(status: str) -> Markup:
    """Where the paper sits on a non-convex landscape: start, slope, local minimum, hump, global minimum."""
    w, h = 56, 18
    ts = [i / 48 for i in range(49)]
    vals = [_landscape(t) for t in ts]
    hi, lo = max(vals), min(vals)

    def pt(t: float) -> tuple[float, float]:
        return 2 + t * (w - 4), 2.5 + (hi - _landscape(t)) / (hi - lo) * (h - 5.5)

    d = "M" + " ".join(f"{x:.1f},{y:.1f}" for x, y in map(pt, ts))
    local, hump, glob = 0.308, 0.451, 0.764  # stationary points of _landscape

    def dot(t: float, cls: str = "") -> str:
        x, y = pt(t)
        c = f' class="{cls}"' if cls else ""
        return f'<circle{c} cx="{x:.1f}" cy="{y:.1f}" r="2.4"/>'

    dots = {
        "initialized": dot(0.02),
        "descending": dot(0.17),
        "kkt": dot(local),
        "backtracking": dot(local, "ghost") + dot(hump),
        "converged": dot(glob),
    }[status]
    return Markup(f'<svg class="glyph" viewBox="0 0 {w} {h}" aria-hidden="true"><path d="{d}"/>{dots}</svg>')


def fmt_date(d) -> str:
    d = str(d)
    if d == "present" or len(d) == 4:
        return d
    y, m = d.split("-")[:2]
    return dt.date(int(y), int(m), 1).strftime("%b %Y")


def fmt_range(a, b) -> str:
    a, b = fmt_date(a), fmt_date(b)
    return a if a == b else f"{a}–{b}"


def authors(names: list[str], me: str, html: bool = True) -> str:
    out = [f"<strong>{n}</strong>" if (html and n == me) else n for n in names]
    if len(out) <= 2:
        s = " and ".join(out)
    else:
        s = ", ".join(out[:-1]) + ", and " + out[-1]
    return Markup(s) if html else s


def bibtex(r: dict) -> str:
    first_word = next(w for w in r["title"].lower().split() if w not in {"a", "an", "the", "on"})
    key = r["authors"][0].split()[-1].replace("-", "").lower() + r["year"] + "".join(c for c in first_word if c.isalnum())
    c = r["citation"]
    fields = {"title": "{" + r["title"] + "}", "author": " and ".join(r["authors"]), "year": r["year"]}
    if r["type"] == "thesis":
        kind, fields["school"] = "mastersthesis", "University of Toronto"
    elif c.get("arxiv"):
        kind = "misc"
        fields.update(eprint=c["arxiv"], archivePrefix="arXiv")
    else:
        kind = "article"
        for k, bk in (("journal", "journal"), ("volume", "volume"), ("issue", "number"), ("doi", "doi"),
                      ("publisher", "publisher")):
            if c.get(k):
                fields[bk] = str(c[k])
        if c.get("firstpage"):
            fields["pages"] = f"{c['firstpage']}--{c['lastpage']}"
    body = ",\n".join(f"  {k} = {{{v}}}" for k, v in fields.items())
    return f"@{kind}{{{key},\n{body}\n}}"


def citation_meta(r: dict) -> dict:
    """Highwire Press tags that Google Scholar reads on a paper page."""
    c = r["citation"]
    meta = {"citation_title": r["title"], "citation_publication_date": str(r["date"]).replace("-", "/")}
    for k in ("journal", "volume", "issue", "firstpage", "lastpage", "doi", "publisher", "arxiv"):
        if c.get(k):
            meta["citation_journal_title" if k == "journal" else f"citation_{k}" if k != "arxiv" else "citation_arxiv_id"] = str(c[k])
    return meta


def git_date(paths: list[Path]) -> str | None:
    try:
        out = subprocess.run(["git", "log", "-1", "--format=%cs", "--", *map(str, paths)],
                             cwd=ROOT, capture_output=True, text=True, check=True).stdout.strip()
        return out or None
    except (subprocess.CalledProcessError, FileNotFoundError):
        return None


# ----------------------------------------------------------------------------- JSON-LD


def person_node(cv: dict) -> dict:
    p, l = cv["person"], cv["links"]
    return {
        "@type": "Person",
        "@id": f"{BASE}/#person",
        "name": p["name"],
        "alternateName": p["alternate_names"],
        "url": f"{BASE}/",
        "description": p["summary"],
        "jobTitle": p["job_title"],
        "worksFor": {"@type": "Organization", "name": p["employer"]["name"], "url": p["employer"]["url"]},
        "affiliation": {"@type": "CollegeOrUniversity", "name": p["affiliation"]["name"],
                        "department": {"@type": "Organization", "name": p["affiliation"]["unit"]}},
        "alumniOf": sorted({e["school"] for e in cv["education"]}),
        "knowsAbout": p["knows_about"],
        "knowsLanguage": [x["name"] for x in cv["languages"]],
        "award": [f"{a['name']} ({a['year']})" for a in cv.get("awards") or []],
        "sameAs": [u for u in l.values() if u],
        "image": f"{BASE}/og.png",
    }


def research_node(r: dict) -> dict:
    n = {
        "@type": {"thesis": "Thesis", "patent": "CreativeWork"}.get(r["type"], "ScholarlyArticle"),
        "@id": f"{BASE}/research/#{r['slug']}",
        "name": r["title"],
        "headline": r["title"][:110],
        "author": [{"@id": f"{BASE}/#person"} if a.startswith("Alexandre Granzer") else {"@type": "Person", "name": a}
                   for a in r["authors"]],
        ("datePublished" if r["status"] == "converged" else "dateCreated"): str(r["date"]),
        "creativeWorkStatus": STATUS[r["status"]][1],
    }
    if r["type"] == "patent":
        n.update(genre="Patent", identifier=r.get("number"))
    if r["citation"].get("doi"):
        n["identifier"] = {"@type": "PropertyValue", "propertyID": "DOI", "value": r["citation"]["doi"]}
    if r.get("abstract"):
        n["abstract"] = r["abstract"]
    if r.get("page"):
        n["url"] = BASE + r["page"]
    if r.get("venue"):
        n["isPartOf" if r["type"] != "thesis" else "inSupportOf"] = r["venue"]
    if r["talks"]:
        n["subjectOf"] = [{"@type": "Event", "name": t["event"], **({"startDate": str(t["year"])} if t.get("year") else {})}
                          for t in r["talks"]]
    if r["links"]:
        n["sameAs"] = [u for k, u in r["links"].items() if k in ("doi", "arxiv", "ssrn", "patent") and u]
    return n


def project_node(p: dict) -> dict:
    n = {"@type": "SoftwareSourceCode", "name": p["name"], "description": p["summary"],
         "author": {"@id": f"{BASE}/#person"}}
    if p["links"].get("code"):
        n["codeRepository"] = p["links"]["code"]
    if p.get("stack"):
        n["programmingLanguage"] = p["stack"]
    return n


def jsonld(nodes: list[dict]) -> Markup:
    s = json.dumps({"@context": "https://schema.org", "@graph": nodes}, ensure_ascii=False, separators=(",", ":"))
    return Markup(s.replace("</", "<\\/"))


# ----------------------------------------------------------------------------- build


class Site:
    def __init__(self, data: dict, built: str):
        self.d = data
        self.built = built
        self.me = data["cv"]["person"]["name"]
        self.env = Environment(loader=FileSystemLoader(ROOT / "templates"),
                               autoescape=select_autoescape(["html"]), trim_blocks=True, lstrip_blocks=True)
        self.env.globals.update(glyph=glyph, fmt_date=fmt_date, fmt_range=fmt_range, BASE=BASE, SOURCE=SOURCE,
                                link_label=lambda k: LINK_LABELS.get(k, k),
                                authors=lambda names: authors(names, self.me))
        self.md_env = Environment(loader=FileSystemLoader(ROOT / "templates" / "md"), autoescape=False,
                                  trim_blocks=True, lstrip_blocks=True)
        self.md_env.globals.update(fmt_date=fmt_date, fmt_range=fmt_range, BASE=BASE, label=LINK_LABELS.get,
                                   authors=lambda names: authors(names, self.me, html=False))
        self.pages: list[dict] = []  # for the sitemap
        self.outputs: list[Path] = []
        self.css = Markup((ROOT / "static" / "style.css").read_text())

    def ctx(self, **kw) -> dict:
        cv = self.d["cv"]
        return dict(cv=cv, person=cv["person"], links=cv["links"], research=self.d["research"],
                    papers=[r for r in self.d["research"] if r["type"] != "patent"],
                    patents=[r for r in self.d["research"] if r["type"] == "patent"],
                    overview=self.d["overview"],
                    projects=self.d["projects"] or [], notes=self.d["notes"], css=self.css, **kw)

    def write(self, rel: str, text: str) -> None:
        out = SITE / rel
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(text)
        self.outputs.append(out)

    def page(self, template: str, url: str, key: str, title: str, description: str, nodes: list[dict],
             sources: list[Path], lastmod: str | None = None, sitemap: bool = True, **kw) -> None:
        header = Markup(contours.header_svg(contours.STARTS.get(key, contours.STARTS["home"]),
                                            diverge=key == "404",
                                            label="Level sets of a sparse risk-parity objective over two portfolio weights"))
        base_ctx = self.ctx(url=url, canonical=BASE + url, key=key, title=title, description=description,
                            jsonld=jsonld([person_node(self.d["cv"])] + nodes), header=header, **kw)
        html = self.env.get_template(template).render(**base_ctx)
        rel = "404.html" if key == "404" else url.lstrip("/") + "index.html"
        self.write(rel, html)
        if sitemap:
            self.pages.append({"loc": BASE + url, "lastmod": lastmod or git_date(sources) or self.built})

    def build(self, pdf: bool = True) -> None:
        d, cv = self.d, self.d["cv"]
        data_files = [ROOT / "data" / f for f in ("cv.yaml", "research.yaml", "projects.yaml")]
        tpls = ROOT / "templates"

        if SITE.exists():
            shutil.rmtree(SITE)
        shutil.copytree(ROOT / "static", SITE, ignore=shutil.ignore_patterns("style.css"))
        for f in (ROOT / "notes").glob("*/"):
            if f.is_dir():
                shutil.copytree(f, SITE / "notes" / f.name)

        md = markdown()
        for n in d["notes"]:
            n["html"] = Markup(md.render(n["body_md"]))

        if pdf:
            self.typst()

        p = cv["person"]
        self.page("home.html", "/", "home", f"{p['name']} · Quantitative Researcher",
                  p["summary"],
                  [{"@type": "ProfilePage", "@id": f"{BASE}/#page", "url": f"{BASE}/", "mainEntity": {"@id": f"{BASE}/#person"},
                    "dateModified": self.built},
                   {"@type": "WebSite", "@id": f"{BASE}/#site", "url": f"{BASE}/", "name": p["name"],
                    "publisher": {"@id": f"{BASE}/#person"}}],
                  data_files + [tpls / "home.html"])

        self.page("research.html", "/research/", "research", f"Research · {p['name']}",
                  "Non-convex portfolio optimization: MIQP, MISOCP and non-convex QP formulations, ADMM and "
                  "mixed-integer methods, and their use in index tracking, risk parity and trading.",
                  [research_node(r) for r in d["research"]], data_files[1:2] + [tpls / "research.html"])

        for r in d["research"]:
            if not r["page"]:
                continue
            figure = ROOT / "research" / r["slug"] / "figure.html"
            citation = citation_meta(r)
            title = f"{r['title']} · {p['name']}"
            self.page("paper.html", r["page"], "research", title if len(title) <= 70 else r["title"],
                      (r.get("abstract") or r["title"])[:300], [research_node(r)],
                      data_files[1:2] + [tpls / "paper.html"], r=r, bib=bibtex(r), citation=citation,
                      figure=Markup(figure.read_text()) if figure.exists() else None)
            if figure.exists():
                for f in figure.parent.iterdir():
                    if f.name != "figure.html":
                        (SITE / r["page"].lstrip("/")).mkdir(parents=True, exist_ok=True)
                        shutil.copy(f, SITE / r["page"].lstrip("/") / f.name)

        if d["projects"]:
            self.page("projects.html", "/projects/", "projects", f"Projects · {p['name']}",
                      "Code and projects in portfolio optimization, backtesting and engineering.",
                      [project_node(x) for x in d["projects"]], data_files[2:3] + [tpls / "projects.html"])

        if d["notes"]:
            self.page("notes.html", "/notes/", "notes", f"Notes · {p['name']}",
                      "Short technical notes on portfolio optimization and operations research.",
                      [], [n["source"] for n in d["notes"]] + [tpls / "notes.html"])
        for n in d["notes"]:
            title = f"{n['title']} · {p['name']}"
            self.page("note.html", n["url"], "notes", title if len(title) <= 70 else n["title"], n["summary"],
                      [{"@type": "BlogPosting", "headline": n["title"], "description": n["summary"],
                        "datePublished": n["date"], "author": {"@id": f"{BASE}/#person"},
                        "url": BASE + n["url"], "keywords": n.get("tags", [])}],
                      [n["source"]], lastmod=git_date([n["source"]]) or n["date"], note=n)

        self.page("cv.html", "/cv/", "cv", f"CV · {p['name']}",
                  f"Curriculum vitae of {p['name']}: education, research, teaching and industry experience.",
                  [], data_files[:2] + [tpls / "cv.html"])

        self.page("404.html", "/404.html", "404", "Iterate diverged · " + p["name"], "Page not found.", [], [],
                  sitemap=False)

        self.machine_files()
        self.check_disclosure()

    # ------------------------------------------------------------------ machine-readable outputs

    def machine_files(self) -> None:
        d, cv = self.d, self.d["cv"]
        ctx = dict(cv=cv, person=cv["person"], links=cv["links"], research=d["research"], projects=d["projects"] or [],
                   papers=[r for r in d["research"] if r["type"] != "patent"],
                   patents=[r for r in d["research"] if r["type"] == "patent"],
                   overview=d["overview"],
                   notes=d["notes"], built=self.built)
        index_md = self.md_env.get_template("index.md").render(**ctx)
        cv_md = self.md_env.get_template("cv.md").render(**ctx)
        self.write("index.md", index_md)
        self.write("cv.md", cv_md)
        for n in d["notes"]:
            self.write(f"notes/{n['slug']}.md", f"# {n['title']}\n\n{n['date']} · {BASE}{n['url']}\n\n{n['body_md']}")
        self.write("llms.txt", self.md_env.get_template("llms.txt").render(**ctx))
        full = [index_md, cv_md] + [f"# {n['title']}\n\n{n['body_md']}" for n in d["notes"]]
        self.write("llms-full.txt", "\n\n---\n\n".join(full))
        self.write("cv.json", json.dumps(json_resume(cv, d["research"]), indent=2, ensure_ascii=False))

        robots = ["User-agent: *", "Allow: /", ""]
        for bot in AI_BOTS:
            robots += [f"User-agent: {bot}", "Allow: /", ""]
        robots.append(f"Sitemap: {BASE}/sitemap.xml")
        self.write("robots.txt", "\n".join(robots) + "\n")

        urls = "".join(f"<url><loc>{xml_escape(p['loc'])}</loc><lastmod>{p['lastmod']}</lastmod></url>"
                       for p in self.pages)
        self.write("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n'
                   f'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>\n')

        if d["notes"]:
            entries = "".join(
                f"<entry><title>{xml_escape(n['title'])}</title><link href=\"{BASE}{n['url']}\"/>"
                f"<id>{BASE}{n['url']}</id><updated>{n['date']}T00:00:00Z</updated>"
                f"<summary>{xml_escape(n['summary'])}</summary></entry>" for n in d["notes"])
            self.write("notes/feed.xml", '<?xml version="1.0" encoding="utf-8"?>\n'
                       '<feed xmlns="http://www.w3.org/2005/Atom">'
                       f"<title>Notes · {xml_escape(cv['person']['name'])}</title>"
                       f'<link href="{BASE}/notes/"/><link rel="self" href="{BASE}/notes/feed.xml"/>'
                       f"<id>{BASE}/notes/</id><updated>{d['notes'][0]['date']}T00:00:00Z</updated>"
                       f"<author><name>{xml_escape(cv['person']['name'])}</name></author>{entries}</feed>\n")

    def check_disclosure(self) -> None:
        """Fail the build if any unpublished item's abstract, venue or links leak into an output."""
        secrets = []
        for r in self.d["research_raw"]:
            if r.get("public"):
                continue
            secrets += [s for s in [r.get("abstract"), r.get("venue")] if s]
            secrets += [u for u in (r.get("links") or {}).values() if u]
        leaks = []
        for f in SITE.rglob("*"):
            if f.is_file() and f.suffix in (".html", ".md", ".txt", ".json", ".xml"):
                text = f.read_text()
                leaks += [f"{f.relative_to(SITE)}: {s[:40]!r}" for s in secrets if s in text]
        if leaks:
            sys.exit("Disclosure check failed:\n  " + "\n  ".join(leaks))

    # ------------------------------------------------------------------ Typst

    def typst(self) -> None:
        def run(src: str, out: str, *extra: str) -> None:
            subprocess.run(["typst", "compile", "--root", str(ROOT), "--ignore-system-fonts", *extra,
                            str(ROOT / src), str(SITE / out)], check=True)

        run("cv/resume.typ", "resume.pdf")
        run("cv/cv.typ", "cv.pdf")
        og = ROOT / "build" / "og-header.svg"
        og.parent.mkdir(exist_ok=True)
        svg = contours.header_svg(contours.STARTS["home"]).replace(
            "<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ', 1).replace(
            'class="lvl"', 'class="lvl" fill="none" stroke="#b5b5b5" stroke-width="1.4"').replace(
            '<g class="path">', '<g class="path" fill="#555">').replace('class="min"', 'class="min" fill="#111"')
        og.write_text(svg)
        run("cv/og.typ", "og.png", "--ppi", "72")


def json_resume(cv: dict, research: list[dict]) -> dict:
    p, l = cv["person"], cv["links"]
    profiles = [{"network": LINK_LABELS.get(k, k), "url": u} for k, u in l.items() if u]
    return {
        "$schema": "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
        "basics": {"name": p["name"], "label": p["headline"], "url": p["url"],
                   "summary": p["bio"], "location": {"city": "Toronto", "region": "Ontario", "countryCode": "CA"},
                   "profiles": profiles},
        "work": [{"name": x["org"], "position": x["title"], "location": x.get("location"), "startDate": str(x["start"]),
                  **({} if x["end"] == "present" else {"endDate": str(x["end"])}),
                  "highlights": [(b["lead"] + " " if b.get("lead") else "") + b["text"] for b in x["bullets"]]}
                 for x in cv["experience"] if x.get("cv", True)],
        "volunteer": [{"organization": s["org"], "position": s["role"], "startDate": s["start"],
                       "endDate": s["end"], "summary": s["text"]} for s in cv["service"]],
        "education": [{"institution": e["school"], "area": e["field"], "studyType": e["short"],
                       "startDate": str(e["start"]), **({} if e["end"] == "present" else {"endDate": str(e["end"])})}
                      for e in cv["education"]],
        "publications": [{"name": r["title"] + (f" ({r['number']})" if r.get("number") else ""), "releaseDate": str(r["date"]),
                          **({"publisher": r["venue"]} if r.get("venue") else {}),
                          **({"url": BASE + r["page"]} if r.get("page") else {}),
                          **({"summary": r["abstract"]} if r.get("abstract") else {})} for r in research],
        "awards": [{"title": a["name"], "date": str(a["year"]), "awarder": a["org"], "summary": a.get("detail", "")}
                   for a in cv.get("awards") or []],
        "skills": [{"name": s["label"], "keywords": s["items"]} for s in cv["skills"]],
        "languages": [{"language": x["name"], "fluency": x["level"]} for x in cv["languages"]],
        "interests": [{"name": i} for i in cv["interests"]],
    }


def list_todos() -> None:
    for f in sorted((ROOT / "data").glob("*.yaml")) + sorted((ROOT / "notes").glob("*.md")):
        for i, line in enumerate(f.read_text().splitlines(), 1):
            if "TODO" in line:
                print(f"{f.relative_to(ROOT)}:{i}: {line.strip()}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--no-pdf", action="store_true", help="skip Typst (PDFs and OG image)")
    ap.add_argument("--todo", action="store_true", help="list open TODOs and exit")
    args = ap.parse_args()
    if args.todo:
        list_todos()
        return
    built = git_date([ROOT]) or dt.date.today().isoformat()
    Site(load_data(), built).build(pdf=not args.no_pdf)
    print(f"built {len(list(SITE.rglob('*.html')))} pages into {SITE.relative_to(ROOT)}/")


if __name__ == "__main__":
    main()
