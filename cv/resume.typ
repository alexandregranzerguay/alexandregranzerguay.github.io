// One-page industry and quant résumé. Must stay at exactly one page (checked in CI).
#import "lib.typ": *
#show: setup.with("Résumé")

#header()

#section("Education")
#for e in cv.education {
  entry(
    e.degree + if e.field != none and not e.degree.contains(e.field) [ (#e.field)],
    org: e.school,
    dates: fmt-range(e.start, e.end),
    detail: if e.at("advisor", default: none) != none { e.detail + " Supervisor: " + e.advisor + "." } else { e.detail },
  )
}

#section("Experience")
#for x in cv.experience.filter(x => not x.at("earlier", default: false)) {
  entry(
    x.title,
    org: x.at("org_short", default: x.org),
    dates: fmt-range(x.start, x.end),
    bullets: x.bullets.filter(b => b.at("resume", default: false)).map(b => b.text),
  )
}
#let ta = cv.teaching.at(0)
#entry(
  ta.role,
  org: ta.institution,
  dates: fmt-range(ta.start, ta.end),
  bullets: (ta.duties + " Courses: " + ta.courses.map(c => c.name).join(", ") + ".",),
)
#block(above: 0.65em)[
  *Earlier:* #cv.experience.filter(x => x.at("earlier", default: false) and x.at("resume", default: true)).map(x => [#x.title, #emph(x.org) #text(size: 9pt, fill: muted)[(#fmt-range(x.start, x.end))]]).join("; ").
]

#if papers.len() > 0 [
  #section("Research")
  #for r in papers.filter(r => r.at("resume", default: true)) { research-entry(r) }
  #patents-block()
]

#section("Skills")
#skills-block()
#block(above: 0.4em)[*Languages:* #languages-line()]
