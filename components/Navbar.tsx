"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const MENU = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <nav className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-900">
          <span className="w-8 h-8 rounded-lg bg-brand-600 text-white grid place-items-center text-sm">
            B
          </span>
          BrightWave Digital
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {MENU.map((m) => (
            <li key={m.href}>
              <Link
                href={m.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === m.href
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {m.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <ul className="md:hidden border-t border-slate-200 bg-white px-4 py-2">
          {MENU.map((m) => (
            <li key={m.href}>
              <Link
                href={m.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                  pathname === m.href ? "bg-brand-50 text-brand-700" : "text-slate-600"
                }`}
              >
                {m.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
