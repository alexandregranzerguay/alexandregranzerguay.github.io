// CV structure and detail follow the supplied 2026 CV.
#import "lib.typ": *
#show: setup.with("Curriculum Vitae")

#header()

#section("Profile")
#cv.person.bio

#section("Education")
#for e in cv.education {
  let title = [#e.degree.replace(" and ", " & ")]
  if e.at("gpa", default: none) != none { title += [, GPA #e.gpa] }
  let detail = [#e.school. #e.detail]
  if e.at("advisor", default: none) != none { detail += [ Supervised by Prof. #e.advisor.] }
  let coursework = if e.at("coursework", default: ()).len() > 0 [Coursework includes #e.coursework.join(", ", last: " and ").]
  entry(title, dates: if e.at("expected_end", default: none) != none { fmt-range(e.start, e.expected_end) + " (expected)" } else { fmt-range(e.start, e.end) }, detail: detail, extra: coursework)
}

#section("Research and publications")
#list(..cv.research_slugs.map(slug => {
  let r = papers.find(r => r.slug == slug)
  let coauthors = r.authors.filter(a => a != me)
  [
    *#r.title* (with #coauthors.join(", ")).
    #if r.public { [#emph(r.venue), #year(r).] } else {
      if r.status == "descending" { [Working paper, #year(r). ] }
      if r.at("submission_note", default: none) != none { [#r.submission_note ] }
      if r.status != "descending" { [#year(r).] }
    }
    #if r.at("cv_summary", default: none) != none { [ #r.cv_summary] }
  ]
}))
#block(above: 0.6em)[#cv.research_presentation]

#section("Experience")
#for x in cv.experience {
  entry(x.title, org: x.org + if x.location == "Toronto, Canada" { ", Toronto" } else { "" }, dates: fmt-range(x.start, x.end), bullets: x.bullets.map(bullet))
}

#section("Teaching")
#for t in cv.teaching {
  entry(t.role, org: t.institution, dates: fmt-range(t.start, t.end),
    bullets: t.courses.map(c => [#c.name (#c.code), #c.terms.join(", ")]) + (t.duties,))
}

#section("Awards and patents")
#let ps = patents.sorted(key: p => p.date)
#list(
  ..cv.awards.map(a => [#a.name (#a.org), #a.year. #a.detail]),
  [US Patents #ps.map(p => p.number.replace("US ", "")).join(" and ") #sym.dash.en #ps.first().title (TD Bank), #year(ps.last()).],
)

#section("Skills")
#list(
  ..cv.skills.map(s => [*#s.label* #sym.dash.en #s.items.join(", ").]),
  [*Languages* #sym.dash.en #languages-line().],
)
