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

      const query: any = {};
      if (status) query.status = status;

      const total = await Order.countDocuments(query);
      const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Simple manual population since userId is a string
      const ordersWithUsers = await Promise.all(
        orders.map(async (o: any) => {
          const user = await User.findById(o.userId).select("name email").lean();
          return { ...o, user };
        })
      );

      return NextResponse.json({
        orders: ordersWithUsers,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    }

    const session = await requireAuth();
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const query = { userId: session.userId };
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

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

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
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

      // Update stock
      product.stock -= item.quantity;
      await product.save();
    }

    const shipping = subtotal > 100 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const order = await Order.create({
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
    });

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
