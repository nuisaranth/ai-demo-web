"use client";

import type { BlogPost, SiteSettings } from "./types";

const POSTS_KEY = "demo_blog_posts";
const SETTINGS_KEY = "demo_site_settings";
const CHANGE_EVENT = "demo-store-change";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function notifyChange() {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function onStoreChange(handler: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

// ---------- Blog posts ----------

export function getPosts(): BlogPost[] {
  if (typeof window === "undefined") return [];
  const posts = safeParse<BlogPost[]>(localStorage.getItem(POSTS_KEY), []);
  return posts.sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getPost(slug: string): BlogPost | undefined {
  return getPosts().find((p) => p.slug === slug);
}

export function savePost(post: BlogPost): void {
  // Same file name (or slug) completely overwrites the previous entry
  const posts = getPosts().filter(
    (p) => p.fileName !== post.fileName && p.slug !== post.slug
  );
  posts.push(post);
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  notifyChange();
}

export function deletePost(slug: string): void {
  const posts = getPosts().filter((p) => p.slug !== slug);
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  notifyChange();
}

export function deleteAllPosts(): void {
  localStorage.removeItem(POSTS_KEY);
  notifyChange();
}

// ---------- Settings ----------

export function getSettings(): SiteSettings {
  if (typeof window === "undefined") return { gaId: "" };
  return safeParse<SiteSettings>(localStorage.getItem(SETTINGS_KEY), {
    gaId: "",
  });
}

export function saveSettings(settings: SiteSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  notifyChange();
}
