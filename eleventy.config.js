import { createHash } from "node:crypto";
import { externalLinks } from "./src/_lib/external-links.js";
import { readFileSync } from "node:fs";
import { fseTimestamp } from "./src/_lib/fse.js";
import { polargraphFeedFallback } from "./src/_lib/polargraph-feed.js";
import pluginRss from "@11ty/eleventy-plugin-rss";
import { readingLayout } from "./src/_lib/reading-layout.js";

import { validateContentRoutes } from "./src/_lib/content-routes.js";
import { validateXml, escapeXml, safeCdata } from "./src/_lib/feed-xml.js";

const authors = JSON.parse(
  readFileSync(new URL("./src/_data/authors.json", import.meta.url), "utf8")
);

const site = JSON.parse(
  readFileSync(new URL("./src/_data/site.json", import.meta.url), "utf8")
);

const publicationTimestampPattern =
  /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})([+-]\d{2}:\d{2})$/;

const originalProjectDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/;

const readableDateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: site.timeZone
});

const localDateFormatter = new Intl.DateTimeFormat("en-US", {
  calendar: "gregory",
  day: "2-digit",
  month: "2-digit",
  numberingSystem: "latn",
  timeZone: site.timeZone,
  year: "numeric"
});

const localTimestampFormatter = new Intl.DateTimeFormat("en-US", {
  calendar: "gregory",
  day: "2-digit",
  hour: "2-digit",
  hourCycle: "h23",
  minute: "2-digit",
  month: "2-digit",
  numberingSystem: "latn",
  second: "2-digit",
  timeZone: site.timeZone,
  timeZoneName: "longOffset",
  year: "numeric"
});

const originalProjectDateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC"
});

const projectStatusLabels = {
  active: "Active",
  archived: "Archived",
  complete: "Complete",
  draft: "Draft",
  paused: "Paused"
};

function assertTextField(item, field, contentType) {
  if (typeof item.data[field] !== "string" || item.data[field].trim() === "") {
    throw new Error(
      `${contentType} ${item.inputPath} requires a non-empty \"${field}\" value.`
    );
  }
}

function getDateParts(formatter, date) {
  return Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, value])
  );
}

function getTimeZoneOffset(timeZoneName) {
  if (timeZoneName === "GMT" || timeZoneName === "UTC") {
    return "+00:00";
  }

  const match = /^GMT([+-]\d{2}:\d{2})$/.exec(timeZoneName);

  if (!match) {
    throw new Error(
      `Could not determine the UTC offset for ${site.timeZone}.`
    );
  }

  return match[1];
}

export function validatePublicationTimestamp(
  dateValue,
  inputPath = "A content item"
) {
  if (typeof dateValue !== "string") {
    throw new Error(
      `${inputPath} requires a quoted ISO 8601 date with an explicit offset, ` +
        `for example "2026-07-15T09:00:00-04:00".`
    );
  }

  const timestampMatch = publicationTimestampPattern.exec(dateValue);

  if (!timestampMatch) {
    throw new Error(
      `${inputPath} requires a date in YYYY-MM-DDTHH:mm:ss±HH:MM format. ` +
        `Received "${dateValue}".`
    );
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.valueOf())) {
    throw new Error(`${inputPath} has an invalid date "${dateValue}".`);
  }

  const localParts = getDateParts(localTimestampFormatter, parsedDate);
  const suppliedOffset = timestampMatch[3];
  const expectedOffset = getTimeZoneOffset(localParts.timeZoneName);

  if (suppliedOffset !== expectedOffset) {
    throw new Error(
      `${inputPath} uses UTC offset ${suppliedOffset}, but ${site.timeZone} ` +
        `observes ${expectedOffset} at that instant. Check daylight-saving time.`
    );
  }

  const suppliedLocalTimestamp = `${timestampMatch[1]}T${timestampMatch[2]}`;
  const actualLocalTimestamp =
    `${localParts.year}-${localParts.month}-${localParts.day}` +
    `T${localParts.hour}:${localParts.minute}:${localParts.second}`;

  if (suppliedLocalTimestamp !== actualLocalTimestamp) {
    throw new Error(
      `${inputPath} uses a nonexistent or invalid local time ` +
        `"${suppliedLocalTimestamp}" in ${site.timeZone}.`
    );
  }

  return parsedDate;
}

export function formatHtmlDate(dateValue) {
  const localParts = getDateParts(localDateFormatter, new Date(dateValue));
  return `${localParts.year}-${localParts.month}-${localParts.day}`;
}

export function formatReadableDate(dateValue) {
  return readableDateFormatter.format(new Date(dateValue));
}

export function formatRfc822Utc(dateValue) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.valueOf())) {
    throw new Error(`Cannot format invalid RSS date "${dateValue}".`);
  }

  return date.toUTCString();
}

export function validateOriginalProjectDate(
  dateValue,
  inputPath = "A Log entry"
) {
  if (dateValue === undefined) {
    return undefined;
  }

  if (typeof dateValue !== "string") {
    throw new Error(
      `${inputPath} requires "originalProjectDate" to be a quoted ` +
        `YYYY-MM-DD value.`
    );
  }

  const match = originalProjectDatePattern.exec(dateValue);

  if (!match) {
    throw new Error(
      `${inputPath} requires "originalProjectDate" in YYYY-MM-DD format. ` +
        `Received "${dateValue}".`
    );
  }

  const [, year, month, day] = match;
  const parsedDate = new Date(`${dateValue}T00:00:00Z`);

  if (
    Number.isNaN(parsedDate.valueOf()) ||
    parsedDate.getUTCFullYear() !== Number(year) ||
    parsedDate.getUTCMonth() + 1 !== Number(month) ||
    parsedDate.getUTCDate() !== Number(day)
  ) {
    throw new Error(
      `${inputPath} has a nonexistent or invalid "originalProjectDate" ` +
        `value "${dateValue}".`
    );
  }

  return parsedDate;
}

export function formatOriginalProjectDate(dateValue) {
  return originalProjectDateFormatter.format(
    validateOriginalProjectDate(dateValue)
  );
}

function validateContentItem(item, contentType) {
  assertTextField(item, "title", contentType);
  assertTextField(item, "description", contentType);
  assertTextField(item, "author", contentType);

  if (!Object.hasOwn(authors, item.data.author)) {
    throw new Error(
      `${contentType} ${item.inputPath} uses unknown author \"${item.data.author}\". ` +
        `Expected one of: ${Object.keys(authors).join(", ")}.`
    );
  }

  if (!Object.hasOwn(item.data, "date")) {
    throw new Error(
      `${contentType} ${item.inputPath} requires an explicit publication date.`
    );
  }

  const parsedPublicationDate = validatePublicationTimestamp(
    item.data.date,
    `${contentType} ${item.inputPath}`
  );

  if (
    !(item.date instanceof Date) ||
    Number.isNaN(item.date.valueOf()) ||
    item.date.valueOf() !== parsedPublicationDate.valueOf()
  ) {
    throw new Error(
      `${contentType} ${item.inputPath} did not resolve to its publication date.`
    );
  }

  if (item.data.status !== undefined && !Object.hasOwn(projectStatusLabels, item.data.status)) {
    throw new Error(
      `${contentType} ${item.inputPath} uses unsupported status \"${item.data.status}\". ` +
        `Expected one of: ${Object.keys(projectStatusLabels).join(", ")}.`
    );
  }

  return item;
}

function newestFirst(first, second) {
  return second.date - first.date;
}

function getLogEntries(collectionApi) {
  const entries = collectionApi.getFilteredByTag("log").map((item) => {
    validateContentItem(item, "Log entry");
    validateOriginalProjectDate(item.data.originalProjectDate, `Log entry ${item.inputPath}`);
    return item;
  });
  return validateContentRoutes(entries, "log", "Log entry").toSorted(newestFirst);
}

export default function configureEleventy(eleventyConfig) {
  // Refresh cached styles whenever their content changes, including in previews.
  eleventyConfig.addGlobalData("siteCssVersion", () => createHash("sha256")
    .update(readFileSync(new URL("./src/assets/css/site.css", import.meta.url)))
    .digest("hex").slice(0, 8));
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addFilter("polargraphFeedFallback", polargraphFeedFallback);
  eleventyConfig.addFilter("readingLayout", readingLayout);
  eleventyConfig.addFilter("externalLinks", externalLinks);
  eleventyConfig.addFilter("fseTimestamp", fseTimestamp);
  // Resolve feed URLs before Eleventy's base transform, which otherwise drops
  // search parameters from page-relative URLs. Ordinary page output is unchanged.
  eleventyConfig.htmlTransformer.addUrlTransform("html", function (url) {
    return new URL(url.trim(), new URL(this.url, this.baseHref)).href;
  }, {
    priority: 0,
    enabled: (context) => Boolean(context.baseHref)
  });
  eleventyConfig.ignores.add("src/_draft-assets/**");
  eleventyConfig.ignores.add("src/assets/illustrations/**");
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/assets/icons/favicon.ico": "favicon.ico" });
  if (process.env.ELEVENTY_RUN_MODE !== "build") {
    eleventyConfig.addPassthroughCopy({ "src/_draft-assets": "assets/drafts" });
  }
  eleventyConfig.addWatchTarget("src/_draft-assets/");

  eleventyConfig.addPreprocessor("drafts", "*", (data) => {
    if (data.draft !== undefined && typeof data.draft !== "boolean") {
      throw new Error(
        `${data.page?.inputPath ?? "A template"} has a non-boolean draft value.`
      );
    }

    if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
      return false;
    }
  });

  eleventyConfig.addCollection("logEntries", (collectionApi) => {
    return getLogEntries(collectionApi);
  });

  eleventyConfig.addFilter("htmlDateString", formatHtmlDate);
  eleventyConfig.addFilter("readableDate", formatReadableDate);
  eleventyConfig.addFilter("rfc822DateUtc", formatRfc822Utc);
  eleventyConfig.addFilter(
    "readableOriginalProjectDate",
    formatOriginalProjectDate
  );

  eleventyConfig.addFilter("projectStatusLabel", (status) => {
    return projectStatusLabels[status] ?? status;
  });

  eleventyConfig.addFilter("take", (items, limit) => {
    return Array.isArray(items) ? items.slice(0, limit) : [];
  });

  eleventyConfig.addFilter("xmlValidate", validateXml);
  eleventyConfig.addFilter("xmlEscape", escapeXml);
  eleventyConfig.addFilter("cdataSafe", safeCdata);
}

export const config = {
  dir: {
    input: "src",
    includes: "_includes",
    data: "_data",
    output: "_site"
  },
  markdownTemplateEngine: "njk"
};
