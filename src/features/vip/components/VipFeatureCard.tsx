import { brand } from "@/shared/constants/theme";
import type { VipFeature } from "@/features/vip/data/vipContent";

interface VipFeatureCardProps {
  feature: VipFeature;
}

const VipFeatureCard = ({ feature }: VipFeatureCardProps) => {
  const Icon = feature.icon;

  return (
    <article className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <Icon className="h-7 w-7 mb-4" style={{ color: brand.primary }} strokeWidth={1.75} />
      <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
    </article>
  );
};

export default VipFeatureCard;
