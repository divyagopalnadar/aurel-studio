import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { mapProduct, getProducts } from "@/lib/data";
import { glyphTheme } from "@/data/products";

const parseJsonArray = (v: unknown): string[] | null => {
  if (!Array.isArray(v)) return null;
  if (v.some((x) => typeof x !== "string")) return null;
  return v;
};

export async function GET(req: NextRequest) {
  const idParam = req.nextUrl.searchParams.get("id");
  if (idParam) {
    const raw = await prisma.product.findUnique({
      where: { id: Number(idParam) },
      include: { reviews: true },
    });
    if (!raw) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(mapProduct(raw));
  }
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    slug,
    name,
    tagline,
    description,
    price,
    compareAtPrice,
    category,
    rating,
    reviewCount,
    stock,
    stockCount,
    featured,
    isNew,
    features,
    colors,
    images,
    hue,
    glyph,
  } = body;

  if (
    typeof slug !== "string" ||
    typeof name !== "string" ||
    typeof price !== "number" ||
    typeof category !== "string"
  ) {
    return NextResponse.json(
      { error: "slug, name, price and category are required" },
      { status: 400 }
    );
  }

  const featuresArr = parseJsonArray(features) ?? [];
  const colorsArr = parseJsonArray(colors) ?? ["#e7e7ec"];
  const imagesArr = parseJsonArray(images) ?? [];
  const stockValue =
    stock === "low_stock" || stock === "sold_out" ? stock : "in_stock";
  const glyphValue =
    typeof glyph === "string" && glyph in glyphTheme ? glyph : "box";

  try {
    const created = await prisma.product.create({
      data: {
        slug: String(slug),
        name: String(name),
        tagline: typeof tagline === "string" ? tagline : "",
        description: typeof description === "string" ? description : "",
        price: price,
        compareAtPrice:
          typeof compareAtPrice === "number" ? compareAtPrice : null,
        category: category as string,
        rating: typeof rating === "number" ? rating : 0,
        reviewCount: typeof reviewCount === "number" ? reviewCount : 0,
        stock: stockValue,
        stockCount: typeof stockCount === "number" ? stockCount : 0,
        featured: featured === true,
        isNew: isNew === true,
        features: JSON.stringify(featuresArr),
        colors: JSON.stringify(colorsArr),
        images: JSON.stringify(imagesArr),
        hue: typeof hue === "number" ? hue : 220,
        glyph: glyphValue,
      },
    });
    // Storefront pages are prerendered; refresh them so the change shows up.
    revalidatePath("/", "layout");
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    if (e instanceof Error && "code" in e && (e as { code: string }).code === "P2002") {
      return NextResponse.json(
        { error: `A product with slug "${slug}" already exists` },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Could not create product" }, { status: 500 });
  }
}
