---
title: "First Step Epoch: a real-world stardate"
slug: first-step-epoch
description: "Humanity’s first step on the Moon began a new chapter in our history. First Step Epoch is my proposal for a stardate-inspired timekeeping system that counts every second since that moment."
date: "2026-11-12T14:44:34-05:00"
author: sam
status: active
draft: false
aeaPage: true
---

> “Captain's log, stardate 41153.7. Our destination is planet Deneb Four, beyond which lies the great unexplored mass of the galaxy...”
>
> Jean-Luc Picard, *Star Trek: The Next Generation*, [“Encounter at Farpoint”](https://www.startrek.com/news/encounter-at-farpoint-an-oral-history)

A captain, a destination, and a timestamp from the future. Each log entry felt like a page from a history we hadn’t lived yet.

For our Starbase 430 Mission Log entries, I wanted some of that same feeling. I found my starting point in [The Dragon De Monsyne’s explanation of After Epoch Astronauticum, or AEA](https://web.archive.org/web/20251124202245/http://transform.to/~dragondm/aea.html). I’ve built on their idea with my own proposal: First Step Epoch.

## From AEA to First Step Epoch

An epoch gives a timekeeping system its starting point. Choosing that point was the first decision I needed to make.

The Dragon De Monsyne drew inspiration from Apollo 11 but counted AEA from **January 1, 1970 at 00:00:00 GMT**, the Unix epoch.

I considered several milestones for FSE: the first atomic bomb detonation, Sputnik’s launch, Laika’s flight and tragic loss, Belka and Strelka’s safe return, or Yuri Gagarin’s historic orbit.

In the end, my choice was personal. I was born a few months before Apollo 11 launched and grew up as an American kid idolizing the Apollo crews. Armstrong’s first step captured the optimistic future I wanted Starbase 430 to reflect.

I set First Step Epoch’s zero to **July 21, 1969 at 02:56:15 UTC**, marking [Armstrong’s first step onto the Moon](https://commons.wikimedia.org/wiki/File:Apollo_11_Landing_-_first_steps_on_the_moon.ogv).

<figure class="project-photo fse-insignia" id="apollo11-insignia">
  <a href="https://en.wikipedia.org/wiki/Apollo_11">
    <picture>
      <source type="image/avif" srcset="/assets/images/fse/apollo11-insignia-320.avif">
      <img src="/assets/images/fse/apollo11-insignia-320.webp" alt="Apollo 11 mission insignia: an eagle carries an olive branch above the lunar surface, with Earth in the black sky and APOLLO 11 across the top. Read about Apollo 11 on Wikipedia." width="320" height="323" loading="lazy" decoding="async">
    </picture>
  </a>
  <figcaption>Apollo 11 mission insignia. Image: <a href="https://commons.wikimedia.org/wiki/File:Apollo_11_insignia.png">NASA, via Wikimedia Commons</a>. <a href="https://en.wikipedia.org/wiki/Apollo_11">About the Apollo 11 mission</a>.</figcaption>
</figure>

## Getting a feel for the units

FSE counts [seconds](https://www.bipm.org/en/si-base-units/second). To make the numbers more manageable, I used [metric prefixes](https://www.bipm.org/en/measurement-units/si-prefixes), the same idea as grouping a thousand meters into a kilometer:

- **1 kilosecond (ks):** 1,000 seconds, or 16 minutes and 40 seconds.
- **100 ks:** about 27.8 hours.
- **1 megasecond (Ms):** about 11.6 days.
- **10 Ms:** about 115.7 days.
- **1 gigasecond (Gs):** about 31.7 years.

These comparisons helped me get a feel for the scale. A megasecond is about a week and a half, while a gigasecond is roughly a generation. I chose megaseconds for the Log labels because the longer whole-number count feels closer to the science-fiction timestamps that inspired them. Six decimal places let each label record individual seconds.

The units don’t depend on Earth’s rotation or orbit, so they would still be useful somewhere with a different day or year. We’re counting familiar seconds, just grouping them differently.

## Reading a Starbase Log label

The [Pablo retrospective](/log/pablo-the-polargraph/) carries this label:

**STARBASE LOG +1808.227499 Ms FSE**

- **+** places the timestamp after our epoch; earlier dates get a minus sign.
- **1808.227499** is the elapsed count, equivalent to 1,808,227,499 completed seconds.
- **Ms** means megaseconds: units of one million seconds.
- **Six decimal places** give the count one-second resolution.
- **FSE** identifies the starting point: Armstrong’s first step onto the Moon.

For Pablo, that means **November 7, 2026 at 11:20:45 a.m. in New York**, or **16:20:45 UTC**. I kept the familiar calendar date in the byline so readers don’t need to do any arithmetic.

## Working with the numbers

### Finding the interval between two entries

To find the time between two entries, I can simply subtract their FSE timestamps. The [website-development entry](/log/building-starbase-430-for-the-small-web/) has **+1808.058619 Ms FSE**, and the [Pablo retrospective](/log/pablo-the-polargraph/) has **+1808.227499 Ms FSE**:

**1808.227499 − 1808.058619 = 0.168880 Ms**

Multiplying by a million gives **168,880 seconds**, or **46 hours, 54 minutes, and 40 seconds**, between their publication timestamps. Both labels use the same time scale and starting point, so there are no month lengths or time-zone changes to account for.

### Counting every second

I wanted FSE to count every elapsed second, including leap seconds. That meant I couldn’t simply subtract two ordinary [Unix timestamps](https://www.gnu.org/software/recutils/manual/html_node/Seconds-since-the-Epoch.html), because Unix time leaves leap seconds out of its count.

Instead, I used **[International Atomic Time, or TAI](https://www.bipm.org/en/time-department)**, a continuous time scale based on atomic-clock measurements. UTC, the reference behind our everyday calendar dates, has included leap-second adjustments to stay close to Earth’s rotation. TAI gives FSE a continuous count through those adjustments.

The calculation is:

**FSE seconds = TAI at the event − TAI at our chosen epoch**

To calculate an FSE timestamp, I:

1. Convert the event’s time and our epoch to TAI.
2. Subtract the epoch from the event’s time to get elapsed seconds.
3. Divide by **1,000,000** to express the result in megaseconds.

<details>
<summary>Worked calculation and historical precision</summary>

<p>Here’s how the <a href="/log/pablo-the-polargraph/">Pablo retrospective’s</a> publication date became its FSE label.</p>

<ol>
<li>
<p><strong>Start with the publication time.</strong> Pablo’s timestamp is November 7, 2026 at 11:20:45 a.m. in New York, equivalent to <strong>2026-11-07 16:20:45 UTC</strong>.</p>
</li>
<li>
<p><strong>Express both instants in TAI.</strong> At Pablo’s publication time, TAI was 37 seconds ahead of UTC, giving <strong>2026-11-07 16:21:22 TAI</strong>.</p>
<p>Our epoch, July 21, 1969 at 02:56:15 UTC, becomes <strong>1969-07-21 02:56:22.575311250 TAI</strong>. This is the same instant expressed on a different time scale, not a change to our starting point.</p>
<p>The offsets differ because UTC’s relationship to TAI changed over time. Before 1972, it included fractional offsets and rate adjustments. I used the <a href="https://hpiers.obspm.fr/iers/bul/bulc/UTC-TAI.history">IERS historical conversion data</a> for both instants rather than just adding up later leap seconds.</p>
</li>
<li>
<p><strong>Subtract the epoch.</strong> The interval between those two TAI instants is <strong>1,808,227,499.424688750 seconds</strong>.</p>
</li>
<li>
<p><strong>Convert to megaseconds.</strong> Dividing by 1,000,000 gives <strong>1808.227499424688750 Ms</strong>.</p>
</li>
<li>
<p><strong>Format the label.</strong> Dropping the digits after the sixth decimal place, without rounding, gives <strong>STARBASE LOG +1808.227499 Ms FSE</strong>.</p>
</li>
</ol>

<p>The calculation retains fractional seconds internally, but the label displays completed whole seconds. That is its display resolution, not a claim that we know the time of every historical event that precisely.</p>

<p>For timeline dates known only to a day or minute, I treat that whole interval as a window of uncertainty. I round the FSE value only as finely as gives the same result throughout that window, then mark it with ≈ and italics. Documented second-level times keep six decimal places without an approximation mark.</p>

<p>On the wide timeline, five-year labels show a uniform elapsed-time scale. A day-only marker sits at the center of its calendar day for placement; that does not imply the event happened at noon. I use a UTC calendar-day comparison window, which does not establish the original event’s time zone. On smaller screens, the cards stay in chronological order but their spacing is adjusted for readability.</p>

<p>Belka and Strelka’s return predates the historical UTC conversion data I use for publication dates. Its timeline value uses the <a href="https://eclipse.gsfc.nasa.gov/SEcat5/deltatpoly.html">NASA historical Delta-T estimate</a> to reconstruct an approximate atomic-rate time coordinate. I round these pre-1961 estimates to whole megaseconds; they are never used for precise Log labels.</p>

<p>This gives FSE the continuous count I wanted, using an Earth-based time reference. A clock traveling elsewhere could accumulate a different elapsed time, so I’m not treating it as a universal clock for every observer.</p>

</details>

## A timeline of scientific discovery

These milestones give the FSE count a human scale, tracing exploration and scientific discovery from the early space age to today. Familiar achievements become reference points for reading the numbers.

Each card starts with its FSE timestamp and ends with the familiar calendar date. Italic values marked ≈ are approximate; their precision reflects what the historical sources document.

On wider screens, the timeline shows elapsed time proportionally. On smaller screens, the cards form a compact chronological list, with spacing adjusted for readability.

<!-- science-timeline:start -->
<div class="science-timeline science-planning">
<div class="science-axis" aria-hidden="true">
<span class="science-year science-tick" style="--year:0.000%">1960</span>
<span class="science-year science-tick" style="--year:7.481%">1965</span>
<span class="science-year science-tick" style="--year:14.958%">1970</span>
<span class="science-year science-tick" style="--year:22.435%">1975</span>
<span class="science-year science-tick" style="--year:29.912%">1980</span>
<span class="science-year science-tick" style="--year:37.393%">1985</span>
<span class="science-year science-tick" style="--year:44.869%">1990</span>
<span class="science-year science-tick" style="--year:52.346%">1995</span>
<span class="science-year science-tick" style="--year:59.823%">2000</span>
<span class="science-year science-tick" style="--year:67.304%">2005</span>
<span class="science-year science-tick" style="--year:74.781%">2010</span>
<span class="science-year science-tick" style="--year:82.258%">2015</span>
<span class="science-year science-tick" style="--year:89.735%">2020</span>
<span class="science-year science-tick" style="--year:97.216%">2025</span>
</div>
<ol class="science-slots" role="list">
<li class="science-slot event-left science-event" id="science-event-1" style="top:0.952010%;--anchor:13.92%"><div class="science-card"><p class="science-event-fse"><em><span aria-hidden="true">≈</span><span class="sr-only"> Approximately</span> -281 Ms FSE</em></p><p class="science-event-title"><strong><a href="https://en.wikipedia.org/wiki/Belka_and_Strelka">First animals return safely from orbit</a></strong></p><p class="science-event-summary">Belka and Strelka return alive from Earth orbit, demonstrating that animals could survive the journey into space and back.</p><p class="science-event-date"><time datetime="1960-08-20">August 20, 1960</time></p></div></li>
<li class="science-slot event-right science-event" id="science-event-2" style="top:1.913254%;--anchor:35.34%"><div class="science-card"><p class="science-event-fse"><em><span aria-hidden="true">≈</span><span class="sr-only"> Approximately</span> -261.089 Ms FSE</em></p><p class="science-event-title"><strong><a href="https://www.esa.int/About_Us/50_years_of_ESA/50_years_of_humans_in_space/The_flight_of_Vostok_1">First human in space</a></strong></p><p class="science-event-summary">Yuri Gagarin orbits Earth aboard Vostok 1, opening the era of human spaceflight.</p><p class="science-event-date">Launched <time datetime="1961-04-12T06:07Z">April 12, 1961 · 06:07 UTC</time></p></div></li>
<li class="science-slot event-left science-event" id="science-event-3" style="top:8.224142%;--anchor:10.52%"><div class="science-card"><p class="science-event-fse"><em><span aria-hidden="true">≈</span><span class="sr-only"> Approximately</span> -128 Ms FSE</em></p><p class="science-event-title"><strong><a href="https://en.wikipedia.org/wiki/Discovery_of_cosmic_microwave_background_radiation">The Big Bang’s afterglow discovered</a></strong></p><p class="science-event-summary">Penzias and Wilson identify the cosmic microwave background, providing powerful evidence that the universe began in a hot, dense state.</p><p class="science-event-date">Published <time datetime="1965-07-01">July 1, 1965</time></p></div></li>
<li class="science-slot event-right science-event" id="science-event-4" style="top:14.286800%;--anchor:50%"><div class="science-card"><p class="science-event-fse">+0.000000 Ms FSE</p><p class="science-event-title"><strong><a href="https://airandspace.si.edu/explore/stories/apollo-missions/apollo-11-moon-landing/apollo-11-timeline">First step on the Moon</a></strong></p><p class="science-event-summary">Armstrong steps onto another world, setting FSE’s zero point.</p><p class="science-event-date"><time datetime="1969-07-21T02:56:15Z">July 21, 1969 · 02:56:15 UTC</time></p></div></li>
<li class="science-slot event-left science-event" id="science-event-5" style="top:19.373925%;--anchor:50%"><div class="science-card"><p class="science-event-fse"><em><span aria-hidden="true">≈</span><span class="sr-only"> Approximately</span> +107 Ms FSE</em></p><p class="science-event-title"><strong><a href="https://www.nasa.gov/history/50-years-ago-apollo-17-heads-home-to-earth/">Most recent person to walk on the Moon</a></strong></p><p class="science-event-summary">Gene Cernan reenters Apollo 17’s lunar module after the final moonwalk of the Apollo era.</p><p class="science-event-date"><time datetime="1972-12-14">December 14, 1972</time></p></div></li>
<li class="science-slot event-right science-event" id="science-event-6" style="top:22.281140%;--anchor:50%"><div class="science-card"><p class="science-event-fse"><em><span aria-hidden="true">≈</span><span class="sr-only"> Approximately</span> +169 Ms FSE</em></p><p class="science-event-title"><strong><a href="https://en.wikipedia.org/wiki/Lucy_(hominid)">Lucy sheds light on human origins</a></strong></p><p class="science-event-summary">A 3.2-million-year-old skeleton discovered in Ethiopia provides remarkable evidence of how our early relatives walked upright.</p><p class="science-event-date">Discovered <time datetime="1974-11-24">November 24, 1974</time></p></div></li>
<li class="science-slot event-left science-event" id="science-event-7" style="top:27.763902%;--anchor:50%"><div class="science-card"><p class="science-event-fse"><em><span aria-hidden="true">≈</span><span class="sr-only"> Approximately</span> +284 Ms FSE</em></p><p class="science-event-title"><strong><a href="https://www.nobelprize.org/prizes/medicine/2010/press-release/">First child born through IVF</a></strong></p><p class="science-event-summary">Louise Brown’s birth demonstrates that fertilization outside the body can lead to a successful pregnancy, opening a new chapter in reproductive medicine.</p><p class="science-event-date"><time datetime="1978-07-25">July 25, 1978</time></p></div></li>
<li class="science-slot event-right science-event" id="science-event-8" style="top:30.437720%;--anchor:50%"><div class="science-card"><p class="science-event-fse"><em><span aria-hidden="true">≈</span><span class="sr-only"> Approximately</span> +340.8 Ms FSE</em></p><p class="science-event-title"><strong><a href="https://www.who.int/publications/i/item/WHA33-3">Smallpox declared eradicated</a></strong></p><p class="science-event-summary">Vaccination, surveillance, and international cooperation eliminate a devastating human disease, demonstrating what a worldwide scientific effort can achieve.</p><p class="science-event-date">Declared <time datetime="1980-05-08">May 8, 1980</time></p></div></li>
<li class="science-slot event-left science-event" id="science-event-9" style="top:37.947343%;--anchor:50%"><div class="science-card"><p class="science-event-fse"><em><span aria-hidden="true">≈</span><span class="sr-only"> Approximately</span> +499 Ms FSE</em></p><p class="science-event-title"><strong><a href="https://www.bas.ac.uk/media/beyondtheice/discovering-a-hole-in-the-ozone-layer/">Antarctic ozone hole findings published</a></strong></p><p class="science-event-summary">British Antarctic Survey scientists reveal severe seasonal ozone loss above Antarctica, helping set the stage for international action to protect Earth’s atmosphere.</p><p class="science-event-date">Published <time datetime="1985-05-16">May 16, 1985</time></p></div></li>
<li class="science-slot event-right science-event" id="science-event-10" style="top:44.341839%;--anchor:50%"><div class="science-card"><p class="science-event-fse"><em><span aria-hidden="true">≈</span><span class="sr-only"> Approximately</span> +634.180 Ms FSE</em></p><p class="science-event-title"><strong><a href="https://science.nasa.gov/mission/voyager/voyager-2/">First close-up exploration of Neptune</a></strong></p><p class="science-event-summary">Voyager 2 reaches Neptune, revealing intricate rings, powerful storms, and an unexpectedly active moon, Triton.</p><p class="science-event-date">Closest approach <time datetime="1989-08-25T03:56Z">August 25, 1989 · 03:56 UTC</time></p></div></li>
<li class="science-slot event-left science-event" id="science-event-11" style="top:47.893293%;--anchor:50%"><div class="science-card"><p class="science-event-fse"><em><span aria-hidden="true">≈</span><span class="sr-only"> Approximately</span> +709 Ms FSE</em></p><p class="science-event-title"><strong><a href="https://www.nature.com/articles/355145a0">First planets confirmed beyond our Solar System</a></strong></p><p class="science-event-summary">Aleksander Wolszczan and Dale Frail report planets orbiting a pulsar, establishing that our Solar System is not the only planetary system.</p><p class="science-event-date">Published <time datetime="1992-01-09">January 9, 1992</time></p></div></li>
<li class="science-slot event-right science-event" id="science-event-12" style="top:54.604455%;--anchor:50%"><div class="science-card"><p class="science-event-fse"><em><span aria-hidden="true">≈</span><span class="sr-only"> Approximately</span> +851 Ms FSE</em></p><p class="science-event-title"><strong><a href="https://roslinfoundation.uk/dolly-the-sheep/">First mammal cloned from an adult cell</a></strong></p><p class="science-event-summary">Dolly’s birth demonstrates that the genetic material in a specialized adult cell can support the development of a whole animal, changing our understanding of cellular development.</p><p class="science-event-date">Born <time datetime="1996-07-05">July 5, 1996</time></p></div></li>
<li class="science-slot event-left science-event" id="science-event-13" style="top:63.878880%;--anchor:50%"><div class="science-card"><p class="science-event-fse"><em><span aria-hidden="true">≈</span><span class="sr-only"> Approximately</span> +1046 Ms FSE</em></p><p class="science-event-title"><strong><a href="https://www.sciencedaily.com/releases/2002/09/020923065358.htm">Exoplanet discoveries reach 100</a></strong></p><p class="science-event-summary">Astronomers announce a planet orbiting Tau¹ Gruis, bringing the reported tally to 100 and revealing a growing diversity of planetary systems.</p><p class="science-event-date">Announced <time datetime="2002-09-17">September 17, 2002</time></p></div></li>
<li class="science-slot event-right science-event" id="science-event-14" style="top:64.734666%;--anchor:50%"><div class="science-card"><p class="science-event-fse"><em><span aria-hidden="true">≈</span><span class="sr-only"> Approximately</span> +1060 Ms FSE</em></p><p class="science-event-title"><strong><a href="https://www.genome.gov/11006929/2003-release-international-consortium-completes-hgp">Human Genome Project completed</a></strong></p><p class="science-event-summary">An international collaboration completes a landmark human reference sequence, opening new ways to investigate biology, disease, and our shared ancestry.</p><p class="science-event-date">Announced <time datetime="2003-04-14">April 14, 2003</time></p></div></li>
<li class="science-slot event-left science-event" id="science-event-15" style="top:68.857997%;--anchor:0%"><div class="science-card"><p class="science-event-fse"><em><span aria-hidden="true">≈</span><span class="sr-only"> Approximately</span> +1150 Ms FSE</em></p><p class="science-event-title"><strong><a href="https://science.nasa.gov/mission/stardust/">First comet samples returned to Earth</a></strong></p><p class="science-event-summary">Stardust delivers dust collected from comet Wild 2, bringing material from an ancient Solar System body into laboratories on Earth.</p><p class="science-event-date">Returned <time datetime="2006-01-15">January 15, 2006</time></p></div></li>
<li class="science-slot event-right science-event" id="science-event-16" style="top:75.294816%;--anchor:50%"><div class="science-card"><p class="science-event-fse"><em><span aria-hidden="true">≈</span><span class="sr-only"> Approximately</span> +1287.3 Ms FSE</em></p><p class="science-event-title"><strong><a href="https://www.mpg.de/617258/pressRelease20100430">Ancient DNA reveals our Neanderthal connections</a></strong></p><p class="science-event-summary">Researchers reconstruct a draft Neanderthal genome, revealing evidence of interbreeding with modern humans and opening a new way to explore our shared past.</p><p class="science-event-date">Announced <time datetime="2010-05-06">May 6, 2010</time></p></div></li>
<li class="science-slot event-left science-event" id="science-event-17" style="top:80.478667%;--anchor:50%"><div class="science-card"><p class="science-event-fse"><em><span aria-hidden="true">≈</span><span class="sr-only"> Approximately</span> +1397 Ms FSE</em></p><p class="science-event-title"><strong><a href="https://iac.es/en/outreach/news/exoplanets-discover-number-1000">Exoplanet catalog reaches 1,000 worlds</a></strong></p><p class="science-event-summary">The Extrasolar Planets Encyclopaedia lists a thousand worlds, showing how rapidly exploration beyond our Solar System has expanded.</p><p class="science-event-date">Reported <time datetime="2013-10-23">October 23, 2013</time></p></div></li>
<li class="science-slot event-right science-event" id="science-event-18" style="top:83.307716%;--anchor:50%"><div class="science-card"><p class="science-event-fse">+1456.383298 Ms FSE</p><p class="science-event-title"><strong><a href="https://dcc-lho.ligo.org/LIGO-P150914/public">First direct detection of gravitational waves</a></strong></p><p class="science-event-summary">LIGO detects ripples from merging black holes, opening a new way to observe the universe.</p><p class="science-event-date">Detected <time datetime="2015-09-14T09:50:45Z">September 14, 2015 · 09:50:45 UTC</time></p></div></li>
<li class="science-slot event-left science-event" id="science-event-19" style="top:88.647531%;--anchor:50%"><div class="science-card"><p class="science-event-fse"><em><span aria-hidden="true">≈</span><span class="sr-only"> Approximately</span> +1569 Ms FSE</em></p><p class="science-event-title"><strong><a href="https://eventhorizontelescope.org/press-release-april-10-2019-astronomers-capture-first-image-black-hole">First image of a black hole released</a></strong></p><p class="science-event-summary">A worldwide network of radio telescopes reveals the shadow of the black hole in galaxy M87, turning an extraordinary prediction into an observable image.</p><p class="science-event-date">Released <time datetime="2019-04-10">April 10, 2019</time></p></div></li>
<li class="science-slot event-right science-event" id="science-event-20" style="top:93.829205%;--anchor:50%"><div class="science-card"><p class="science-event-fse">+1678.393118 Ms FSE</p><p class="science-event-title"><strong><a href="https://ntrs.nasa.gov/citations/20230015804">First asteroid-deflection demonstration</a></strong></p><p class="science-event-summary">DART impacts Dimorphos, demonstrating a technique for changing an asteroid’s orbit.</p><p class="science-event-date">Impact <time datetime="2022-09-26T23:14:24Z">September 26, 2022 · 23:14:24 UTC</time></p></div></li>
</ol>
</div>
<p class="science-endpoint"><time datetime="2026-11-12">November 12, 2026</time> · Timeline reference date · +1808.600654 Ms FSE</p>
<!-- science-timeline:end -->

## Following the trail

The Dragon De Monsyne’s page started this journey, and I’m grateful that the [archived explanation of AEA](https://web.archive.org/web/20251124202245/http://transform.to/~dragondm/aea.html) is still available. FSE is my own variation, but their idea gave me a different way to think about time.

If you’d like to explore further:

- [Atomic Rockets’ discussion of metric time](https://www.projectrho.com/public_html/rocket/futuremeasure.php#id--Measuring_Time--Metric_Time) connects alternative timekeeping with science fiction.
- [Wikipedia’s metric time article](https://en.wikipedia.org/wiki/Metric_time) introduces other ways to measure and organize time.
- [Armstrong’s first steps on the Moon](https://commons.wikimedia.org/wiki/File:Apollo_11_Landing_-_first_steps_on_the_moon.ogv) returns to the moment I chose as FSE’s starting point. The 62-second video includes captions.

The BIPM references earlier in this article explain the units and time scale, and each timeline heading links to its historical source.

For me, FSE connects an everyday habit with something that still inspires me. Every Log entry counts forward from humanity’s first step onto another world. I like having that reminder of what curiosity and determination can accomplish.
