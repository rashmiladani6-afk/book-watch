import { Link } from "react-router-dom";
import { GARBA_TOWN_LOGO } from "@/shared/constants/brandAssets";
import { brand } from "@/shared/constants/theme";
import { ROUTES } from "@/shared/constants/routes";

const VipHeroBanner = () => {
  return (
    <section className="container py-6 md:py-8">
      <div className="relative overflow-hidden rounded-sm shadow-xl">
        {/* Ticket scalloped side edges */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-3 sm:w-4"
          style={{
            background:
              "repeating-linear-gradient(to bottom, #c9a87c 0 10px, transparent 10px 20px)",
            maskImage: "radial-gradient(circle at 0 50%, transparent 7px, black 7px)",
            WebkitMaskImage:
              "radial-gradient(circle at 0 50%, transparent 7px, black 7px)",
            maskSize: "100% 20px",
            WebkitMaskSize: "100% 20px",
          }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-3 sm:w-4"
          style={{
            background:
              "repeating-linear-gradient(to bottom, #c9a87c 0 10px, transparent 10px 20px)",
            maskImage: "radial-gradient(circle at 100% 50%, transparent 7px, black 7px)",
            WebkitMaskImage:
              "radial-gradient(circle at 100% 50%, transparent 7px, black 7px)",
            maskSize: "100% 20px",
            WebkitMaskSize: "100% 20px",
          }}
        />

        <div
          className="relative min-h-[280px] sm:min-h-[320px] md:min-h-[360px]"
          style={{
            background:
              "linear-gradient(135deg, #3d2618 0%, #5c3d25 45%, #4a3020 100%)",
          }}
        >
          {/* Dashed ticket frame lines */}
          <div className="pointer-events-none absolute inset-y-6 left-6 right-6 border border-dashed border-[#c9a87c]/35" />
          <div className="pointer-events-none absolute inset-y-10 left-10 right-10 border border-dashed border-[#c9a87c]/20" />

          {/* Decorative logo / mandala backdrop */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center md:justify-end md:pr-[6%]">
            <img
              src={GARBA_TOWN_LOGO}
              alt=""
              aria-hidden
              className="h-[75%] max-h-[320px] w-auto max-w-[min(420px,55%)] object-contain opacity-30 md:opacity-40"
            />
          </div>

          <div className="relative z-20 flex h-full flex-col justify-center px-8 py-10 sm:px-12 sm:py-12 md:max-w-[58%]">
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] sm:text-sm"
              style={{ color: brand.accent }}
            >
              Premium Garba access
            </p>

            <h1 className="mb-4 text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-[2.75rem]">
              Mandli and Rataldi Garba Pass 2026
            </h1>

            <p className="mb-8 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
              Priority entry, premium viewing zone, food counter access, and support at
              Mandli Garba and Rataldi Garba venues.
            </p>

            <Link to={ROUTES.PASSES} className="w-fit">
              <button
                type="button"
                className="rounded-md border border-white/80 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                Choose VIP pass
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VipHeroBanner;
