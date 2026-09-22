import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon, BoxIcon } from "@/lib/icons";

export default function NotFound() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-32 text-center">
      <div className="grid-lines pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-brand/20 blur-[120px]" />

      <div className="relative animate-scale-in">
        <div className="inline-flex items-center gap-2 rounded-full border border-edge bg-fg/[0.03] px-3.5 py-1.5 text-[12px] font-medium text-muted">
          <BoxIcon className="size-3.5 text-brand-soft" />
          404
        </div>
        <h1 className="text-gradient mt-6 text-5xl font-semibold tracking-tight">
          Product not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted">
          The product you&apos;re looking for doesn&apos;t exist or may have
          been removed from the collection.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg">
            <Link href="/">
              Back to the shop
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
