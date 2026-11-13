const contentSections = new Set(["log"]);
const reservedSlugs = new Set(["feed", "index"]);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateContentSlug(slug, inputPath = "A content item") {
  if (typeof slug !== "string" || slug.length === 0) {
    throw new Error(`${inputPath} requires an explicit slug.`);
  }

  if (!slugPattern.test(slug)) {
    throw new Error(
      `${inputPath} has invalid slug "${slug}". Use lowercase ASCII letters, ` +
        `numbers, and single hyphens between words.`
    );
  }

  if (reservedSlugs.has(slug)) {
    throw new Error(`${inputPath} uses reserved slug "${slug}".`);
  }

  return slug;
}

export function buildContentRoute(
  section,
  slug,
  inputPath = "A content item"
) {
  if (!contentSections.has(section)) {
    throw new Error(
      `${inputPath} uses unsupported content section "${section}".`
    );
  }

  return `/${section}/${validateContentSlug(slug, inputPath)}/`;
}

export function assertUniquePublicRoutes(routeEntries) {
  const sourcesByRoute = new Map();

  for (const { inputPath, route } of routeEntries) {
    const normalizedRoute = route.toLowerCase();
    const existingSource = sourcesByRoute.get(normalizedRoute);

    if (existingSource) {
      throw new Error(
        `Duplicate public URL "${route}":\n- ${existingSource}\n- ${inputPath}`
      );
    }

    sourcesByRoute.set(normalizedRoute, inputPath);
  }
}

export function validateContentRoutes(items, section, contentType) {
  const routeEntries = items.map((item) => {
    const inputPath = item.inputPath ?? "An unknown content item";
    const route = buildContentRoute(section, item.data.slug, inputPath);

    if (item.url !== route) {
      throw new Error(
        `${contentType} ${inputPath} resolved to "${item.url}" instead of ` +
          `its stable public URL "${route}".`
      );
    }

    return { inputPath, route };
  });

  assertUniquePublicRoutes(routeEntries);
  return items;
}
