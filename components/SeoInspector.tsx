"use client";

import { countHeadings } from "@/lib/markdown";
import type { BlogPost } from "@/lib/types";

const TITLE_LIMIT = 60;
const DESC_LIMIT = 150;

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

export default function SeoInspector({ post, html }: { post: BlogPost; html: string }) {
  const headings = countHeadings(html);
  const multipleH1 = headings.h1 > 1;

  return (
    <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-6 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-lg">🔍</span>
        <h2 className="font-bold text-slate-900">SEO Inspector</h2>
      </div>

      {/* 1. Google Snippet Preview */}
      <section>
        <h3 className="font-semibold text-slate-700 mb-2">Google Snippet Preview</h3>
        <div className="rounded-xl bg-white border border-slate-200 p-4">
          <p className="text-xs text-emerald-700 truncate">
            https://your-site.vercel.app/blog/{post.slug}
          </p>
          <p className="text-[#1a0dab] text-lg leading-snug hover:underline cursor-pointer line-clamp-2">
            {post.title || "(no title)"}
          </p>
          <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mt-1">
            {post.description || "(no meta description)"}
          </p>
        </div>
        <CharBar length={post.title.length} limit={TITLE_LIMIT} label="Title Tag" />
        <CharBar length={post.description.length} limit={DESC_LIMIT} label="Meta Description" />
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
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-brand-50 text-brand-700 text-xs font-bold px-2.5 py-1 rounded-full">
              @type: {post.schemaType || "—"}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            name: <span className="text-slate-800 font-medium">{post.schemaName || "—"}</span>
          </p>
          <p className="text-xs text-slate-400 mt-2">
            This tells Google crawlers what entity this page is about.
          </p>
        </div>
      </section>
    </aside>
  );
}
