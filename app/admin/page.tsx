import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/data";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { ArrowLeftIcon } from "@/lib/icons";

export const metadata: Metadata = {
  title: "Admin — Aurél Studio",
  description: "Manage the Aurél Studio product catalog.",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const products = await getProducts();

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 lg:px-8 lg:pt-24">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-[13px] text-muted transition-colors hover:text-fg"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back to the shop
        </Link>
      </div>
      <AdminPanel initial={products} />
    </>
  );
}
