import { buildContentRoute } from "../_lib/content-routes.js";

export default {
  layout: "layouts/log-entry.njk",
  contentSection: "log",
  navKey: "log",
  tags: ["log"],
  feedCategory: "Log",
  eleventyComputed: {
    permalink(data) {
      if (data.eleventyExcludeFromCollections) {
        return "/log/";
      }

      return buildContentRoute("log", data.slug, data.page?.inputPath);
    }
  }
};
