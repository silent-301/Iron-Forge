import { NextResponse } from "next/server";
import { connectDB, Order, Product, User } from "@/lib/db";
import { requireAuth, requireAdmin } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin");

    if (admin === "true") {
      await requireAdmin();
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "20");
      const status = searchParams.get("status");
      const skip = (page - 1) * limit;

      let allOrders = Order.find();
      if (status) {
        allOrders = allOrders.filter((o) => o.status === status);
      }

      allOrders.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const total = allOrders.length;
      const orders = allOrders.slice(skip, skip + limit).map((o) => ({
        ...o,
        userId: User.findById(o.userId) || null,
      }));

      return NextResponse.json({
        orders,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    }

    const session = await requireAuth();
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    let allOrders = Order.find().filter((o) => o.userId === session.userId);
    allOrders.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const total = allOrders.length;
    const orders = allOrders.slice(skip, skip + limit);

    return NextResponse.json({
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Get orders error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    await connectDB();

    const { items, shippingAddress, paymentMethod } = await request.json();

    if (!items?.length || !shippingAddress || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const allProducts = Product.find();
    const productMap = new Map(allProducts.map((p) => [p._id, p]));

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const price = product.price;
      subtotal += price * item.quantity;

      orderItems.push({
        productId: product._id,
        name: product.name,
        image: (product.images && product.images[0]) || "",
        price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      });
    }

    const shipping = subtotal > 100 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const order = Order.create({
      orderNumber: `FIT-${uuidv4().slice(0, 8).toUpperCase()}`,
      userId: session.userId,
      items: orderItems,
      shippingAddress,
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod,
      status: "confirmed",
    } as any);

    for (const item of orderItems) {
      const prod = productMap.get(item.productId);
      if (prod) {
        Product.findByIdAndUpdate(prod._id, { stock: prod.stock - item.quantity } as any);
      }
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
