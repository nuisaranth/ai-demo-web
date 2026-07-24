import { marked } from "marked";
import TurndownService from "turndown";
import type { BlogPost } from "./types";

marked.setOptions({ gfm: true, breaks: true });

const turndown = new TurndownService({ headingStyle: "atx" });
// Images are managed separately via the Admin/SEO Inspector image picker —
// export them as the same [IMAGE] placeholder the upload flow recognizes.
turndown.addRule("imagePlaceholder", {
  filter: "img",
  replacement: () => "[IMAGE]",
});

export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9ก-๙\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || "untitled"
  );
}

/** Parse optional YAML-like frontmatter (title / description / schema) */
function parseFrontmatter(raw: string): {
  meta: Record<string, string>;
  body: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx > 0) {
      meta[line.slice(0, idx).trim().toLowerCase()] = line
        .slice(idx + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
    }
  }
  return { meta, body: raw.slice(match[0].length) };
}

/** Build a BlogPost object from an uploaded .md file */
export function parseMarkdownFile(fileName: string, raw: string): BlogPost {
  const { meta, body } = parseFrontmatter(raw);

  const h1 = body.match(/^#\s+(.+)$/m)?.[1]?.trim();
  const firstParagraph = body
    .split(/\r?\n\r?\n/)
    .map((s) => s.replace(/[#>*`\[\]!()_-]/g, "").trim())
    .find((s) => s.length > 20);

  const title = meta.title || h1 || fileName.replace(/\.md$/i, "");
  const now = Date.now();

  return {
    slug: slugify(meta.slug || title),
    fileName,
    title,
    description: meta.description || (firstParagraph || "").slice(0, 150),
    schemaType: meta.schema || meta.schematype || "Article",
    schemaName: meta.schemaname || title,
    markdown: body,
    imageUrl: "",
    imageAlt: "",
    createdAt: now,
    updatedAt: now,
  };
}

/** Render markdown to HTML, replacing image placeholders with the chosen image */
export function renderPostHtml(post: BlogPost): string {
  if (post.bodyHtml) return post.bodyHtml;

  let md = post.markdown;

  if (post.imageUrl) {
    const imgMd = `![${post.imageAlt || post.title}](${post.imageUrl})`;
    // Replace common AI-generated placeholders, e.g. [IMAGE], [ภาพประกอบ...], ![...](placeholder)
    const placeholder = /\[(?:IMAGE|รูปภาพ|ภาพประกอบ)[^\]]*\]|!\[[^\]]*\]\((?:placeholder|image-placeholder)[^)]*\)/i;
    if (placeholder.test(md)) {
      md = md.replace(placeholder, imgMd);
    } else {
      // No placeholder found — insert image after the first heading
      md = md.replace(/^(#\s+.+)$/m, `$1\n\n${imgMd}`);
      if (!md.includes(imgMd)) md = `${imgMd}\n\n${md}`;
    }
  }

  return marked.parse(md) as string;
}

/** Build a downloadable .md file (frontmatter + body) from the current rendered content */
export function buildMarkdownFile(post: BlogPost, html: string): string {
  const body = turndown.turndown(html);
  const frontmatter = [
    "---",
    `title: ${post.title}`,
    `description: ${post.description}`,
    `slug: ${post.slug}`,
    `schema: ${post.schemaType}`,
    `schemaname: ${post.schemaName}`,
    "---",
    "",
  ].join("\n");
  return frontmatter + body;
}

export function countHeadings(html: string): { h1: number; h2: number; h3: number } {
  const count = (tag: string) =>
    (html.match(new RegExp(`<${tag}[\\s>]`, "gi")) || []).length;
  return { h1: count("h1"), h2: count("h2"), h3: count("h3") };
}
