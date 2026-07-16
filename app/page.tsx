import Link from "next/link";

const SERVICES = [
  {
    icon: "📈",
    title: "Digital Marketing Strategy",
    desc: "Data-driven marketing plans that turn visitors into loyal customers.",
  },
  {
    icon: "🤖",
    title: "AI Content & Automation",
    desc: "Leverage AI tools to create content faster and automate workflows.",
  },
  {
    icon: "🔍",
    title: "SEO Optimization",
    desc: "Rank higher on Google with on-page SEO and structured data.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 text-white">
        <div className="mx-auto max-w-6xl px-4 py-24 md:py-32 text-center">
          <p className="inline-block bg-white/15 rounded-full px-4 py-1.5 text-sm mb-6">
            🚀 AI-Powered Digital Marketing Agency
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Grow Your Business with
            <br className="hidden md:block" /> AI &amp; Digital Marketing
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
            We help brands attract, engage, and convert customers using
            modern marketing strategy powered by artificial intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-brand-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-brand-50 transition-colors"
            >
              Get Free Consultation
            </Link>
            <Link
              href="/services"
              className="border border-white/40 font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* Services summary */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">What We Do</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Full-service digital marketing solutions designed for small
            businesses and modern brands.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-slate-200 p-8 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="text-4xl mb-4">{s.icon}</div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">{s.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Ready to start your project?
          </h2>
          <p className="text-slate-500 mb-8">
            Talk to our team today and get a free marketing audit.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-brand-600 text-white font-semibold px-10 py-4 rounded-xl hover:bg-brand-700 transition-colors"
          >
            Contact Us →
          </Link>
        </div>
      </section>
    </>
  );
}
