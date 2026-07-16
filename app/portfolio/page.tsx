import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio — BrightWave Digital",
  description: "Client logos and case studies from our recent projects.",
};

const CLIENTS = ["Lotus Café", "Siam Fitness", "GreenLeaf Spa", "TechNova", "Baan Décor", "UrbanRide"];

const CASES = [
  {
    tag: "SEO",
    color: "bg-emerald-100 text-emerald-700",
    title: "Lotus Café — 3x Organic Traffic",
    desc: "On-page SEO overhaul and AI-written blog content grew organic traffic 212% in 6 months.",
    metric: "+212% traffic",
  },
  {
    tag: "Paid Ads",
    color: "bg-amber-100 text-amber-700",
    title: "Siam Fitness — Membership Boost",
    desc: "Facebook lead ads with retargeting funnels doubled monthly gym sign-ups.",
    metric: "2x sign-ups",
  },
  {
    tag: "AI Content",
    color: "bg-purple-100 text-purple-700",
    title: "GreenLeaf Spa — Content Engine",
    desc: "An AI content workflow producing 20 posts/month cut content costs by 60%.",
    metric: "-60% cost",
  },
  {
    tag: "Analytics",
    color: "bg-sky-100 text-sky-700",
    title: "TechNova — Data-Driven Funnel",
    desc: "GA4 conversion tracking revealed the winning channel, improving ROAS by 45%.",
    metric: "+45% ROAS",
  },
];

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Our Work</h1>
        <p className="text-slate-500">Brands we&apos;ve helped grow, and the results we delivered.</p>
      </div>

      {/* Client logos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-20">
        {CLIENTS.map((c) => (
          <div
            key={c}
            className="rounded-xl border border-slate-200 bg-slate-50 h-20 grid place-items-center px-2 text-center text-sm font-semibold text-slate-500"
          >
            {c}
          </div>
        ))}
      </div>

      {/* Case studies */}
      <h2 className="text-2xl font-bold text-slate-900 mb-8">Case Studies</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {CASES.map((c) => (
          <div key={c.title} className="rounded-2xl border border-slate-200 p-7">
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${c.color}`}>
                {c.tag}
              </span>
              <span className="font-bold text-brand-600">{c.metric}</span>
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">{c.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
