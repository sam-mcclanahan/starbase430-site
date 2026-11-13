---
layout: layouts/base.njk
title: Colophon
description: How the Starbase 430 website is being made.
---

<header class="page-header">
  <p class="eyebrow" aria-hidden="true">System notes / Build record</p>
  <h1>Colophon</h1>
  <p>How we make Starbase 430, from the pages you read to the tools behind them.</p>
</header>

<section class="content-section" aria-labelledby="build-heading">
  <h2 id="build-heading">Build system</h2>
  <p>We use AI as a tool to support our creativity, helping us explore ideas, learn unfamiliar techniques, and develop Starbase 430. We bring the interests, experiences, and judgment that give the site its character, and we review the work and take responsibility for what we publish.</p>
  <p>We build Starbase 430 as a static website with Eleventy. Markdown holds the written content, Nunjucks templates provide the shared page structure, and npm manages the project dependencies and build commands.</p>
</section>

<section class="content-section" aria-labelledby="design-heading">
  <h2 id="design-heading">Design approach</h2>
  <p>Starbase 430 takes the shape of a small outpost on the independent web. Green accents, silver borders, rounded frames, and dark reading panels give it the feel of a workshop with a view of space. Small labels and numbered chapter links add a little instrument-panel character while keeping the words and projects at the center.</p>
  <p>Soft nebula colors and dense stars provide the backdrop. CSS gradients create it without background image downloads or animation, and the text uses system fonts already available on your device.</p>
  <p>The layout adapts to the space available. Chapter links sit beside longer pages when there’s room and move into the normal reading flow on smaller screens. Ordinary links and clear headings keep finding your way around straightforward.</p>
</section>

<section class="content-section content-section--silver" aria-labelledby="site-button-heading">
  <h2 id="site-button-heading">Site button</h2>
  <p>Use this 88-by-31-pixel button when linking to Starbase 430 from another website.</p>
  <figure class="site-button">
    <img src="/assets/images/starbase430-88x31.png" alt="Starbase 430" width="88" height="31">
    <figcaption>
      <a class="site-button__download" href="/assets/images/starbase430-88x31.png" download>Download the PNG button</a>
    </figcaption>
  </figure>
</section>

<section class="content-section" aria-labelledby="accessibility-heading">
  <h2 id="accessibility-heading">Accessibility and resilience</h2>
  <p>We want Starbase 430 to be comfortable to read and straightforward to explore. Reading and navigation work without JavaScript, keyboard focus stays visible, and layouts adapt to the space available. Optional interactive illustrations use JavaScript, with static alternatives available.</p>
  <p>We also design for reduced-motion preferences and readable content when stylesheets are unavailable. WCAG 2.2 AA guides our accessibility work, and our review is still in progress.</p>
</section>

<section class="content-section" aria-labelledby="privacy-heading">
  <h2 id="privacy-heading">Privacy</h2>
  <p>We don’t include advertising, analytics, or tracking pixels. Images, stylesheets, and other assets load from the same host as the site, so reading a page doesn’t require requests to third-party services. External links connect to other websites when you choose to follow them.</p>
</section>

<section class="content-section" aria-labelledby="feeds-heading">
  <h2 id="feeds-heading">Follow via RSS</h2>
  <p>Add the <a href="/feed.xml">Starbase 430 RSS feed</a> to your RSS reader to receive complete new Log entries. The feed keeps the 20 most recent published entries.</p>
</section>

<section class="content-section" aria-labelledby="rights-heading">
  <h2 id="rights-heading">Code and content rights</h2>
  <p>The reusable code behind Starbase 430 is licensed under the MIT License. You can use, adapt, and share it, including commercially, as long as you keep the copyright and license notices required by that license.</p>
  <p>The code license doesn’t include our writing, photographs, artwork, or identity assets. Unless another creator is credited or separate permission is stated, our original content is copyright Sam and Brea, with reuse rights reserved. Work by other creators retains its own permissions and credits. You’re welcome to use our site button to link here.</p>
</section>

<section class="content-section" aria-labelledby="log-timestamps-heading">
  <h2 id="log-timestamps-heading">Log timestamps</h2>
  <p>Published entries carry a STARBASE LOG label in First Step Epoch (FSE) time, inspired by AEA: megaseconds since July 21, 1969, at 02:56:15 UTC. The label uses the entry’s publication timestamp converted to International Atomic Time (TAI), with six decimal places displaying completed whole SI seconds. Historical UTC–TAI offsets, including pre-1972 rate adjustments and later leap seconds, are applied at build time. An ordinary calendar date appears alongside the byline.</p>
</section>
