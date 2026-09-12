const POSES = {
  map: "/images/mascot-map.png",
  guide: "/images/mascot-guide.png",
  idle: "/images/mascot-idle.png",
} as const;

export type MascotPose = keyof typeof POSES;
export type MascotSize = "hero" | "companion";

const SIZES: Record<MascotSize, string> = {
  hero: "w-36 sm:w-48 md:w-56 lg:w-64",
  companion: "w-24 sm:w-36 md:w-40",
};

export function Mascot({
  pose,
  size = "companion",
  className,
}: {
  pose: MascotPose;
  size?: MascotSize;
  className?: string;
}) {
  return (
    <img
      src={POSES[pose]}
      alt=""
      aria-hidden="true"
      decoding="async"
      className={`mascot pointer-events-none select-none ${SIZES[size]}${className ? ` ${className}` : ""}`}
    />
  );
}
