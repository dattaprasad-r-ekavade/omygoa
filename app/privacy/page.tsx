import { pageMeta } from "@/lib/seo";

export function generateMetadata() {
  return pageMeta({
    title: "Privacy policy",
    description: "How OmyGoa handles accounts, listings, enquiries and payments.",
    path: "/privacy",
  });
}

const sections = [
  ["Information we collect", "If you create an account we store your name, email, an optional phone number, and a role such as customer, owner, manager or admin. Listings you publish can include a business address, opening hours and the contact details you choose to show."],
  ["How we use information", "We use it to run the directory: sign-in, showing public listings, delivering enquiries to the business you contacted, and keeping a record of plan checkouts. Demo data in this rebuild is invented and is not a real customer list."],
  ["Google sign-in", "If Google OAuth is configured, Google shares the basic profile you approve. We do not receive your Google password. Without client keys, the Google button explains that sign-in is not configured."],
  ["Phone OTP", "A one-time code is sent through the configured SMS provider. Locally that provider prints the code instead of sending a text. Do not enable the development echo in production."],
  ["Sharing and service providers", "Hosting is intended for Cloudflare (Workers, D1 and R2). Payments, when enabled, are processed by Razorpay. Map tiles load from Mapbox only in the browser, and only when a public token is set."],
  ["Public listings and enquiries", "Business pages are public. An enquiry you send is visible to the business owner and to admins. Do not include secrets in an enquiry."],
  ["Data retention and your choices", "You can update your name from the customer profile. Removing an account, exporting data, and production backups are still to be built. Contact hello@omygoa.in for a request in the meantime."],
  ["Security and updates", "Passwords are stored only as hashes. Webhook calls are rejected unless the Razorpay signature matches. This policy will change as the remaining features land."],
];

export default function PrivacyPage() {
  return (
    <div className="gp-wrap py-10">
      <h1 className="font-display text-4xl font-semibold">Privacy policy</h1>
      <p className="mt-2 max-w-2xl text-sm text-[var(--gp-ink-2)]">This is an original policy for the rebuilt OmyGoa site. It is not legal advice.</p>
      <div className="mt-8 max-w-3xl space-y-6">
        {sections.map(([title, body]) => (
          <section key={title}>
            <h2 className="font-display text-2xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--gp-ink-2)]">{body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
