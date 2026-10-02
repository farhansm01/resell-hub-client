// app/(main)/page.js
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PopularCategories from "@/components/home/PopularCategories";
import MarketplaceStats from "@/components/home/MarketplaceStats";
import SuccessStories from "@/components/home/SuccessStories";
import SustainableMarketplace from "@/components/home/SustainableMarketplace";
import TrustedSellers from "@/components/home/TrustedSellers";
import FAQSection from "@/components/home/FAQSection";

export default function HomePage() {
  return (
    <main className="flex flex-col w-full">
      <HeroSection />
      <HowItWorks />
      <FeaturedProducts />
      <PopularCategories />
      <MarketplaceStats />
      <SuccessStories />
      <SustainableMarketplace />
      <TrustedSellers />
      <FAQSection />
    </main>
  );
}