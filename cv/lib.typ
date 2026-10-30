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

#let setup(kind, doc) = {
  set document(
    title: me + ", " + kind,
    author: me,
    keywords: cv.person.knows_about,
  )
  set page(paper: "us-letter", margin: (x: 0.8in, top: 0.6in, bottom: 0.6in))
  set text(font: "Lato", size: 10.5pt, lang: "en", hyphenate: false)
  set par(leading: 0.5em, spacing: 0.5em)
  set list(marker: [•], indent: 0.5em, body-indent: 0.5em, spacing: 0.4em)
  show link: set text(fill: accent)
  doc
}

#let header() = {
  let p = cv.person
  let l = cv.links
  let contact = (p.location.replace("Canada", "ON"),)
  if phone != none { contact.push(phone) }
  contact.push(link("mailto:" + p.email, p.email))
  let links = (link(p.url, url-label(p.url)), link(l.github, "GitHub"))
  if l.scholar != none { links.push(link(l.scholar, "Google Scholar")) }
  if l.linkedin != none { links.push(link(l.linkedin, "LinkedIn")) }
  if l.orcid != none { links.push(link(l.orcid, "ORCID")) }
  let sep = [ #h(0.2em) #sym.dot.c #h(0.2em) ]
  set align(center)
  block(below: 0.6em, text(size: 17pt, weight: "bold", fill: accent, upper(me)))
  block(below: 0.45em, contact.join(sep))
  block(below: 0pt, links.join(sep))
}

#let section(title) = {
  v(1.1em, weak: true)
  block(below: 0.7em, sticky: true, width: 100%, stroke: (bottom: 0.8pt + accent), inset: (bottom: 0.3em),
    text(weight: "bold", fill: accent, upper(title)))
}

#let entry(title, org: none, dates: none, detail: none, extra: none, bullets: ()) = block(
  above: 0.75em,
  below: 0pt,
)[
  #block(sticky: true, below: 0pt, grid(
    columns: (1fr, auto),
    column-gutter: 1em,
    strong(title + if org != none [ #sym.dash.en #org]),
    emph(dates),
  ))
  #if detail != none { block(above: 0.4em, below: 0pt, emph(detail)) }
  #if extra != none { block(above: 0.4em, below: 0pt, extra) }
  #if bullets.len() > 0 { block(above: 0.4em, below: 0pt, list(..bullets.map(b => [#b]))) }
]

#let languages-line() = cv.languages.map(l => l.name + " (" + l.level + ")").join(", ")
