# {{ person.name }}

{{ person.headline }}. {{ person.location }}. {{ person.email_display }} · {{ BASE }}/

## Profile

{{ person.bio }}

## Education

{% for e in cv.education %}
- **{{ e.degree }}{% if e.gpa %}, GPA {{ e.gpa }}{% endif %}**. {{ fmt_range(e.start, e.expected_end or e.end) }}{% if e.expected_end %} (expected){% endif %}. {{ e.school }}. {{ e.detail }}{% if e.advisor %} Supervised by Prof. {{ e.advisor }}.{% endif %}{% if e.coursework %} Coursework includes {{ e.coursework | join(", ") }}.{% endif %}

{% endfor %}
## Research and publications

{% for slug in cv.research_slugs %}{% set r = (papers | selectattr("slug", "equalto", slug) | list)[0] %}
- {{ r.title }} (with {{ r.authors | reject("equalto", person.name) | join(", ") }}). {% if r.public %}{{ r.venue }}, {{ r.year }}.{% else %}{% if r.status == "descending" %}Working paper, {{ r.year }}. {% endif %}{% if r.submission_note %}{{ r.submission_note }} {% endif %}{% if r.status != "descending" %}{{ r.year }}.{% endif %}{% endif %}{% if r.cv_summary %} {{ r.cv_summary }}{% endif %}

{% endfor %}
{{ cv.research_presentation }}

## Experience

{% for x in cv.experience %}
### {{ x.title }}, {{ x.org }} ({{ fmt_range(x.start, x.end) }})

{% for b in x.bullets %}
- {{ b.text }}
{% endfor %}

{% endfor %}
## Teaching

{% for t in cv.teaching %}
### {{ t.role }}, {{ t.institution }} ({{ fmt_range(t.start, t.end) }})

{% for c in t.courses %}
- {{ c.name }} ({{ c.code }}), {{ c.terms | join(", ") }}
{% endfor %}
- {{ t.duties }}
{% endfor %}

## Awards and patents

{% for a in cv.awards %}
- {{ a.name }} ({{ a.org }}), {{ a.year }}. {{ a.detail }}
{% endfor %}
{% set ps = patents | sort(attribute="date") %}
- US Patents {% for p in ps %}{{ p.number | replace("US ", "") }}{% if not loop.last %} and {% endif %}{% endfor %} — {{ ps[0].title }} (TD Bank), {{ ps[-1].year }}.

## Skills

{% for s in cv.skills %}
- {{ s.label }}: {{ s["items"] | join(", ") }}
{% endfor %}
- Languages: {% for l in cv.languages %}{{ l.name }} ({{ l.level }}){% if not loop.last %}, {% endif %}{% endfor %}
