// Shared layout for cv.typ. Content comes from /data/*.yaml.
// Compile from the repo root: typst compile --root . --ignore-system-fonts --font-path cv/fonts cv/cv.typ
// Private copy with phone number: add --input phone="+1 (555) 555-5555" (never stored in the repo)

#let cv = yaml("/data/cv.yaml")
#let research = yaml("/data/research.yaml").filter(r => r.listed).sorted(key: r => r.date).rev()
#let year(r) = r.date.slice(0, 4)
#let papers = research.filter(r => r.type != "patent")
#let patents = research.filter(r => r.type == "patent")
#let bullet(b) = if b.at("lead", default: none) != none [#emph(b.lead) #b.text] else [#b.text]
#let phone = sys.inputs.at("phone", default: none)
#let me = cv.person.name

#let accent = rgb("#1f4e79")

#let months = ("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")

#let fmt-date(d) = {
  let d = str(d)
  if d == "present" { "Present" } else if d.len() == 4 { d } else {
    let (y, m) = d.split("-")
    months.at(int(m) - 1) + " " + y
  }
}

#let fmt-range(start, end) = {
  let s = fmt-date(start)
  let e = fmt-date(end)
  if s == e { s } else { s + " " + sym.dash.en + " " + e }
}

#let url-label(u) = u.replace("https://", "").replace("http://", "").trim("/")

#let muted = luma(100)
#let display = "Libertinus Serif"
#let gutter = 1.15in

#let setup(kind, doc) = {
  set document(
    title: me + ", " + kind,
    author: me,
    keywords: cv.person.knows_about,
  )
  set page(paper: "us-letter", margin: (x: 0.7in, top: 0.6in, bottom: 0.6in))
  set text(font: "Lato", size: 10.5pt, lang: "en", hyphenate: false)
  set par(leading: 0.5em, spacing: 0.5em)
  set list(marker: text(fill: accent, weight: "bold")[›], indent: 0em, body-indent: 0.5em, spacing: 0.4em)
  show link: set text(fill: accent)
  doc
}

#let header() = {
  let p = cv.person
  let l = cv.links
  let items = (p.location, link("mailto:" + p.email, p.email))
  if phone != none { items.push(phone) }
  items.push(link(p.url, url-label(p.url)))
  items.push(link(l.github, "GitHub"))
  if l.scholar != none { items.push(link(l.scholar, "Google Scholar")) }
  if l.linkedin != none { items.push(link(l.linkedin, "LinkedIn")) }
  if l.orcid != none { items.push(link(l.orcid, "ORCID")) }
  block(below: 0.5em, text(font: display, size: 28pt, me))
  block(below: 0.55em, text(font: display, size: 12pt, style: "italic", fill: accent, p.headline))
  text(size: 9pt, fill: muted, items.join([ #h(0.3em)|#h(0.3em) ]))
}

// Title in the left column, content in the right column, both top-aligned.
#let section(title, body) = {
  v(1.1em, weak: true)
  block(sticky: true, below: 0.75em, line(length: 100%, stroke: 0.4pt + luma(200)))
  grid(
    columns: (gutter, 1fr),
    text(font: display, size: 12.5pt, fill: accent, top-edge: "cap-height", smallcaps(lower(title))),
    body,
  )
}

#let entry(title, org: none, dates: none, detail: none, extra: none, bullets: ()) = block(
  above: 0.8em,
  below: 0pt,
)[
  #block(sticky: true, below: 0pt, grid(
    columns: (1fr, auto),
    column-gutter: 1em,
    [*#title*#if org != none [ #text(fill: muted)[·] #text(fill: accent, weight: "semibold", org)]],
    box(fill: rgb("#e8eff6"), inset: (x: 0.4em, y: 0.15em), radius: 2pt, text(size: 8.5pt, fill: accent, dates)),
  ))
  #if detail != none { block(above: 0.4em, below: 0pt, emph(detail)) }
  #if extra != none { block(above: 0.4em, below: 0pt, extra) }
  #if bullets.len() > 0 { block(above: 0.4em, below: 0pt, list(..bullets.map(b => [#b]))) }
]

// A top-level item without a bullet, spaced like an entry.
#let item(body) = block(above: 0.8em, below: 0pt, body)

#let languages-line() = cv.languages.map(l => l.name + " (" + l.level + ")").join(", ")
