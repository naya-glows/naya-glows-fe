import type { Metadata } from "next";
import GlassCard from "../helpers/glass/GlassCard";
import PageHeader from "../helpers/PageHeader";

export const metadata: Metadata = {
  title: "Privacy Policy | Naya Glows",
  description: "How Naya Glows collects, uses, and protects your information.",
  alternates: { canonical: "/privacy" },
  openGraph: { title: "Privacy Policy | Naya Glows", url: "/privacy" },
};

const sections = [
  {
    title: "Information We Collect",
    body: "When you create an account, place an order, or contact us, we collect information you provide directly — name, email address, shipping address, and phone number. We don't store your card details; payments are processed securely by Paystack, and we never see or hold your full card number.",
  },
  {
    title: "How We Use Your Information",
    body: "We use your information to process and ship orders, communicate about your account or orders, send order confirmations and (if you've opted in) occasional product updates, and improve the products and experience we offer. We don't sell your personal information to third parties.",
  },
  {
    title: "Cookies & Local Storage",
    body: "We use browser storage to keep you signed in, remember your cart between visits, and remember your shipping details for faster checkout. You can clear this at any time by clearing your browser's site data, though this may sign you out or empty your cart.",
  },
  {
    title: "Third-Party Services",
    body: "We work with trusted providers to run Naya Glows: Paystack for secure payment processing, Cloudinary for image hosting, and an email provider for transactional messages like order confirmations and password resets. Each only receives the information needed to perform its function.",
  },
  {
    title: "Your Rights",
    body: "You can review and update your account details anytime from your Account page, including your name, email, and country. You can request deletion of your account and associated data by contacting us at hello@nayaglows.com.",
  },
  {
    title: "Data Security",
    body: "We use industry-standard practices to protect your information, including encrypted connections (HTTPS) and hashed passwords — we never store your password in plain text.",
  },
  {
    title: "Changes to This Policy",
    body: "We may update this policy from time to time as our practices evolve. Continued use of Naya Glows after changes are posted means you accept the updated policy.",
  },
  {
    title: "Contact Us",
    body: "Questions about this policy or your data? Reach us anytime at hello@nayaglows.com.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a] min-h-screen">
      <section className="pt-32 sm:pt-36 pb-16 px-5 sm:px-8 lg:px-12">
        <PageHeader
          eyebrow="Legal"
          heading="Privacy Policy"
          subtitle="How we collect, use, and protect your information at Naya Glows."
        />
      </section>

      <section className="px-5 sm:px-8 lg:px-12 pb-24">
        <div className="max-w-[750px] mx-auto">
          <GlassCard className="p-6 sm:p-10 flex flex-col gap-8">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-base font-semibold mb-2">{section.title}</h2>
                <p className="text-sm text-[#16241a]/65 leading-relaxed">{section.body}</p>
              </div>
            ))}
          </GlassCard>
        </div>
      </section>
    </main>
  );
}
