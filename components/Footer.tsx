import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <p className="font-bold text-white text-lg mb-2">BrightWave Digital</p>
          <p className="text-sm leading-relaxed">
            Demo company website for the AI &amp; Digital Marketing class.
            Built with Next.js — no database, no code editing required.
          </p>
        </div>
        <div>
          <p className="font-semibold text-white mb-3">Menu</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/services" className="hover:text-white">Services</Link></li>
            <li><Link href="/portfolio" className="hover:text-white">Portfolio</Link></li>
            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white mb-3">Contact</p>
          <ul className="space-y-2 text-sm">
            <li>hello@brightwave.demo</li>
            <li>02-123-4567</li>
            <li>Bangkok, Thailand</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} BrightWave Digital — Class Demo Website
      </div>
    </footer>
  );
}
