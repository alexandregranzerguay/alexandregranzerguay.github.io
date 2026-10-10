// Shared layout for resume.typ and cv.typ. Content comes from /data/*.yaml.
// Compile from the repo root: typst compile --root . --ignore-system-fonts cv/resume.typ
// Private copy with phone number: add --input phone="+1 (555) 555-5555" (never stored in the repo)

#let cv = yaml("/data/cv.yaml")
#let projects = yaml("/data/projects.yaml")
#let research = yaml("/data/research.yaml").filter(r => r.listed).sorted(key: r => r.date).rev()
#let year(r) = r.date.slice(0, 4)
#let papers = research.filter(r => r.type != "patent")
#let patents = research.filter(r => r.type == "patent")
#let paper-talks = papers.map(r => r.at("talks", default: ()).map(t => (title: r.title, ..t))).flatten()
#let bullet(b) = if b.at("lead", default: none) != none [#emph(b.lead) #b.text] else [#b.text]
#let talk-place(t) = (if t.at("year", default: none) != none { str(t.year) } else { "" }) + (if t.at("city", default: none) != none { ", " + t.city } else { "" })
#let phone = sys.inputs.at("phone", default: none)
#let me = cv.person.name

#let rule-color = luma(150)
#let muted = luma(90)

#let status-label = (
  initialized: "in preparation",
  descending: "working paper",
  kkt: "under review",
  backtracking: "revise and resubmit",
  converged: "published",
)

#let months = ("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")

#let fmt-date(d) = {
  let d = str(d)
  if d == "present" { "present" } else if d.len() == 4 { d } else {
    let (y, m) = d.split("-")
    months.at(int(m) - 1) + " " + y
  }
}

#let fmt-range(start, end) = {
  let s = fmt-date(start)
  let e = fmt-date(end)
  if s == e { s } else { s + sym.dash.en + e }
}

#let url-label(u) = u.replace("https://", "").replace("http://", "").trim("/")

#let setup(kind, doc) = {
  set document(
    title: me + ", " + kind,
    author: me,
    keywords: cv.person.knows_about,
  )
  set page(paper: "us-letter", margin: (x: 0.75in, top: 0.6in, bottom: 0.6in))
  set text(font: "Libertinus Serif", size: 10.5pt, lang: "en", hyphenate: false)
  set par(leading: 0.58em, spacing: 0.65em)
  set list(marker: [–], indent: 0.2em, body-indent: 0.5em, spacing: 0.4em)
  show link: set text(fill: rgb("#1a4e8a"))
  doc
}

#let header(subtitle: none) = {
  let p = cv.person
  let l = cv.links
  let contacts = (
    link("mailto:" + p.email, p.email),
    link(p.url, url-label(p.url)),
    link(l.github, url-label(l.github)),
  )
  if l.linkedin != none { contacts.push(link(l.linkedin, url-label(l.linkedin))) }
  if l.scholar != none { contacts.push(link(l.scholar, "Google Scholar")) }
  if l.orcid != none { contacts.push(link(l.orcid, "ORCID " + l.orcid.split("/").last())) }
  if phone != none { contacts.push(phone) }
  set align(center)
  block(below: 0.55em, text(size: 20pt, tracking: 0.03em, smallcaps(me)))
  block(below: 0.4em, text(fill: muted, if subtitle == none { p.headline } else { subtitle }))
  block(below: 0pt, text(size: 9pt, contacts.join([ #sym.dot.c ])))
}

#let section(title) = {
  v(0.85em, weak: true)
  block(below: 0.55em, sticky: true, width: 100%)[
    #text(size: 10.5pt, tracking: 0.04em, smallcaps(strong(title)))
    #h(0.4em)
    #box(width: 1fr, inset: (bottom: 0.28em), line(length: 100%, stroke: 0.4pt + rule-color))
  ]
}

#let entry(title, org: none, dates: none, place: none, note: none, detail: none, bullets: ()) = block(
  above: 0.8em,
  below: 0pt,
  breakable: true,
)[
  #grid(
    columns: (1fr, auto),
    column-gutter: 1em,
    strong(title) + if org != none [, #emph(org)] + if note != none [ #text(fill: muted)[(#note)]],
    text(size: 9pt, dates),
  )
  #if detail != none { block(above: 0.35em, below: 0pt, text(fill: muted, detail)) }
  #if bullets.len() > 0 { block(above: 0.35em, below: 0pt, list(..bullets.map(b => [#b]))) }
]

#let authors(names) = (
  names
    .map(a => if a == me { strong(a) } else { a })
    .join(", ", last: if names.len() > 2 { ", and " } else { " and " })
)

#let status-text(r) = if r.status == "converged" and r.type == "thesis" { "completed" } else if (
  r.status == "converged" and r.type == "patent"
) { "granted" } else if r.status == "descending" and r.public { "preprint" } else { status-label.at(r.status) }

#let research-entry(r) = block(above: 0.65em, below: 0pt)[
  #grid(
    columns: (1fr, auto),
    column-gutter: 1em,
    [#r.title #text(fill: muted)[(#year(r))]. #text(size: 9pt)[#authors(r.authors).] #if r.public and r.venue != none { emph(r.venue) + "." } #if r.at("talks", default: ()).len() > 0 { text(size: 9pt)[Presented at #r.talks.map(t => t.short + " " + talk-place(t)).join("; ").] }],
    text(size: 9pt, fill: muted, status-text(r)),
  )
]

#let skills-block() = for s in cv.skills {
  block(above: 0.4em, below: 0pt)[*#s.label:* #s.items.join(", ")]
}

#let languages-line() = cv.languages.map(l => l.name + " (" + l.level + ")").join(", ")

// Patents that share a title (continuations) are shown as one entry.
#let patents-block() = for t in patents.map(p => p.title).dedup() {
  let ps = patents.filter(p => p.title == t).sorted(key: p => p.date)
  block(above: 0.65em, below: 0pt)[
    #grid(
      columns: (1fr, auto),
      column-gutter: 1em,
      [#t #text(fill: muted)[(#year(ps.last()))]. #text(size: 9pt)[US Patents #ps.map(p => p.number.replace("US ", "")).join(" and "). #authors(ps.first().authors). Assigned to #ps.first().assignee.]],
      text(size: 9pt, fill: muted, "granted"),
    )
  ]
}
