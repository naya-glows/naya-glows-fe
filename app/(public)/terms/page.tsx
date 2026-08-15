import type { Metadata } from "next";
import GlassCard from "../helpers/glass/GlassCard";
import PageHeader from "../helpers/PageHeader";

export const metadata: Metadata = {
  title: "Terms of Service | Naya Glows",
  description: "The terms that govern using the Naya Glows website and placing an order.",
  alternates: { canonical: "/terms" },
  openGraph: { title: "Terms of Service | Naya Glows", url: "/terms" },
};

const sections = [
  {
    title: "Acceptance of Terms",
    body: "By accessing or using Naya Glows, you agree to these Terms of Service. If you don't agree, please don't use the site.",
  },
  {
    title: "Accounts",
    body: "You're responsible for keeping your account credentials secure and for all activity under your account. Let us know right away if you suspect unauthorized access.",
  },
  {
    title: "Orders & Payment",
    body: "All orders are subject to acceptance and availability. Prices are shown in USD or NGN depending on your account's country, and payments are processed securely through Paystack. We reserve the right to cancel or refuse any order, including in cases of suspected fraud or pricing errors.",
  },
  {
    title: "Shipping & Returns",
    body: "Shipping timelines and return eligibility are outlined on our Shipping & Returns page, which forms part of these Terms.",
  },
  {
    title: "Subscriptions",
    body: "Subscribe & Save orders can be changed or cancelled anytime from your account before the next scheduled order — there's no long-term commitment.",
  },
  {
    title: "Product Information",
    body: "We describe our products as accurately as possible, but results can vary based on individual skin type and consistent use. Nothing on this site constitutes medical advice — consult a dermatologist for specific skin concerns.",
  },
  {
    title: "Intellectual Property",
    body: "All content on Naya Glows — including text, images, and branding — is owned by Naya Glows or its licensors and may not be reproduced without permission.",
  },
  {
    title: "Limitation of Liability",
    body: "Naya Glows is not liable for any indirect, incidental, or consequential damages arising from use of the site or products, to the fullest extent permitted by law.",
  },
  {
    title: "Changes to These Terms",
    body: "We may update these Terms from time to time. Continued use of the site after changes are posted means you accept the updated Terms.",
  },
  {
    title: "Contact",
    body: "Questions about these Terms? Reach us at hello@nayaglows.com.",
  },
];

export default function TermsPage() {
  return (
    <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a] min-h-screen">
      <section className="pt-32 sm:pt-36 pb-16 px-5 sm:px-8 lg:px-12">
        <PageHeader
          eyebrow="Legal"
          heading="Terms of Service"
          subtitle="The terms that govern your use of Naya Glows."
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
