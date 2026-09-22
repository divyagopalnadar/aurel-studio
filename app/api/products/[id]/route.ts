import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { mapProduct } from "@/lib/data";
import { parseColourArray, parseStringArray } from "@/lib/product-input";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const pid = Number(id);
  const raw = await prisma.product.findUnique({
    where: { id: pid },
    include: { reviews: true },
  });
  if (!raw)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(mapProduct(raw));
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const pid = Number(id);
  if (!Number.isInteger(pid))
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const existing = await prisma.product.findUnique({ where: { id: pid } });
  if (!existing)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: Prisma.ProductUpdateInput = {};

  const pickStr = (k: keyof typeof body) =>
    typeof body[k] === "string" ? (body[k] as string) : undefined;
  const pickNum = (k: keyof typeof body) =>
    typeof body[k] === "number" ? (body[k] as number) : undefined;
  const pickBool = (k: keyof typeof body) =>
    typeof body[k] === "boolean" ? body[k] : undefined;

  const slug = pickStr("slug");
  if (slug) data.slug = slug;
  const name = pickStr("name");
  if (name) data.name = name;
  const tagline = pickStr("tagline");
  if (tagline !== undefined) data.tagline = tagline;
  const description = pickStr("description");
  if (description !== undefined) data.description = description;
  const price = pickNum("price");
  if (price !== undefined) data.price = price;
  const compareAtPrice = pickNum("compareAtPrice");
  if (compareAtPrice !== undefined)
    data.compareAtPrice = compareAtPrice;
  const category = pickStr("category");
  if (category) data.category = category;
  const rating = pickNum("rating");
  if (rating !== undefined) data.rating = rating;
  const reviewCount = pickNum("reviewCount");
  if (reviewCount !== undefined) data.reviewCount = reviewCount;
  if (body.stock === "low_stock" || body.stock === "sold_out")
    data.stock = body.stock;
  else if (body.stock === "in_stock") data.stock = "in_stock";
  const stockCount = pickNum("stockCount");
  if (stockCount !== undefined) data.stockCount = stockCount;
  const featured = pickBool("featured");
  if (featured !== undefined) data.featured = featured;
  const isNew = pickBool("isNew");
  if (isNew !== undefined) data.isNew = isNew;
  const material = pickStr("material");
  if (material !== undefined) data.material = material;
  const care = pickStr("care");
  if (care !== undefined) data.care = care;

  const features = parseStringArray(body.features);
  if (features) data.features = JSON.stringify(features);
  const sizes = parseStringArray(body.sizes);
  if (sizes) data.sizes = JSON.stringify(sizes);
  const colors = parseColourArray(body.colors);
  if (colors) data.colors = JSON.stringify(colors);
  const images = parseStringArray(body.images);
  if (images) data.images = JSON.stringify(images);

  try {
    const updated = await prisma.product.update({
      where: { id: pid },
      data,
      include: { reviews: true },
    });
    // Storefront pages are prerendered; refresh them so the change shows up.
    revalidatePath("/", "layout");
    return NextResponse.json(mapProduct(updated));
  } catch (e) {
    if (isP2002(e))
      return NextResponse.json(
        { error: "A product with that slug already exists" },
        { status: 409 }
      );
    return NextResponse.json({ error: "Could not update product" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const pid = Number(id);
  try {
    await prisma.product.delete({ where: { id: pid } });
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

function isP2002(e: unknown) {
  return (
    e instanceof Error &&
    "code" in e &&
    (e as { code: string }).code === "P2002"
  );
}
