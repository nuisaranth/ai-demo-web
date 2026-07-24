"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { countHeadings, slugify } from "@/lib/markdown";
import { savePost } from "@/lib/store";
import type { BlogPost } from "@/lib/types";

const TITLE_LIMIT = 60;
const DESC_LIMIT = 150;
const SCHEMA_TYPES = ["Article", "BlogPosting", "Course", "Product", "FAQPage", "HowTo"];

function CharBar({ length, limit, label }: { length: number; limit: number; label: string }) {
  const ok = length > 0 && length <= limit;
  const pct = Math.min((length / limit) * 100, 100);
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-500">{label}</span>
        <span className={ok ? "text-emerald-600 font-semibold" : "text-red-600 font-semibold"}>
          {length}/{limit} {ok ? "✓" : length === 0 ? "empty" : "too long!"}
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${ok ? "bg-emerald-500" : "bg-red-500"}`}
          style={{ width: `${length === 0 ? 0 : pct}%` }}
        />
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500";

export default function SeoInspector({ post, html }: { post: BlogPost; html: string }) {
  const router = useRouter();
  const headings = countHeadings(html);
  const multipleH1 = headings.h1 > 1;

  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState(post);

  const startEdit = () => {
    setDraft(post);
    setEditMode(true);
  };

  const save = () => {
    const newSlug = slugify(draft.slug) || post.slug;
    const updated: BlogPost = { ...draft, slug: newSlug, updatedAt: Date.now() };
    savePost(updated);
    setEditMode(false);
    if (newSlug !== post.slug) router.replace(`/blog/${encodeURIComponent(newSlug)}`);
  };

  const shown = editMode ? draft : post;

  return (
    <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-6 text-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔍</span>
          <h2 className="font-bold text-slate-900">SEO Inspector</h2>
        </div>
        {!editMode ? (
          <button
            onClick={startEdit}
            className="text-xs font-semibold text-brand-600 hover:underline"
          >
            ✏️ Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setEditMode(false)}
              className="text-xs font-semibold text-slate-500 hover:underline"
            >
              Cancel
            </button>
            <button
              onClick={save}
              className="text-xs font-semibold text-white bg-brand-600 px-2.5 py-1 rounded-lg hover:bg-brand-700"
            >
              💾 Save
            </button>
          </div>
        )}
      </div>

      {/* 1. Google Snippet Preview */}
      <section>
        <h3 className="font-semibold text-slate-700 mb-2">Google Snippet Preview</h3>
        <div className="rounded-xl bg-white border border-slate-200 p-4">
          {editMode ? (
            <div className="mb-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">URL Slug</label>
              <input
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                onBlur={(e) => setDraft({ ...draft, slug: slugify(e.target.value) })}
                className={inputCls}
              />
            </div>
          ) : (
            <p className="text-xs text-emerald-700 truncate">
              https://your-site.vercel.app/blog/{shown.slug}
            </p>
          )}

          {editMode ? (
            <input
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className={`${inputCls} mt-2`}
              placeholder="Title Tag"
            />
          ) : (
            <p className="text-[#1a0dab] text-lg leading-snug hover:underline cursor-pointer line-clamp-2">
              {shown.title || "(no title)"}
            </p>
          )}

          {editMode ? (
            <textarea
              rows={3}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              className={`${inputCls} mt-2`}
              placeholder="Meta Description"
            />
          ) : (
            <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mt-1">
              {shown.description || "(no meta description)"}
            </p>
          )}
        </div>
        <CharBar length={shown.title.length} limit={TITLE_LIMIT} label="Title Tag" />
        <CharBar length={shown.description.length} limit={DESC_LIMIT} label="Meta Description" />
      </section>

      {/* 2. Heading Tag Counter */}
      <section>
        <h3 className="font-semibold text-slate-700 mb-2">Heading Structure</h3>
        <div className="grid grid-cols-3 gap-2">
          {(["h1", "h2", "h3"] as const).map((tag) => (
            <div
              key={tag}
              className={`rounded-xl border p-3 text-center bg-white ${
                tag === "h1" && multipleH1 ? "border-red-300" : "border-slate-200"
              }`}
            >
              <p className="text-xs uppercase text-slate-400 font-semibold">&lt;{tag}&gt;</p>
              <p
                className={`text-2xl font-bold ${
                  tag === "h1" && multipleH1 ? "text-red-600" : "text-slate-900"
                }`}
              >
                {headings[tag]}
              </p>
            </div>
          ))}
        </div>
        {multipleH1 && (
          <p className="text-red-600 text-xs font-semibold mt-2">
            ⚠️ Found {headings.h1} &lt;h1&gt; tags — a page should have only ONE h1!
          </p>
        )}
        {headings.h1 === 1 && (
          <p className="text-emerald-600 text-xs font-semibold mt-2">✓ Perfect — exactly one h1 tag.</p>
        )}
      </section>

      {/* 3. Schema Markup Validator */}
      <section>
        <h3 className="font-semibold text-slate-700 mb-2">Schema Markup (Structured Data)</h3>
        <div className="rounded-xl bg-white border border-slate-200 p-4">
          {editMode ? (
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Schema Type</label>
                <select
                  value={draft.schemaType}
                  onChange={(e) => setDraft({ ...draft, schemaType: e.target.value })}
                  className={inputCls}
                >
                  {SCHEMA_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Schema Name</label>
                <input
                  value={draft.schemaName}
                  onChange={(e) => setDraft({ ...draft, schemaName: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-brand-50 text-brand-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  @type: {shown.schemaType || "—"}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                name: <span className="text-slate-800 font-medium">{shown.schemaName || "—"}</span>
              </p>
            </>
          )}
          <p className="text-xs text-slate-400 mt-2">
            This tells Google crawlers what entity this page is about.
          </p>
        </div>
      </section>
    </aside>
  );
}
