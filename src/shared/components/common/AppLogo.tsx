import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { GARBA_TOWN_LOGO } from "@/shared/constants/brandAssets";
import { ROUTES } from "@/shared/constants/routes";

interface AppLogoProps {
  compact?: boolean;
  showName?: boolean;
  className?: string;
  imageClassName?: string;
  linkToHome?: boolean;
}

const AppLogo = ({
  compact = false,
  showName = false,
  className,
  imageClassName,
  linkToHome = true,
}: AppLogoProps) => {
  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        className,
      )}
    >
      <img
        src={GARBA_TOWN_LOGO}
        alt="Garba Town"
        className={cn(
          "block object-contain bg-transparent",
          compact ? "h-12 w-[5.25rem]" : "h-[3.75rem] w-[6.5rem]",
          imageClassName,
        )}
      />
      {showName && (
        <span className="sr-only">Garba Town</span>
      )}
    </div>
  );

  if (!linkToHome) return content;

  return <Link to={ROUTES.HOME} className="bg-transparent">{content}</Link>;
};

export default AppLogo;
