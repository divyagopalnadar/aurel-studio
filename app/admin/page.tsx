import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { getProducts } from "@/lib/data";
import { IS_STATIC } from "@/lib/config";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { ArrowLeftIcon } from "@/lib/icons";

export const metadata: Metadata = {
  title: "Admin — Aurél Studio",
  description: "Manage the Aurél Studio product catalog.",
};

export default async function AdminPage() {
  // Database build: render on every request so the list reflects the latest
  // writes. Static build: prerender with the catalog document; the panel then
  // loads any browser-local edits on the client.
  if (!IS_STATIC) await connection();
  const products = await getProducts();

  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 pt-24 sm:px-6 lg:px-8">
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
