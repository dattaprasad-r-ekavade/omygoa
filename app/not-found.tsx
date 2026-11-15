import Link from "next/link";

export default function NotFound() {
  return (
    <div className="gp-wrap py-20 text-center">
      <h1 className="font-display text-4xl font-semibold">That page has wandered off</h1>
      <p className="mt-2 text-[var(--gp-ink-2)]">Try the search, or head back to the coast.</p>
      <Link href="/" className="mt-6 inline-flex rounded-full bg-[var(--gp-indigo)] px-5 py-2 text-sm font-semibold text-white">
        Home
      </Link>
    </div>
  );
}
