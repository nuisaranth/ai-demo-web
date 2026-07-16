"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPosts, onStoreChange } from "@/lib/store";
import type { BlogPost } from "@/lib/types";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setPosts(getPosts());
      setReady(true);
    };
    sync();
    return onStoreChange(sync);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Blog</h1>
        <p className="text-slate-500">
          Insights on AI, SEO, and digital marketing — published from the Admin panel.
        </p>
      </div>

      {ready && posts.length === 0 && (
        <div className="text-center rounded-2xl border-2 border-dashed border-slate-300 py-20 max-w-2xl mx-auto">
          <div className="text-5xl mb-4">📝</div>
          <p className="font-bold text-lg text-slate-900 mb-2">No articles yet</p>
          <p className="text-sm text-slate-500 mb-6">
            Upload a Markdown file from the Admin panel to publish your first article.
          </p>
          <Link
            href="/admin"
            className="inline-block bg-brand-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-700"
          >
            Go to Admin →
          </Link>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${encodeURIComponent(p.slug)}`}
            className="rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col"
          >
            {p.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.imageUrl} alt={p.imageAlt || p.title} className="h-44 w-full object-cover" />
            ) : (
              <div className="h-44 bg-gradient-to-br from-brand-100 to-brand-50 grid place-items-center text-5xl">
                📰
              </div>
            )}
            <div className="p-6 flex flex-col flex-1">
              <span className="text-xs font-semibold text-brand-600 mb-2">{p.schemaType}</span>
              <h2 className="font-bold text-slate-900 mb-2 line-clamp-2">{p.title}</h2>
              <p className="text-sm text-slate-500 line-clamp-3 mb-4">{p.description}</p>
              <p className="text-xs text-slate-400 mt-auto">
                {new Date(p.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
