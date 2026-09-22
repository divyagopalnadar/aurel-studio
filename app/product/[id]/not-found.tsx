import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/lib/icons";

export default function NotFound() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-32 text-center">

      <div className="relative animate-scale-in">
        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-brand-soft">
          404
        </p>
        <h1 className="mt-4 font-serif text-5xl font-medium tracking-tight text-fg">
          Product not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted">
          This piece doesn&apos;t exist or is no longer part of the
          collection.
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
