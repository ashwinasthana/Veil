/**
 * Landing Page
 * Premium minimal SaaS landing page for Veil.
 * Sections: Hero → Features → Pricing → FAQ → Footer
 */
import Hero from "@/components/Hero";
import FeatureSection from "@/components/FeatureSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </>
  );
}
