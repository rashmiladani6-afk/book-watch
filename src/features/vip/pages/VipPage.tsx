import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import VipFeatureCard from "@/features/vip/components/VipFeatureCard";
import VipHeroBanner from "@/features/vip/components/VipHeroBanner";
import { vipFeatures } from "@/features/vip/data/vipContent";

const VipPage = () => {
  return (
    <div className="min-h-screen bg-[#f3f0ec]">
      <Header />

      <VipHeroBanner />

      <div className="container py-10 md:py-12">
        <div className="grid gap-5 md:grid-cols-3">
          {vipFeatures.map((feature) => (
            <VipFeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VipPage;
