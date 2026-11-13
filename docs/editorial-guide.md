# Editorial guide

Write as Sam or Brea explaining what they made, the choices they made, and why.
Use concrete observations, natural contractions, American English, and a personal,
curious voice. Avoid marketing claims and invented memories. Clearly distinguish
recollection, uncertainty, source evidence, and present-day interpretation.

Prefer ordinary punctuation and two sentences over an em dash. Use descriptive
sentence-case titles and metadata summaries that reflect the actual article.
Give an individual byline; do not invent joint authorship or unconfirmed identities.

## Metadata and approval

Log sources use `title`, `slug`, `description`, a quoted offset-bearing ISO
`date`, `author` (`sam` or `brea`), `status`, and explicit boolean `draft`.
Optional `originalProjectDate` records the historical project date independently.
The shared model validates dates against America/New_York seasonal offsets and
rejects duplicate normalized slugs/routes. Keep ordinary dates in bylines.

Record final publication metadata when editorial work is approved, even before
first deployment, then retain it. FSE labels derive from that date using the
reviewed time converter; never hand-edit the numeric label into front matter.
Draft capability remains tested with synthetic fixtures. Actual unpublished
articles stay in private authoring storage until approved for source publication.

## Images, links, and accessibility

Review useful alt text in context. Describe essential visible information;
captions provide names, dates, context, humor, and credits without duplicating
the entire description. Avoid guessing identities or emotions. Functional images
describe their destination/action; decorative images use empty alternatives.
Complex illustrations need adjacent structured text, not an oversized alt string.

Internal links remain in the current tab. External links open in a new tab with
a screen-reader explanation, visible when CSS is disabled. The footer explains
the policy; no visual arrow is appended. Keep link wording descriptive, including
“Starbase 430 RSS feed” and optional interaction requirements.

The development agent owns automated checks and triage. Routine prose using
existing patterns does not restart a manual checklist. Review new interactions
and significant shared layout changes with focused human/browser evidence.
