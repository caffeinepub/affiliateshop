import type { Category, Product } from "../backend.d";

export const MOCK_CATEGORIES: Category[] = [
  { id: BigInt(1), name: "Electronics" },
  { id: BigInt(2), name: "Home & Kitchen" },
  { id: BigInt(3), name: "Books" },
  { id: BigInt(4), name: "Sports & Outdoors" },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: BigInt(1),
    title: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
    description:
      "Industry-leading noise canceling with Auto NC Optimizer and 30-hour battery life. Crystal clear hands-free calling with 4 microphones.",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    price: "$279.99",
    category: "Electronics",
    affiliateLink: "https://www.amazon.com",
    featured: true,
  },
  {
    id: BigInt(2),
    title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    description:
      "Replaces 7 kitchen appliances: pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker & warmer. 6 quart capacity.",
    imageUrl:
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=300&fit=crop",
    price: "$89.95",
    category: "Home & Kitchen",
    affiliateLink: "https://www.amazon.com",
    featured: true,
  },
  {
    id: BigInt(3),
    title: "Atomic Habits by James Clear",
    description:
      "The #1 New York Times bestseller. Tiny changes, remarkable results. A proven framework for improving every day.",
    imageUrl:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop",
    price: "$14.99",
    category: "Books",
    affiliateLink: "https://www.amazon.com",
    featured: true,
  },
  {
    id: BigInt(4),
    title: "Hydro Flask 32 oz Water Bottle",
    description:
      "TempShield double-wall vacuum insulation keeps beverages cold up to 24 hours and hot up to 12 hours. Leakproof and BPA-free.",
    imageUrl:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
    price: "$44.95",
    category: "Sports & Outdoors",
    affiliateLink: "https://www.amazon.com",
    featured: false,
  },
  {
    id: BigInt(5),
    title: "Apple AirPods Pro (2nd Generation)",
    description:
      "Active Noise Cancellation, Adaptive Transparency, and Personalized Spatial Audio with dynamic head tracking.",
    imageUrl:
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop",
    price: "$189.00",
    category: "Electronics",
    affiliateLink: "https://www.amazon.com",
    featured: false,
  },
  {
    id: BigInt(6),
    title: "Ninja Air Fryer Pro 4-in-1",
    description:
      "Air fry, roast, reheat, and dehydrate with 4 versatile cooking programs. 5 quart capacity feeds a family of 4.",
    imageUrl:
      "https://images.unsplash.com/photo-1612197527762-8cfb4b634a30?w=400&h=300&fit=crop",
    price: "$99.99",
    category: "Home & Kitchen",
    affiliateLink: "https://www.amazon.com",
    featured: false,
  },
];
