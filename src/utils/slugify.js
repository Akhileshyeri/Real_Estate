// src/utils/slugify.js
export function slugify(text = "") {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, "-and-")
    .replace(/[^a-z0-9\-_\s]/g, "") // remove invalid chars
    .replace(/\s+/g, "-")           // spaces → dashes
    .replace(/\-+/g, "-")           // collapse multiple dashes
    .slice(0, 80);                  // limit length
}
