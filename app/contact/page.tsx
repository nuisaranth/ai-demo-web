"use client";

import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Contact Us</h1>
        <p className="text-slate-500">
          Tell us about your project — we&apos;ll get back to you within one business day.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-2 max-w-4xl mx-auto">
        {/* Contact details */}
        <div className="space-y-6">
          {[
            { icon: "📍", label: "Office", value: "123 Sukhumvit Rd, Bangkok 10110" },
            { icon: "📞", label: "Phone", value: "02-123-4567" },
            { icon: "✉️", label: "Email", value: "hello@brightwave.demo" },
            { icon: "🕘", label: "Hours", value: "Mon–Fri, 9:00–18:00" },
          ].map((c) => (
            <div key={c.label} className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-xl bg-brand-50 grid place-items-center text-xl shrink-0">
                {c.icon}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{c.label}</p>
                <p className="text-slate-500 text-sm">{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mock form */}
        <div className="rounded-2xl border border-slate-200 p-7">
          {sent ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">✅</div>
              <p className="font-bold text-lg text-slate-900 mb-2">Message sent!</p>
              <p className="text-sm text-slate-500 mb-6">
                (This is a demo form — no email was actually sent.)
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-brand-600 font-semibold text-sm hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                <input
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                <textarea
                  required
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Tell us about your project…"
                />
              </div>
              <button className="w-full bg-brand-600 text-white font-semibold py-3 rounded-xl hover:bg-brand-700 transition-colors">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
