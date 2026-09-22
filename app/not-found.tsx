import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/lib/icons";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[13px] text-brand-soft">404 · Page not found</p>
      <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-fg sm:text-5xl">
        This page went missing
      </h1>
      <p className="mt-4 max-w-md text-[15px] text-muted">
        The page you&apos;re after doesn&apos;t exist, or it moved. Let&apos;s get
        you back to the collection.
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link href="/">
          Return home
          <ArrowRightIcon className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
