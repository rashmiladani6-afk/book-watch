import type { LucideIcon } from "lucide-react";
import { Star, Utensils, Zap } from "lucide-react";

export interface VipFeature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const vipHero = {
  eyebrow: "Premium Garba access",
  title: "Mandli and Rataldi Garba Pass 2026",
  description:
    "Priority entry, premium viewing zone, food counter access, and support at Mandli Garba and Rataldi Garba venues.",
};

export const vipFeatures: VipFeature[] = [
  {
    id: "fast-entry",
    title: "Fast entry",
    description: "Dedicated VIP gate for smooth arrival.",
    icon: Zap,
  },
  {
    id: "food-included",
    title: "Food included",
    description: "Selected passes include food benefits.",
    icon: Utensils,
  },
  {
    id: "best-zone",
    title: "Best zone",
    description: "Premium area near the main stage.",
    icon: Star,
  },
];
