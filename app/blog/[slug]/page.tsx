"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { getPost, onStoreChange, savePost } from "@/lib/store";
import { renderPostHtml, buildMarkdownFile } from "@/lib/markdown";
import type { BlogPost } from "@/lib/types";
import SeoInspector from "@/components/SeoInspector";
import RichTextEditor from "@/components/RichTextEditor";

export default function BlogArticlePage() {
  const params = useParams<{ slug: string }>();
  const slug = decodeURIComponent(params.slug);

  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);
  const [showHtml, setShowHtml] = useState(false);
  const [editingBody, setEditingBody] = useState(false);
  const draftHtml = useRef("");

  useEffect(() => {
    const sync = () => setPost(getPost(slug) ?? null);
    sync();
    return onStoreChange(sync);
  }, [slug]);

  const html = useMemo(() => (post ? renderPostHtml(post) : ""), [post]);

  // Apply SEO meta + JSON-LD schema to the real document so it behaves like a real page
  useEffect(() => {
    if (!post) return;
    document.title = post.title;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = post.description;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": post.schemaType || "Article",
      name: post.schemaName || post.title,
      headline: post.title,
      description: post.description,
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, [post]);

  if (post === undefined) return null;

  if (post === null) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <div className="text-5xl mb-4">🔎</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Article not found</h1>
        <p className="text-slate-500 mb-6">
          This article doesn&apos;t exist in this browser&apos;s storage.
        </p>
        <Link href="/blog" className="text-brand-600 font-semibold hover:underline">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <Link href="/blog" className="text-sm text-brand-600 font-semibold hover:underline">
          ← Back to Blog
        </Link>
        <Link href="/admin" className="text-sm text-slate-500 font-semibold hover:underline">
          ⚙️ Admin
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px] mt-6 items-start">
        {/* Article */}
        <article className="rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-3 bg-slate-50 border-b border-slate-200">
            <p className="text-xs text-slate-500">
              {editingBody
                ? "Editing content"
                : showHtml
                ? "Raw HTML — what Google bots read"
                : "Visual article view"}
            </p>
            <div className="flex items-center gap-2">
              {editingBody ? (
                <>
                  <button
                    onClick={() => setEditingBody(false)}
                    className="text-xs font-semibold text-slate-500 hover:underline px-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!post) return;
                      savePost({ ...post, bodyHtml: draftHtml.current, updatedAt: Date.now() });
                      setEditingBody(false);
                    }}
                    className="text-xs font-semibold text-white bg-brand-600 px-3 py-1.5 rounded-lg hover:bg-brand-700"
                  >
                    💾 Save
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      draftHtml.current = html;
                      setEditingBody(true);
                    }}
                    className="text-xs font-semibold text-brand-600 hover:underline px-2"
                  >
                    ✏️ Edit content
                  </button>
                  <button
                    onClick={() => {
                      const md = buildMarkdownFile(post, html);
                      const blob = new Blob([md], { type: "text/markdown" });
                      const a = document.createElement("a");
                      a.href = URL.createObjectURL(blob);
                      a.download = `${post.slug}.md`;
                      a.click();
                      URL.revokeObjectURL(a.href);
                    }}
                    className="text-xs font-semibold text-slate-600 hover:underline px-2"
                  >
                    ⬇️ Save as .md
                  </button>
                  <button
                    onClick={() => setShowHtml(!showHtml)}
                    className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                      showHtml
                        ? "bg-slate-900 text-emerald-400 border-slate-900"
                        : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                    }`}
                    title="Toggle raw HTML view"
                  >
                    &lt;/&gt;
                  </button>
                </>
              )}
            </div>
          </div>

          {editingBody ? (
            <RichTextEditor
              initialHtml={html}
              onChange={(h) => {
                draftHtml.current = h;
              }}
            />
          ) : (
            <div className="p-6 md:p-8">
              {showHtml ? (
                <pre className="bg-slate-900 text-emerald-300 text-xs p-5 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {html}
                </pre>
              ) : (
                <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />
              )}
            </div>
          )}
        </article>

        {/* SEO Inspector sidebar */}
        <div className="lg:sticky lg:top-20">
          <SeoInspector post={post} html={html} />
        </div>
      </div>
    </div>
  );
}
