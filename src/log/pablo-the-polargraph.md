---
title: "Pablo the Polargraph: an art robot built to start conversations"
slug: pablo-the-polargraph
description: Revisiting Pablo, an art robot we built at Knox Makers, and the tinkering and teamwork that turned an odd idea into years of art and conversation.
date: "2026-11-07T11:20:45-05:00"
originalProjectDate: "2014-04-24"
author: sam
status: complete
draft: false
---

One of the reasons I created this new website is to help get me back into the habit of doing larger projects. My wife and I have been working through some serious health issues for the last several years, and I've kind of gotten out of the habit of creating things. That's a shame, because playing the role of crazy inventor has always been one of my great joys in life.

It never really seemed to matter what I was creating. Duct-taping old office chairs together into the jankiest soapbox derby car ever, baking over-the-top cakes for my family and friends, and playing with robotics and programming all seem to scratch the same deep-seated desire to bring something new to life. The more bizarre and interesting, the better.

Pablo the Polargraph is a great example of this. I want to revisit what it took to create it as a reminder of the kind of projects I want to start making again.

Pablo began during the early days of Knox Makers, while we were still located in Oak Ridge near ORNL. The number of new members had plateaued, and we were looking for ways to introduce more people to the makerspace. We'd been discussing taking interactive exhibits to local craft and science events to show people what a makerspace could offer. We really needed something easily portable that would catch someone’s eye and give them a reason to stop and talk.

While randomly surfing the web, I stumbled upon an article about a [Polargraph Drawing Machine on Instructables](https://www.instructables.com/Polargraph-Drawing-Machine/) and just had to build an art robot. A robot drawing pictures seemed like a fantastic conversation starter.

## Getting something moving

A polargraph moves a pen across a drawing surface by changing the length of
two suspended lines. Pablo used ball chain driven by two stepper motors, with
an Arduino running the motor-control software.

I started mostly on my own, and there wasn’t much interest at first. That
changed once I had something physically sitting in the makerspace. Having an
actual contraption to poke at gave people a reason to wander over and get
involved.

Our first group working session was April 11, 2014. I’d spent several weeks
pushing the idea forward and doing much of the early work solo. That session
was when other Knox Makers members really started helping turn it into a
finished machine.

<figure class="project-photo project-photo--compact">
  <picture>
    <source type="image/avif" srcset="/assets/images/pablo/pablo-working-session-480.avif">
    <img src="/assets/images/pablo/pablo-working-session-320.webp" alt="Four people gather around a workshop table, with Pablo’s freshly painted white panel and frame laid flat in front of them." width="320" height="237" loading="lazy" decoding="async">
  </picture>
  <figcaption>Toby, James, Devin, and Sam (left to right) putting the finishing touches on Pablo’s drawing surface and frame at Knox Makers, April 11, 2014. First names only, to protect the guilty.</figcaption>
</figure>

Only a few parts of that early prototype lasted through the final version,
including the stepper motors and the ball chain. Other parts needed a lot more work.

The first printed drive gears slipped against the chain. We went through what
I remember as three or four versions before finding a shape that worked
reliably with ordinary ball chain from a home-improvement store.

We also added weights to keep the chain engaged with the gears. At first, we
used fishing weights or whatever suitable weights we could find. Later, I
replaced those with heavier decorative ceiling-fan pull-chain weights. They
helped stabilize the mechanism and looked much more polished.

## Learning to lift the pen

The first pen holder was a clear plastic spacer disc from a package of
writable CDs. Being able to see through it was handy. Unfortunately, it
couldn’t lift the pen off the paper, so every drawing had to be one continuous
line. That became a pretty significant limitation almost immediately.

Looking at other Polargraph projects gave us the solution: a small servo to lift
the pen. We connected one to the Arduino and added control over when the pen
touched the paper. That let Pablo move between separate lines without drawing
a connection between them.

I remember using GIMP to prepare the images. By the time we had it working
well, preparing a new image was fairly quick and required few extra steps.
There’s no way I could walk someone through the whole software setup from memory now.

Pablo itself worked at a more leisurely pace. A drawing usually took a few
minutes.

## Becoming Pablo

Moving the prototype around made it clear that it needed a stand.

The drawing surface was a large piece of plywood with embedded magnets to
hold the paper. Putting it on a wooden artist’s easel was the point where it
really became Pablo. The easel also gave us a theme
for the whole project. It looked like a robotic artist, so we committed to
the idea with white paint and vinyl graphics identifying Pablo and Knox Makers.

The easel, lettering, and finished surface brought the separate components
together into something that felt ready to exhibit.

By April 24, 2014, the first complete working version had taken on Pablo’s
full form. There were smaller updates afterward, but that was the point when
it became the finished machine I remember.

<figure class="project-photo project-photo--compact">
  <picture>
    <source type="image/avif" srcset="/assets/images/pablo/pablo-01-480.avif">
    <img src="/assets/images/pablo/pablo-01-320-fallback.webp" alt="Pablo stands on a wooden artist’s easel. Two diagonal ball chains suspend a pen holder over paper bearing a line portrait of Nikola Tesla." width="320" height="511" loading="lazy" decoding="async">
  </picture>
  <figcaption>The completed art robot Pablo the Polargraph drawing a portrait of Nikola Tesla.</figcaption>
</figure>

## Finding an audience

Pablo had mixed results at general craft fairs. Some people noticed it and
came over to talk, but it attracted much more interest at events focused on
technology and making.

One of the first strong responses I remember was at a mini Maker Faire at
Pellissippi State. We were exhibiting beside a makerspace member demonstrating 3D
scanning and a local library developing its own maker activities.

I think that setting helped. Visitors could see a group of related exhibits,
and Pablo’s polished appearance gave them something approachable to stop and
watch.

Those were the events where Pablo did what we’d hoped: gave people something
interesting to watch while we talked about Knox Makers.

## Why I’m revisiting it

Pablo is one of the projects I’m most proud of because of how finished it
became and how long it lasted.

I’ve built plenty of small electronics and robotics projects over the years.
Many had useful lives measured in months. Pablo was sturdy enough to move
between events, and we took it around for at least seven or eight years.
Throughout that time, it kept doing its job: sitting at an easel, making art,
and attracting attention.

I still need to check where it is today and when it was last used. This
account comes from my recollections and the photographs I kept, so some
details remain uncertain. Although I’ve now found the original inspiration,
I no longer remember exactly which design details or instructions we used.

That’s what I wanted to revisit: an odd idea that became something useful,
with help from other people and a lot of tinkering. It kept making art for
years. I’d like to get back to making things that give me that same feeling.

## Interactive simulation

{% include "partials/pablo-interactive-link.njk" %}

## Further reading

- [Polargraph Drawing Machine on Instructables](https://www.instructables.com/Polargraph-Drawing-Machine/): the article that originally inspired me.
- [Polargraph software and hardware designs on GitHub](https://github.com/euphy/polargraph): the related repository from that original inspiration.
