// Open Graph image (1200 x 630 px at 72 ppi). The header SVG is written by build.py.
#import "lib.typ": cv, me

#set page(width: 1200pt, height: 630pt, margin: (x: 80pt, y: 64pt), fill: rgb("#fffffd"))
#set text(font: "Libertinus Serif", fill: rgb("#161616"))

#image("/build/og-header.svg", width: 100%)
#v(1fr)
#text(size: 72pt, me)
#v(-26pt)
#block(width: 100%, text(size: 30pt, fill: rgb("#5d5d5d"), cv.person.headline))
#v(14pt)
#text(size: 24pt, fill: rgb("#0b45a8"), cv.person.url.replace("https://", ""))
