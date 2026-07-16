import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — BrightWave Digital",
  description: "Our company history and the team behind BrightWave Digital.",
};

const TEAM = [
  { name: "Anan Srisuk", role: "Founder & CEO", emoji: "👨‍💼" },
  { name: "Kanya Thongdee", role: "Head of Marketing", emoji: "👩‍💻" },
  { name: "Wichai Boonmee", role: "SEO Specialist", emoji: "🧑‍🔬" },
  { name: "Malee Jaidee", role: "AI Content Lead", emoji: "👩‍🎨" },
];

const TIMELINE = [
  { year: "2019", event: "Founded as a two-person freelance studio in Bangkok." },
  { year: "2021", event: "Grew to a full-service digital marketing agency with 10+ clients." },
  { year: "2023", event: "Adopted AI tools across all content and campaign workflows." },
  { year: "2025", event: "Launched the AI Marketing Academy to train business owners." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="max-w-2xl mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">About Us</h1>
        <p className="text-slate-500 leading-relaxed">
          BrightWave Digital is a boutique agency that blends creativity with
          artificial intelligence. We believe every small business deserves
          world-class marketing without the enterprise price tag.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-8">Our Journey</h2>
      <ol className="relative border-l-2 border-brand-100 ml-3 mb-16">
        {TIMELINE.map((t) => (
          <li key={t.year} className="pl-8 pb-10 relative">
            <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-brand-600" />
            <p className="font-bold text-brand-700">{t.year}</p>
            <p className="text-slate-600">{t.event}</p>
          </li>
        ))}
      </ol>

      <h2 className="text-2xl font-bold text-slate-900 mb-8">Meet the Team</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {TEAM.map((m) => (
          <div key={m.name} className="rounded-2xl border border-slate-200 p-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-brand-50 grid place-items-center text-4xl mb-4">
              {m.emoji}
            </div>
            <p className="font-bold text-slate-900">{m.name}</p>
            <p className="text-sm text-slate-500">{m.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
