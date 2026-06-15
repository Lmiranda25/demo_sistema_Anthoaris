import { cn } from "@/lib/cn";

/** Placeholder de carga con brillo sutil (SSD 7.1 - Skeletons). */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("skeleton-shimmer rounded-md", className)} {...props} />;
}

export { Skeleton };
