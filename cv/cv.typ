// Full academic CV.
#import "lib.typ": *
#show: setup.with("Curriculum Vitae")

#header(subtitle: [Curriculum vitae #sym.dot.c #cv.person.headline])

#section("Education")
#for e in cv.education {
  let detail = [#e.detail]
  if e.at("gpa", default: none) != none { detail += [ GPA: #e.gpa.] }
  if e.at("thesis", default: none) != none { detail += [ Thesis: #emph(e.thesis).] }
  if e.at("advisor", default: none) != none { detail += [ Supervisor: #e.advisor.] }
  if e.at("coursework", default: ()).len() > 0 { detail += [ Coursework: #e.coursework.join(", ").] }
  entry(e.degree, org: e.school + ", " + e.location, dates: fmt-range(e.start, e.end), detail: detail)
}

#for (key, heading) in (
  ("converged", "Publications and theses"),
  ("backtracking", "Under revision"),
  ("kkt", "Under review"),
  ("descending", "Working papers"),
  ("initialized", "In preparation"),
) {
  let items = papers.filter(r => r.status == key)
  if items.len() > 0 {
    section(heading)
    for r in items { research-entry(r) }
  }
}

#if patents.len() > 0 [
  #section("Patents")
  #patents-block()
]

#section("Teaching")
#for t in cv.teaching {
  entry(
    t.role,
    org: t.institution,
    dates: fmt-range(t.start, t.end),
    detail: t.duties,
    bullets: t.courses.map(c => [#c.name#if c.code != none [ (#c.code)]#if c.terms.len() > 0 [ #text(fill: muted)[(#c.terms.join(", "))]]]),
  )
}

#section("Industry experience")
#for x in cv.experience.filter(x => x.at("cv", default: true)) {
  entry(
    x.title,
    org: x.org,
    note: x.at("note", default: none),
    dates: fmt-range(x.start, x.end),
    bullets: x.bullets.map(bullet),
  )
}

#let all-talks = paper-talks + cv.talks
#if all-talks.len() > 0 [
  #section("Talks")
  #for t in all-talks {
    entry(
      t.title,
      org: t.event + if t.at("city", default: none) != none { ", " + t.city } else { "" },
      dates: if t.at("year", default: none) != none { str(t.year) } else { "" },
    )
  }
]

#if cv.awards.len() > 0 [
  #section("Awards and scholarships")
  #for a in cv.awards { entry(a.name, org: a.org, dates: str(a.year), detail: a.at("detail", default: none)) }
]

#let oss = projects.filter(p => p.at("cv", default: false))
#if oss.len() > 0 [
  #section("Open source")
  #for p in oss { entry(p.name, org: p.role, dates: p.year, bullets: (p.summary,)) }
]

#section("Service and mentoring")
#for s in cv.service { entry(s.role, org: s.org, dates: fmt-range(s.start, s.end), bullets: (s.text,)) }

#section("Skills")
#skills-block()
#block(above: 0.4em)[*Languages:* #languages-line()]
#block(above: 0.4em)[*Interests:* #cv.interests.join(", ")]
