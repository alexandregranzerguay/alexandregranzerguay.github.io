# {{ person.name }}

{{ person.bio }} Based in {{ person.location }}.

- Website: {{ BASE }}/
- Email: {{ person.email_display }}
{% for k, u in links.items() if u %}
- {{ label(k) }}: {{ u }}
{% endfor %}
- CV (PDF): {{ BASE }}/cv.pdf
- Résumé (PDF): {{ BASE }}/resume.pdf
- CV (JSON Resume): {{ BASE }}/cv.json

Research interests: {{ person.knows_about | join(", ") }}.

## Research

{{ overview.paragraphs | join("\n\n") }}

## Papers (newest first)

{% for r in papers %}
- {{ r.title }} ({{ r.year }}). {{ authors(r.authors) }}. Status: {{ r.status_label }}.{% if r.talks %} Presented at {{ r.talks | map(attribute="event") | join(", ") }}.{% endif %}{% if r.venue %} {{ r.venue }}.{% endif %}{% if r.page %} {{ BASE }}{{ r.page }}{% endif %}

{% endfor %}

{% if patents %}
## Patents

{% for p in patents %}
- {{ p.title }}. {{ p.venue }}, {{ p.year }}. Inventors: {{ authors(p.authors) }}. Assigned to {{ p.assignee }}. {{ p.links.patent }}
{% endfor %}
{% endif %}

{% if projects %}
## Projects

{% for p in projects if not p.earlier %}
- {{ p.name }} ({{ p.year }}): {{ p.summary }}{% if p.links.code %} Code: {{ p.links.code }}{% endif %}

{% endfor %}
{% endif %}
{% if notes %}
## Notes

{% for n in notes %}
- {{ n.title }} ({{ n.date }}): {{ n.summary }} {{ BASE }}{{ n.url }}
{% endfor %}
{% endif %}

## Teaching

{% for t in cv.teaching %}
{{ t.role }}, {{ t.institution }} ({{ fmt_range(t.start, t.end) }}). {{ t.duties }} Courses: {% for c in t.courses %}{{ c.name }}{% if c.terms %} ({{ c.terms | join(", ") }}){% endif %}{% if not loop.last %}; {% endif %}{% endfor %}.

{% endfor %}
## Languages

{% for l in cv.languages %}{{ l.name }} ({{ l.level }}){% if not loop.last %}, {% endif %}{% endfor %}.

Last updated {{ built }}.
