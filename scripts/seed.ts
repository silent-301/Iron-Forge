import { connectDB } from "../src/lib/db";
import { User } from "../src/lib/models/User";
import { Product } from "../src/lib/models/Product";
import bcrypt from "bcryptjs";

async function seed() {
  await connectDB();

  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await User.findOneAndUpdate(
    { email: "admin@ironforge.com" },
    {
      name: "Admin",
      email: "admin@ironforge.com",
      password: adminPassword,
      role: "admin",
    },
    { upsert: true, new: true }
  );
  console.log("Admin created:", admin.email);

  const userPassword = await bcrypt.hash("customer123", 12);
  const customer = await User.findOneAndUpdate(
    { email: "customer@example.com" },
    {
      name: "John Athlete",
      email: "customer@example.com",
      password: userPassword,
      role: "customer",
    },
    { upsert: true, new: true }
  );
  console.log("Customer created:", customer.email);

  const products = [
    {
      name: "IRON WHEY PROTEIN",
      slug: "iron-whey-protein",
      description:
        "Premium 100% whey isolate protein blend. 25g of pure muscle-building protein per serving. Zero artificial sweeteners, zero filler. Engineered for elite recovery and lean muscle growth.",
      price: 59.99,
      comparePrice: 79.99,
      category: "supplements",
      stock: 150,
      featured: true,
      bestSeller: true,
      images: ["/uploads/placeholder-protein.jpg"],
      tags: ["protein", "whey", "muscle-building", "recovery"],
      sizes: ["2lb", "5lb"],
      colors: ["Chocolate", "Vanilla", "Strawberry"],
    },
    {
      name: "FORGE PRE-WORKOUT",
      slug: "forge-pre-workout",
      description:
        "Maximum intensity pre-workout formula. 300mg caffeine, beta-alanine, and citrulline malate for explosive pumps, insane focus, and unmatched endurance. No crash, just results.",
      price: 44.99,
      comparePrice: 54.99,
      category: "supplements",
      stock: 200,
      featured: true,
      bestSeller: true,
      images: ["/uploads/placeholder-preworkout.jpg"],
      tags: ["pre-workout", "energy", "focus", "pump"],
      sizes: ["30 servings", "60 servings"],
      colors: ["Blue Raspberry", "Fruit Punch", "Green Apple"],
    },
    {
      name: "TITAN COMPRESSION LEGGINGS",
      slug: "titan-compression-leggings",
      description:
        "Pro-grade compression tights engineered for maximum performance. Moisture-wicking fabric, 4-way stretch, and strategic ventilation. Built for heavy lifts and intense cardio.",
      price: 89.99,
      comparePrice: 119.99,
      category: "apparel",
      stock: 75,
      featured: true,
      images: ["/uploads/placeholder-leggings.jpg"],
      tags: ["apparel", "leggings", "compression", "training"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Black", "Charcoal", "Neon Orange"],
    },
    {
      name: "IRON FORGE OVERSIZED TEE",
      slug: "iron-forge-oversized-tee",
      description:
        "Heavyweight 280gsm cotton tee. Relaxed fit, drop shoulders, ribbed neckline. Signature IRON FORGE branding front and center. The uniform of the relentless.",
      price: 39.99,
      category: "apparel",
      stock: 200,
      bestSeller: true,
      images: ["/uploads/placeholder-tee.jpg"],
      tags: ["apparel", "t-shirt", "cotton", "casual"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Black", "White", "Charcoal"],
    },
    {
      name: "COMPETITION RESISTANCE BANDS",
      slug: "competition-resistance-bands",
      description:
        "Premium latex resistance band set. 5 progressive resistance levels from light to extra-heavy. Reinforced layered construction. Perfect for warm-ups, accessory work, and home training.",
      price: 34.99,
      comparePrice: 44.99,
      category: "equipment",
      stock: 100,
      images: ["/uploads/placeholder-bands.jpg"],
      tags: ["equipment", "bands", "home-gym", "resistance"],
      sizes: ["Set of 5"],
      colors: [],
    },
    {
      name: "ELITE JUMP ROPE",
      slug: "elite-jump-rope",
      description:
        "Speed competition jump rope with sealed bearing handles. Lightweight aircraft cable design with PVC coating. Adjustable length for all heights. Pro-grade speed and durability.",
      price: 29.99,
      category: "equipment",
      stock: 150,
      bestSeller: true,
      images: ["/uploads/placeholder-jumprope.jpg"],
      tags: ["equipment", "cardio", "speed", "jump-rope"],
      sizes: ["9ft", "10ft"],
      colors: ["Black", "Orange"],
    },
    {
      name: "THERMOGENIC FAT BURNER",
      slug: "thermogenic-fat-burner",
      description:
        "Advanced thermogenic formula for accelerated fat loss. Green tea extract, cayenne, and L-carnitine. Boosts metabolism, increases energy, and suppresses appetite. Cutting phase essential.",
      price: 49.99,
      comparePrice: 64.99,
      category: "fat-loss",
      stock: 120,
      featured: true,
      images: ["/uploads/placeholder-fatburner.jpg"],
      tags: ["fat-loss", "thermogenic", "cutting", "metabolism"],
      sizes: ["60 caps", "120 caps"],
      colors: [],
    },
    {
      name: "FOAM ROLLER PRO",
      slug: "foam-roller-pro",
      description:
        "High-density EVA foam roller for deep tissue recovery. Muscle-knobbed surface targets trigger points and knots. Essential for post-workout recovery and mobility work.",
      price: 24.99,
      category: "recovery",
      stock: 80,
      images: ["/uploads/placeholder-foamroller.jpg"],
      tags: ["recovery", "foam-roller", "mobility", "muscle-recovery"],
      sizes: ["Standard", "Extra Firm"],
      colors: ["Black", "Orange"],
    },
    {
      name: "BCAA RECOVERY COMPLEX",
      slug: "bcaa-recovery-complex",
      description:
        "Ultra-pure 2:1:1 BCAA formula with electrolytes. Supports muscle recovery, reduces soreness, and prevents catabolism. Zero sugar, great taste. Train harder, recover faster.",
      price: 34.99,
      category: "supplements",
      stock: 180,
      images: ["/uploads/placeholder-bcaa.jpg"],
      tags: ["supplements", "bcaa", "recovery", "hydration"],
      sizes: ["30 servings", "60 servings"],
      colors: ["Blue Raspberry", "Lemon Lime", "Watermelon"],
    },
    {
      name: "IRON FORGE GYM BAG",
      slug: "iron-forge-gym-bag",
      description:
        "Premium 40L duffel bag with wet/dry compartment. Water-resistant ballistic nylon construction. Ventilated shoe pocket, padded laptop sleeve, and multiple organizer pockets.",
      price: 79.99,
      comparePrice: 99.99,
      category: "equipment",
      stock: 60,
      limitedEdition: true,
      images: ["/uploads/placeholder-gymbag.jpg"],
      tags: ["equipment", "bag", "gym-bag", "accessories"],
      sizes: ["40L"],
      colors: ["Black", "Charcoal", "Orange Accent"],
    },
  ];

  for (const product of products) {
    await Product.findOneAndUpdate({ slug: product.slug }, product, {
      upsert: true,
      new: true,
    });
  }
  console.log(`${products.length} products seeded`);

  console.log("\nSeed complete!");
  console.log("Admin login: admin@ironforge.com / admin123");
  console.log("Customer login: customer@example.com / customer123");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
