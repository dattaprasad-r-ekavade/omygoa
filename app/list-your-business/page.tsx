import Image from "next/image";
import Link from "next/link";
import { CheckoutButton } from "@/components/plans/checkout-button";
import { listPlans } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { formatInr } from "@/lib/utils";

export function generateMetadata() {
  return pageMeta({
    title: "List your business for free",
    description: "Create a free OmyGoa business profile. Optional plans add featuring, analytics and ad placements.",
    path: "/list-your-business",
  });
}

const steps = [
  ["01", "Create account", "Use your email, a mobile OTP, or Google."],
  ["02", "Business information", "Name, town, hours, photos and how customers should reach you."],
  ["03", "Submit for review", "A free listing goes live after a quick check. Paid upgrades are optional."],
];

const tools = [
  ["Business profiles", "A public page with contact actions."],
  ["Customer reviews", "Collect notes from people who visited."],
  ["Leads inbox", "Enquiries land in the owner workspace."],
  ["Analytics", "A placeholder for views and clicks."],
  ["Photos", "Covers stored in Cloudflare R2 when you connect a bucket."],
  ["Advertise", "Campaigns for explore, search and category placements."],
];

const faqs = [
  ["Is listing my business on OmyGoa free?", "Yes. The free plan publishes a standard listing after review. Featuring and ads are paid."],
  ["How long does it take for my listing to go live?", "In this rebuild, an admin approves it from the businesses screen. Demo listings are already approved."],
  ["What information do I need?", "A name, town, short description, and at least one way for people to contact you."],
  ["Can I edit my listing after it goes live?", "Owners can update hours, contact details and the description from the owner workspace."],
  ["Do I need a physical location in Goa?", "The directory is for businesses people can find in Goa. A lane, beach or delivery area is enough."],
  ["How do ad campaigns work?", "Choose a placement, review a Razorpay checkout, and an admin marks the campaign active. Checkout is stubbed until keys are set."],
];

export default async function ListBusinessPage() {
  const plans = await listPlans().catch(() => []);
  return (
    <div>
      <section className="gp-wrap grid items-center gap-8 py-12 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-5xl font-semibold">List your business for free</h1>
          <p className="mt-3 text-[var(--gp-ink-2)]">Your business, discoverable across Goa.</p>
          <Link href="/signup?next=/owner/business" className="mt-6 inline-flex rounded-full bg-[var(--gp-indigo)] px-5 py-3 text-sm font-semibold text-white">
            Create your business profile
          </Link>
          <ul className="mt-6 space-y-2 text-sm">
            <li>People can find your business and contact you directly.</li>
            <li>Read and respond to customer reviews.</li>
            <li>Show photos and the hours you actually keep.</li>
          </ul>
        </div>
        <Image src="/goa/owner/upgrade-plan-goa-v1.webp" alt="A Goan storefront" width={640} height={480} className="h-auto w-full rounded-[2rem] object-cover" />
      </section>
      <section className="gp-wrap pb-12">
        <h2 className="text-center font-display text-3xl font-semibold">Create your business profile</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {steps.map(([n, title, body], index) => (
            <article key={n} className={`rounded-3xl p-5 ${["tone-mint", "tone-butter", "tone-peach"][index]}`}>
              <p className="text-sm font-semibold">{n}</p>
              <h3 className="mt-2 font-display text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm">{body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="gp-wrap pb-12">
        <h2 className="text-center font-display text-3xl font-semibold">Plans</h2>
        <p className="mt-2 text-center text-sm text-[var(--gp-ink-2)]">Start free. Upgrade when you want the top of explore.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {plans.map((plan) => {
            const features = JSON.parse(plan.featuresJson) as string[];
            return (
              <article key={plan.id} className={`goan-card p-5 ${plan.highlighted ? "ring-2 ring-[var(--gp-indigo)]" : ""}`}>
                <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
                <p className="mt-2 font-display text-3xl font-semibold">{plan.priceInr === 0 ? "Free" : formatInr(plan.priceInr)}</p>
                <p className="text-xs text-[var(--gp-ink-2)]">{plan.priceInr === 0 ? "forever" : `per ${plan.interval}`}</p>
                <p className="mt-2 text-sm">{plan.blurb}</p>
                <ul className="mt-3 space-y-1 text-sm">
                  {features.map((feature) => (
                    <li key={feature}>· {feature}</li>
                  ))}
                </ul>
                <div className="mt-4">
                  {plan.priceInr === 0 ? (
                    <Link href="/signup?next=/owner/business" className="inline-flex rounded-full border px-4 py-2 text-sm font-semibold">
                      Start for free
                    </Link>
                  ) : (
                    <CheckoutButton planId={plan.id} label="Review checkout" />
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <section className="gp-wrap pb-12">
        <h2 className="font-display text-3xl font-semibold">Tools for your business</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map(([title, body]) => (
            <article key={title} className="rounded-3xl bg-white p-4">
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-[var(--gp-ink-2)]">{body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="gp-wrap pb-8">
        <h2 className="font-display text-3xl font-semibold">Got a question?</h2>
        <div className="mt-4 space-y-3">
          {faqs.map(([q, a]) => (
            <details key={q} className="rounded-2xl bg-white p-4">
              <summary className="cursor-pointer font-medium">{q}</summary>
              <p className="mt-2 text-sm text-[var(--gp-ink-2)]">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
