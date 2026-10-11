# {{ person.name }}: curriculum vitae

{{ person.headline }}. {{ person.location }}. {{ person.email_display }} · {{ BASE }}/

## Education

{% for e in cv.education %}
- **{{ e.degree }}**, {{ e.school }}, {{ fmt_range(e.start, e.end) }}. {{ e.detail }}{% if e.thesis %} Thesis: {{ e.thesis }}.{% endif %}{% if e.advisor %} Supervisor: {{ e.advisor }}.{% endif %}

{% endfor %}

## Experience

{% for x in cv.experience if x.cv is not defined or x.cv %}
### {{ x.title }}, {{ x.org }} ({{ fmt_range(x.start, x.end) }}, {{ x.location }})

{% for b in x.bullets %}
- {% if b.lead %}*{{ b.lead }}* {% endif %}{{ b.text }}
{% endfor %}

{% endfor %}
## Research

{% for r in papers %}
- {{ r.title }} ({{ r.year }}). {{ authors(r.authors) }}. Status: {{ r.status_label }}.{% if r.talks %} Presented at {{ r.talks | map(attribute="event") | join(", ") }}.{% endif %}

{% endfor %}

{% if patents %}
## Patents

{% for p in patents %}
- {{ p.title }}. {{ p.venue }}, {{ p.year }}. Inventors: {{ authors(p.authors) }}. Assigned to {{ p.assignee }}. {{ p.links.patent }}
{% endfor %}
{% endif %}

## Teaching

{% for t in cv.teaching %}
### {{ t.role }}, {{ t.institution }} ({{ fmt_range(t.start, t.end) }})

{{ t.duties }}

{% for c in t.courses %}
- {{ c.name }}{% if c.terms %} ({{ c.terms | join(", ") }}){% endif %}

{% endfor %}
{% endfor %}
## Talks

{% for r in papers %}{% for t in r.talks %}
- {{ r.title }}. {{ t.event }}{% if t.city %}, {{ t.city }}{% endif %}{% if t.year %}, {{ t.year }}{% endif %}.
{% endfor %}{% endfor %}
{% for t in cv.talks %}
- {{ t.title }}. {{ t.event }}{% if t.city %}, {{ t.city }}{% endif %}{% if t.year %}, {{ t.year }}{% endif %}.
{% endfor %}
{% if cv.awards %}
## Awards and scholarships

{% for a in cv.awards %}
- {{ a.name }}, {{ a.org }}, {{ a.year }}.{% if a.detail %} {{ a.detail }}{% endif %}{% if a.links %} {{ a.links.announcement or "" }}{% endif %}
{% endfor %}
{% endif %}

## Service and mentoring

{% for s in cv.service %}
- {{ s.role }}, {{ s.org }} ({{ fmt_range(s.start, s.end) }}). {{ s.text }}
{% endfor %}

## Skills

{% for s in cv.skills %}
- {{ s.label }}: {{ s["items"] | join(", ") }}
{% endfor %}
- Languages: {% for l in cv.languages %}{{ l.name }} ({{ l.level }}){% if not loop.last %}, {% endif %}{% endfor %}

