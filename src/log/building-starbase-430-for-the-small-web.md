---
title: Building Starbase 430 for the small web
slug: building-starbase-430-for-the-small-web
description: I built Starbase 430 as a lightweight, portable home for our maker projects, with a space-inspired design and a straightforward publishing workflow.
date: "2026-11-05T12:26:05-05:00"
author: sam
status: active
draft: false
---

I built Starbase 430 as a shared workshop for the things Brea and I make. I wanted room for substantial project stories alongside smaller accounts of experiments, revisions, repairs, and useful discoveries. I also wanted our writing and photographs to have a home on the independent web, with addresses we control and files we could take to another host.

That led me to [Eleventy](https://www.11ty.dev/), a tool that turns Markdown and page templates into ordinary static files. I kept the writing in readable text and avoided the need for a database or an application server. I wanted a change of hosting to mean moving files, not rebuilding our project stories around another publishing system.

## A visual identity with a simple foundation

I wanted the site to feel like a futuristic outpost workshop, so I used green accents, silver borders, rounded frames, and dark reading panels to give it that character while leaving the writing at the center. For the backdrop, I chose soft nebula colors and dense stars made with CSS gradients. That gave me the atmosphere I wanted without a background image download. I used system fonts to avoid another download.

I kept the main navigation compact. Numbered chapter links sit beside longer pages when there is room and move into a top-down reading flow on smaller screens.

## Keeping the pages small and usable

I made reading and navigation work without JavaScript. Ordinary headings and links were enough for those jobs. I also left out advertising and tracking. Neither fits the optimistic future I wanted the site to suggest.

I used the [Web Content Accessibility Guidelines, WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/), to guide decisions about keyboard focus, contrast, responsive layouts, reduced motion, and readability without stylesheets.

I set a preferred budget of 100,000 uncompressed bytes for a page and its required resources, with a hard ceiling of 512,000 bytes. I wanted small pages to be a design constraint from the beginning, rather than an optimization task left until the end. I added a checker that counted HTML, styles, images, and other required local resources, including every responsive image alternative.

## One Log for project stories and updates

I initially separated Projects from the Log, then realized I was creating two publishing paths for closely related writing. I brought project stories, retrospectives, and smaller updates into one Log instead. That gave me one workflow without requiring every entry to be the same length or follow the same structure.

I chose one RSS feed at `/feed.xml` for the 20 newest published Log entries and included the full text. I wanted people to be able to read in their feed reader, not just receive a link back to the site.

I gave each entry an explicit slug, the short name used in its URL, so renaming a source file would not change its published address. I also separated publication dates from original project dates. That will let me document an older build as a retrospective without pretending I had published an account of it years earlier.

## Making room for unfinished writing

I made drafts part of the normal workflow rather than keeping unfinished writing somewhere outside the site. A draft appears in the local preview with its photographs and other assets, while the production build excludes it from pages, indexes, and feeds. Draft-only assets are excluded too. That gave me a way to review the whole entry without making the writing or its images public.

## Sharing the useful parts

I chose the [MIT License](https://opensource.org/license/mit) for the reusable site code because I wanted other people to be able to learn from it, adapt it, and use it in their own projects, including commercial ones. I'm comfortable allowing private modifications rather than requiring people to share every change.

I kept our writing, photographs, artwork, and identity assets separate from that software license. Being willing to share the machinery behind the site did not need to mean granting blanket reuse rights to everything we put on it. I also made sure to keep other creators' work under its own permissions and credits.

I treated code licensing, making the source public, and publishing the website as separate decisions. That gave me room to review the writing, images, and technical checks without turning a source-code update into an accidental launch.

Taken together, these choices gave our projects a home I could understand and maintain. The point was to spend time telling the stories of what we made, what changed along the way, and what we learned. The [Colophon](/colophon/) has more detail about how the site was made.
