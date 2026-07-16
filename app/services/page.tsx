import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services — BrightWave Digital",
  description: "Core digital marketing and AI services we offer.",
};

const SERVICES = [
  {
    icon: "📈",
    title: "Digital Marketing Strategy",
    desc: "Complete marketing roadmaps: audience research, channel planning, budget allocation, and KPI tracking.",
    items: ["Market & competitor analysis", "Campaign planning", "Performance reporting"],
  },
  {
    icon: "🤖",
    title: "AI Content & Automation",
    desc: "Produce blogs, ads, and social content 10x faster using AI workflows tailored to your brand voice.",
    items: ["AI-assisted copywriting", "Content calendars", "Workflow automation"],
  },
  {
    icon: "🔍",
    title: "SEO Optimization",
    desc: "Technical and on-page SEO that helps Google understand and rank your content.",
    items: ["On-page SEO audit", "Structured data (Schema)", "Content optimization"],
  },
  {
    icon: "📣",
    title: "Social Media Marketing",
    desc: "Grow engaged communities on Facebook, Instagram, and TikTok with data-backed content.",
    items: ["Content production", "Community management", "Paid social ads"],
  },
  {
    icon: "🎯",
    title: "Paid Advertising",
    desc: "Google Ads and social ads managed for maximum return on ad spend.",
    items: ["Google Ads", "Facebook/Instagram Ads", "Retargeting funnels"],
  },
  {
    icon: "📊",
    title: "Analytics & Tracking",
    desc: "Set up GA4 and dashboards so every marketing decision is backed by real data.",
    items: ["GA4 setup", "Conversion tracking", "Custom dashboards"],
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Our Services</h1>
        <p className="text-slate-500">
          Everything your business needs to win online — strategy, content,
          SEO, ads, and analytics under one roof.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
        {SERVICES.map((s) => (
          <div key={s.title} className="rounded-2xl border border-slate-200 p-7 flex flex-col">
            <div className="text-4xl mb-4">{s.icon}</div>
            <h2 className="font-bold text-lg text-slate-900 mb-2">{s.title}</h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">{s.desc}</p>
            <ul className="mt-auto space-y-1.5">
              {s.items.map((i) => (
                <li key={i} className="text-sm text-slate-600 flex gap-2">
                  <span className="text-brand-600">✓</span> {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/contact"
          className="inline-block bg-brand-600 text-white font-semibold px-10 py-4 rounded-xl hover:bg-brand-700 transition-colors"
        >
          Request a Quote →
        </Link>
      </div>
    </div>
  );
}
