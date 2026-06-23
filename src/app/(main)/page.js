// app/(main)/page.js

// Import all home sections in order
import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import SuccessStories from "@/components/home/SuccessStories";
// Sections below will be added as they are built
// import PopularCategories from "@/components/home/PopularCategories";

// import MarketplaceStats from "@/components/home/MarketplaceStats";
// import SustainabilityImpact from "@/components/home/SustainabilityImpact";
// import TrustedSellers from "@/components/home/TrustedSellers";

export default function HomePage() {
  return (
    <main className="flex flex-col w-full">
      {/* Section 1 — Hero */}
      <HeroSection />

      {/* Section 2 — Featured Products */}
      <FeaturedProducts />
      <SuccessStories/>

      {/* Uncomment below as each section is built */}
      {/* <PopularCategories /> */}
      {/* <SuccessStories /> */}
      {/* <MarketplaceStats /> */}
      {/* <SustainabilityImpact /> */}
      {/* <TrustedSellers /> */}
    </main>
  );
}