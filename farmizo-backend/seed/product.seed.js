require("dotenv").config();
const connectDB = require("../config/db");
const Product = require("../models/product.model");

const products = [
  // PLANTS
  {
    name: "Aloe Vera Plant",
    slug: "aloe-vera-plant",
    description: "Medicinal indoor plant easy to maintain",
    price: 299,
    category: "plants",
    type: "Indoor",
    stock: 50,
    images: [
      "https://images.unsplash.com/photo-1593697821028-7d6d3c4b6f29",
    ],
    isActive: true,
  },
  {
    name: "Rose Plant",
    slug: "rose-plant",
    description: "Beautiful flowering outdoor plant",
    price: 349,
    category: "plants",
    type: "Outdoor",
    stock: 40,
    images: [
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946",
    ],
    isActive: true,
  },

  // SEEDS
  {
    name: "Tomato Seeds Pack",
    slug: "tomato-seeds",
    description: "High germination hybrid seeds",
    price: 99,
    category: "seeds",
    type: "Vegetable",
    stock: 100,
    images: [
      "https://images.unsplash.com/photo-1582515073490-dc84c7b44e45",
    ],
    isActive: true,
  },

  // FERTILIZERS
  {
    name: "Organic Vermicompost",
    slug: "organic-vermicompost",
    description: "Improves soil fertility naturally",
    price: 249,
    category: "fertilizers",
    type: "Organic",
    stock: 80,
    images: [
      "https://images.unsplash.com/photo-1615486363566-3fdf4a1d0f2f",
    ],
    isActive: true,
  },

  // AGRI PRODUCTS
  {
    name: "Neem Oil Pesticide",
    slug: "neem-oil",
    description: "Natural pest control solution",
    price: 199,
    category: "agriproducts",
    type: "Pesticide",
    stock: 60,
    images: [
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449",
    ],
    isActive: true,
  },

  // POTS
  {
    name: "Ceramic Plant Pot",
    slug: "ceramic-pot",
    description: "Premium decorative pot",
    price: 399,
    category: "pots",
    type: "Ceramic",
    stock: 35,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    ],
    isActive: true,
  },

  // TOOLS
  {
    name: "Garden Hand Trowel",
    slug: "hand-trowel",
    description: "Strong steel gardening tool",
    price: 149,
    category: "tools",
    type: "Hand Tools",
    stock: 70,
    images: [
      "https://images.unsplash.com/photo-1586864387789-628af9c1f6c1",
    ],
    isActive: true,
  },
];

const seedProducts = async () => {
  try {
    await connectDB();

    console.log("🌱 Seeding products...");

    await Product.deleteMany();
    await Product.insertMany(products);

    console.log("✅ Products seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedProducts();
