// app/(main)/page.js
import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PopularCategories from "@/components/home/PopularCategories";
import MarketplaceStats from "@/components/home/MarketplaceStats";
import SuccessStories from "@/components/home/SuccessStories";
import SustainabilityImpact from "@/components/home/SustainabilityImpact";
import TrustedSellers from "@/components/home/TrustedSellers";

export default function HomePage() {
  return (
    <main className="flex flex-col w-full">
      <HeroSection />
      <FeaturedProducts />
      <PopularCategories />
      <MarketplaceStats />
      <SuccessStories />
      <SustainabilityImpact />
      <TrustedSellers />
    </main>
  );
}