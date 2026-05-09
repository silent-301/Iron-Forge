import { getCollection, initCollections, Document } from "../local-db";
import { hashPassword } from "../auth";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "customer" | "admin";
  avatar?: string;
}

export const User = getCollection<IUser>("users");

export async function seedUsers() {
  const count = User.countDocuments();
  if (count > 0) return;

  const adminPassword = await hashPassword("admin123");
  User.create({
    name: "Admin",
    email: "admin@ironforge.com",
    password: adminPassword,
    role: "admin",
  } as IUser);

  const customerPassword = await hashPassword("customer123");
  User.create({
    name: "John Athlete",
    email: "customer@example.com",
    password: customerPassword,
    role: "customer",
  } as IUser);
}

export async function seedProducts() {
  const count = getCollection<any>("products").countDocuments();
  if (count > 0) return;
  const Product = getCollection<any>("products");

  const products = [
    {
      name: "IRON WHEY PROTEIN",
      slug: "iron-whey-protein",
      description: "Premium 100% whey isolate protein blend. 25g of pure muscle-building protein per serving. Zero artificial sweeteners, zero filler. Engineered for elite recovery and lean muscle growth.",
      price: 59.99, comparePrice: 79.99, category: "supplements", stock: 150,
      featured: true, bestSeller: true, tags: ["protein", "whey", "muscle-building", "recovery"],
      sizes: ["2lb", "5lb"], colors: ["Chocolate", "Vanilla", "Strawberry"], images: [],
      isActive: true, rating: 4.5, numReviews: 128, limitedEdition: false,
    },
    {
      name: "FORGE PRE-WORKOUT", slug: "forge-pre-workout",
      description: "Maximum intensity pre-workout formula. 300mg caffeine, beta-alanine, and citrulline malate for explosive pumps, insane focus, and unmatched endurance.",
      price: 44.99, comparePrice: 54.99, category: "supplements", stock: 200,
      featured: true, bestSeller: true, tags: ["pre-workout", "energy", "focus", "pump"],
      sizes: ["30 servings", "60 servings"], colors: ["Blue Raspberry", "Fruit Punch", "Green Apple"], images: [],
      isActive: true, rating: 4.7, numReviews: 95, limitedEdition: false,
    },
    {
      name: "TITAN COMPRESSION LEGGINGS", slug: "titan-compression-leggings",
      description: "Pro-grade compression tights engineered for maximum performance. Moisture-wicking fabric, 4-way stretch, and strategic ventilation.",
      price: 89.99, comparePrice: 119.99, category: "apparel", stock: 75,
      featured: true, tags: ["apparel", "leggings", "compression", "training"],
      sizes: ["XS", "S", "M", "L", "XL"], colors: ["Black", "Charcoal", "Neon Orange"], images: [],
      isActive: true, rating: 4.8, numReviews: 64, bestSeller: false, limitedEdition: false,
    },
    {
      name: "IRON FORGE OVERSIZED TEE", slug: "iron-forge-oversized-tee",
      description: "Heavyweight 280gsm cotton tee. Relaxed fit, drop shoulders, ribbed neckline. The uniform of the relentless.",
      price: 39.99, category: "apparel", stock: 200, bestSeller: true,
      tags: ["apparel", "t-shirt", "cotton", "casual"],
      sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Black", "White", "Charcoal"], images: [],
      isActive: true, rating: 4.6, numReviews: 212, featured: false, limitedEdition: false,
    },
    {
      name: "COMPETITION RESISTANCE BANDS", slug: "competition-resistance-bands",
      description: "Premium latex resistance band set. 5 progressive resistance levels. Reinforced layered construction.",
      price: 34.99, comparePrice: 44.99, category: "equipment", stock: 100,
      tags: ["equipment", "bands", "home-gym", "resistance"],
      sizes: ["Set of 5"], colors: [], images: [],
      isActive: true, rating: 4.3, numReviews: 45, featured: false, bestSeller: false, limitedEdition: false,
    },
    {
      name: "ELITE JUMP ROPE", slug: "elite-jump-rope",
      description: "Speed competition jump rope with sealed bearing handles. Lightweight aircraft cable design with PVC coating.",
      price: 29.99, category: "equipment", stock: 150, bestSeller: true,
      tags: ["equipment", "cardio", "speed", "jump-rope"],
      sizes: ["9ft", "10ft"], colors: ["Black", "Orange"], images: [],
      isActive: true, rating: 4.4, numReviews: 78, featured: false, limitedEdition: false,
    },
    {
      name: "THERMOGENIC FAT BURNER", slug: "thermogenic-fat-burner",
      description: "Advanced thermogenic formula for accelerated fat loss. Green tea extract, cayenne, and L-carnitine.",
      price: 49.99, comparePrice: 64.99, category: "fat-loss", stock: 120, featured: true,
      tags: ["fat-loss", "thermogenic", "cutting", "metabolism"],
      sizes: ["60 caps", "120 caps"], colors: [], images: [],
      isActive: true, rating: 4.1, numReviews: 33, bestSeller: false, limitedEdition: false,
    },
    {
      name: "FOAM ROLLER PRO", slug: "foam-roller-pro",
      description: "High-density EVA foam roller for deep tissue recovery. Essential for post-workout recovery and mobility work.",
      price: 24.99, category: "recovery", stock: 80,
      tags: ["recovery", "foam-roller", "mobility", "muscle-recovery"],
      sizes: ["Standard", "Extra Firm"], colors: ["Black", "Orange"], images: [],
      isActive: true, rating: 4.2, numReviews: 56, featured: false, bestSeller: false, limitedEdition: false,
    },
    {
      name: "BCAA RECOVERY COMPLEX", slug: "bcaa-recovery-complex",
      description: "Ultra-pure 2:1:1 BCAA formula with electrolytes. Supports muscle recovery, reduces soreness, and prevents catabolism.",
      price: 34.99, category: "supplements", stock: 180,
      tags: ["supplements", "bcaa", "recovery", "hydration"],
      sizes: ["30 servings", "60 servings"], colors: ["Blue Raspberry", "Lemon Lime", "Watermelon"], images: [],
      isActive: true, rating: 4.3, numReviews: 89, featured: false, bestSeller: false, limitedEdition: false,
    },
    {
      name: "IRON FORGE GYM BAG", slug: "iron-forge-gym-bag",
      description: "Premium 40L duffel bag with wet/dry compartment. Water-resistant ballistic nylon construction.",
      price: 79.99, comparePrice: 99.99, category: "equipment", stock: 60, limitedEdition: true,
      tags: ["equipment", "bag", "gym-bag", "accessories"],
      sizes: ["40L"], colors: ["Black", "Charcoal", "Orange Accent"], images: [],
      isActive: true, rating: 4.6, numReviews: 41, featured: false, bestSeller: false,
    },
  ];

  products.forEach((p) => Product.create(p));
  console.log(`${products.length} products seeded`);
}

export async function seedDatabase() {
  initCollections(["users", "products", "orders"]);
  await seedUsers();
  await seedProducts();
}
