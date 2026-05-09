import { NextResponse } from "next/server";
import { connectDB, Product } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "-createdAt";
    const featured = searchParams.get("featured");
    const bestSeller = searchParams.get("bestSeller");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const admin = searchParams.get("admin");

    let allProducts = Product.find();

    if (admin !== "true") {
      allProducts = allProducts.filter((p) => p.isActive);
    }

    if (category) {
      allProducts = allProducts.filter((p) => p.category === category);
    }

    if (featured === "true") {
      allProducts = allProducts.filter((p) => p.featured);
    }

    if (bestSeller === "true") {
      allProducts = allProducts.filter((p) => p.bestSeller);
    }

    if (search) {
      const q = search.toLowerCase();
      allProducts = allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }

    if (minPrice) {
      const min = parseFloat(minPrice);
      allProducts = allProducts.filter((p) => p.price >= min);
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      allProducts = allProducts.filter((p) => p.price <= max);
    }

    if (sort === "price-asc") {
      allProducts.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      allProducts.sort((a, b) => b.price - a.price);
    } else if (sort === "name") {
      allProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "-name") {
      allProducts.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      allProducts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    const total = allProducts.length;
    const skip = (page - 1) * limit;
    const products = allProducts.slice(skip, skip + limit);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const data = await request.json();

    if (!data.name || !data.price || !data.category) {
      return NextResponse.json(
        { error: "Name, price, and category are required" },
        { status: 400 }
      );
    }

    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const product = Product.create({ ...data, slug });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
