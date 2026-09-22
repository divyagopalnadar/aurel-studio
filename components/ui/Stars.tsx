import { StarIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export function Stars({
  rating,
  size = "sm",
  className,
}: {
  rating: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const full = Math.round(rating);
  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      aria-label={`Rated ${rating} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full;
        return (
          <StarIcon
            key={i}
            className={cn(
              size === "sm" ? "size-3" : "size-4",
              filled ? "text-amber-500 dark:text-amber-300" : "text-faint"
            )}
          />
        );
      })}
    </div>
  );
}
