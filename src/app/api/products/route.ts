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

    const query: any = {};

    if (admin !== "true") {
      query.isActive = true;
    }

    if (category) {
      query.category = category;
    }

    if (featured === "true") {
      query.featured = true;
    }

    if (bestSeller === "true") {
      query.bestSeller = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const sortOption: any = {};
    if (sort === "price-asc") {
      sortOption.price = 1;
    } else if (sort === "price-desc") {
      sortOption.price = -1;
    } else if (sort === "name") {
      sortOption.name = 1;
    } else if (sort === "-name") {
      sortOption.name = -1;
    } else {
      sortOption.createdAt = -1;
    }

    const total = await Product.countDocuments(query);
    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

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

    const product = await Product.create({ ...data, slug });

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
