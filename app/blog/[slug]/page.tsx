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
  const [editing, setEditing] = useState(false);
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
              {editing ? "Editing content — toggle </> for raw HTML" : "Visual article view"}
            </p>
            <div className="flex items-center gap-2">
              {editing ? (
                <>
                  <button
                    onClick={() => setEditing(false)}
                    className="text-xs font-semibold text-slate-500 hover:underline px-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!post) return;
                      try {
                        savePost({ ...post, bodyHtml: draftHtml.current, updatedAt: Date.now() });
                        setEditing(false);
                      } catch (err) {
                        alert(err instanceof Error ? err.message : "Couldn't save the article.");
                      }
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
                      setEditing(true);
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
                </>
              )}
            </div>
          </div>

          {editing ? (
            <RichTextEditor
              initialHtml={html}
              onChange={(h) => {
                draftHtml.current = h;
              }}
              onSave={(h) => {
                draftHtml.current = h;
                if (!post) return;
                savePost({ ...post, bodyHtml: h, updatedAt: Date.now() });
              }} // errors here are caught by RichTextEditor's saveImgModal, which alerts the user
            />
          ) : (
            <div className="p-6 md:p-8">
              <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />
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
