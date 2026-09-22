import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CARE =
  "Store in a dry pouch, avoid perfume and water, and wipe with a soft cloth after wear to keep the finish luminous.";

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVideo.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.siteContent.deleteMany();
  await prisma.analyticsEvent.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.contactMessage.deleteMany();

  const passwordHash = await bcrypt.hash("Admin@123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Namasvi Studio",
      email: "ivan.p@example.net",
      phone: "9935940113",
      passwordHash,
      role: "ADMIN",
    },
  });

  const customers = await Promise.all(
    [
      ["Ananya Sharma", "ananya@example.com", "9876543210", "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80"],
      ["Meera Iyer", "meera@example.com", "9876501234", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"],
      ["Riya Kapoor", "riya@example.com", "9823011122", "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80"],
      ["Pooja Deshmukh", "pooja@example.com", "9812345678", "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&q=80"],
      ["Sneha Kulkarni", "sneha@example.com", "9765432109", "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80"],
    ].map(([name, email, phone, avatar]) =>
      prisma.user.create({
        data: { name, email, phone, avatar, passwordHash, role: "CUSTOMER" },
      }),
    ),
  );

  const categories = await Promise.all(
    [
      ["Earrings", "earrings", "Statement and everyday earrings crafted for Indian light and layering."],
      ["Necklaces", "necklaces", "Chokers, pendants and layered chains that sit close to the collarbone."],
      ["Bangles", "bangles", "Kadas and bangle pairs for festive stacks and quiet daily gold."],
      ["Sets", "sets", "Complete looks for weddings, pujas and celebrations."],
    ].map(([name, slug, description]) =>
      prisma.category.create({ data: { name, slug, description } }),
    ),
  );

  const cat = (slug: string) => categories.find((c) => c.slug === slug)!;

  const collections = await Promise.all(
    [
      ["Earrings", "earrings", "From quiet studs to bridal chandbalis.", img("photo-1535632066927-ab7c9ab60908"), 1],
      ["Necklaces", "necklaces", "Collarbone jewellery with a modern temple soul.", img("photo-1599643478518-a784e5dc4c8f"), 2],
      ["Bangles", "bangles", "Stacks that catch the light as you move.", img("photo-1611591437281-460bfbe1220a"), 3],
      ["Bridal Collection", "bridal-collection", "Heirloom feeling, contemporary ease.", img("photo-1515562141207-7a88fb7ce338"), 4],
      ["Daily Wear", "daily-wear", "Pieces you forget you are wearing — until someone notices.", img("photo-1617038260897-41a1f14a8ca0"), 5],
      ["Festive Collection", "festive-collection", "For the evenings that ask for a little more gold.", img("photo-1630019852942-f89202989a59"), 6],
    ].map(([name, slug, description, image, sortOrder]) =>
      prisma.collection.create({
        data: {
          name: name as string,
          slug: slug as string,
          description: description as string,
          image: image as string,
          featured: true,
          sortOrder: sortOrder as number,
        },
      }),
    ),
  );

  const col = (slug: string) => collections.find((c) => c.slug === slug)!;

  const products = [
    {
      name: "Aanya Gold-Plated Jhumkas",
      slug: "aanya-gold-plated-jhumkas",
      sku: "NJ-ER-001",
      description:
        "Bell-shaped jhumkas with a soft antique glow — made for garba nights, family dinners, and the kind of festive dressing that still feels like you. Lightweight backs keep them comfortable from aarti to midnight.",
      material: "Gold Plated Alloy",
      occasion: "Festive",
      color: "Antique Gold",
      price: 1299,
      salePrice: 899,
      stock: 42,
      weight: 18,
      trending: true,
      bestSeller: true,
      tags: ["jhumkas", "festive", "earrings"],
      category: "earrings",
      collection: "earrings",
      images: [img("photo-1535632066927-ab7c9ab60908"), img("photo-1630019852942-f89202989a59")],
    },
    {
      name: "Meher Pearl Drop Earrings",
      slug: "meher-pearl-drop-earrings",
      sku: "NJ-ER-002",
      description:
        "A single pearl drop on a slender gold hook. Quiet enough for the office, luminous enough for dinner. These are the earrings that become a signature.",
      material: "Pearl",
      occasion: "Daily Wear",
      color: "Gold",
      price: 649,
      salePrice: null,
      stock: 60,
      weight: 8,
      newArrival: true,
      tags: ["pearl", "daily", "earrings"],
      category: "earrings",
      collection: "daily-wear",
      images: [img("photo-1617038260897-41a1f14a8ca0"), img("photo-1617038260897-41a1f14a8ca0")],
    },
    {
      name: "Saanvi Kundan Chandbalis",
      slug: "saanvi-kundan-chandbalis",
      sku: "NJ-ER-003",
      description:
        "Moon-shaped kundan chandbalis that frame the face like old studio portraits. Designed for pheras, sangeet, and the photographs you will keep.",
      material: "Kundan",
      occasion: "Wedding",
      color: "Gold",
      price: 2499,
      salePrice: 1899,
      stock: 18,
      weight: 32,
      bestSeller: true,
      trending: true,
      tags: ["kundan", "bridal", "chandbali"],
      category: "earrings",
      collection: "bridal-collection",
      images: [img("photo-1515562141207-7a88fb7ce338"), img("photo-1515562141207-7a88fb7ce338")],
    },
    {
      name: "Ira Layered Chain Necklace",
      slug: "ira-layered-chain-necklace",
      sku: "NJ-NK-001",
      description:
        "Three fine chains of slightly different lengths, sitting exactly where a collarbone should catch the light. Everyday jewellery that still feels considered.",
      material: "Gold Plated Alloy",
      occasion: "Daily Wear",
      color: "Gold",
      price: 799,
      salePrice: null,
      stock: 55,
      weight: 12,
      newArrival: true,
      bestSeller: true,
      tags: ["layered", "daily", "necklace"],
      category: "necklaces",
      collection: "daily-wear",
      images: [img("photo-1599643478518-a784e5dc4c8f"), img("photo-1617038260897-41a1f14a8ca0")],
    },
    {
      name: "Ruhani Temple Necklace Set",
      slug: "ruhani-temple-necklace-set",
      sku: "NJ-NK-002",
      description:
        "A contemporary temple necklace with matching earrings — goddess motifs, a softer silhouette, and the weight of celebration without the heaviness of heirloom metal.",
      material: "Temple Jewellery",
      occasion: "Wedding",
      color: "Gold",
      price: 4299,
      salePrice: 3499,
      stock: 12,
      weight: 68,
      bestSeller: true,
      tags: ["temple", "bridal", "set"],
      category: "sets",
      collection: "bridal-collection",
      images: [img("photo-1602173574767-37ac01994b2a"), img("photo-1611591437281-460bfbe1220a")],
    },
    {
      name: "Noor Polki Choker",
      slug: "noor-polki-choker",
      sku: "NJ-NK-003",
      description:
        "A close-set polki choker that looks like moonlight on skin. Pair it with a silk blouse or a simple black dress — it knows both languages.",
      material: "American Diamond",
      occasion: "Festive",
      color: "Gold",
      price: 2199,
      salePrice: null,
      stock: 22,
      weight: 28,
      trending: true,
      tags: ["polki", "choker", "festive"],
      category: "necklaces",
      collection: "festive-collection",
      images: [img("photo-1515562141207-7a88fb7ce338"), img("photo-1605100804763-247f67b3557e")],
    },
    {
      name: "Kiara Gold Bangle Pair",
      slug: "kiara-gold-bangle-pair",
      sku: "NJ-BG-001",
      description:
        "A pair of slim gold-plated bangles with a brushed finish. Stack them with heirlooms or wear them alone with a kurta and wet hair after a shower.",
      material: "Gold Plated Alloy",
      occasion: "Daily Wear",
      color: "Gold",
      price: 999,
      salePrice: null,
      stock: 40,
      weight: 36,
      bestSeller: true,
      tags: ["bangles", "daily"],
      category: "bangles",
      collection: "daily-wear",
      images: [img("photo-1611591437281-460bfbe1220a"), img("photo-1573408301185-9146fe634ad0")],
    },
    {
      name: "Anika Bridal Kada Set",
      slug: "anika-bridal-kada-set",
      sku: "NJ-BG-002",
      description:
        "Open kadas with kundan inlay and a soft champagne sparkle. Made to photograph beautifully under mandap lights and still feel wearable through the evening.",
      material: "Kundan",
      occasion: "Wedding",
      color: "Gold",
      price: 2799,
      salePrice: null,
      stock: 14,
      weight: 74,
      newArrival: true,
      tags: ["kada", "bridal", "bangles"],
      category: "bangles",
      collection: "bridal-collection",
      images: [img("photo-1573408301185-9146fe634ad0"), img("photo-1515562141207-7a88fb7ce338")],
    },
    {
      name: "Zara Oxidised Bangles",
      slug: "zara-oxidised-bangles",
      sku: "NJ-BG-003",
      description:
        "Deep oxidised finish with a tribal edge — for Navratri, monsoon evenings, and women who like their gold a little shadowed.",
      material: "Oxidised Metal",
      occasion: "Festive",
      color: "Antique Gold",
      price: 749,
      salePrice: null,
      stock: 36,
      weight: 42,
      trending: true,
      tags: ["oxidised", "festive", "bangles"],
      category: "bangles",
      collection: "festive-collection",
      images: [img("photo-1602173574767-37ac01994b2a"), img("photo-1611591437281-460bfbe1220a")],
    },
    {
      name: "Daily Luxe CZ Studs",
      slug: "daily-luxe-cz-studs",
      sku: "NJ-ER-004",
      description:
        "American diamond studs with a solitaire look — the piece you put on before you have decided anything else about the day.",
      material: "American Diamond",
      occasion: "Daily Wear",
      color: "Silver",
      price: 499,
      salePrice: null,
      stock: 80,
      weight: 4,
      bestSeller: true,
      tags: ["studs", "daily", "cz"],
      category: "earrings",
      collection: "daily-wear",
      images: [img("photo-1605100804763-247f67b3557e"), img("photo-1617038260897-41a1f14a8ca0")],
    },
    {
      name: "Festive Ghungroo Earrings",
      slug: "festive-ghungroo-earrings",
      sku: "NJ-ER-005",
      description:
        "Tiny ghungroos that move when you do. A joyful, slightly nostalgic pair for dandiya, house pujas, and last-minute festive plans.",
      material: "Gold Plated Alloy",
      occasion: "Festive",
      color: "Gold",
      price: 1099,
      salePrice: null,
      stock: 28,
      weight: 16,
      newArrival: true,
      tags: ["ghungroo", "festive", "earrings"],
      category: "earrings",
      collection: "festive-collection",
      images: [img("photo-1630019852942-f89202989a59"), img("photo-1535632066927-ab7c9ab60908")],
    },
    {
      name: "Solitaire Look CZ Pendant",
      slug: "solitaire-look-cz-pendant",
      sku: "NJ-NK-004",
      description:
        "A single stone on a fine chain. Understated luxury for workdays, travel, and the in-between hours that deserve something beautiful.",
      material: "American Diamond",
      occasion: "Daily Wear",
      color: "Silver",
      price: 1199,
      salePrice: 999,
      stock: 33,
      weight: 6,
      trending: true,
      tags: ["pendant", "daily", "cz"],
      category: "necklaces",
      collection: "daily-wear",
      images: [img("photo-1599643478518-a784e5dc4c8f"), img("photo-1605100804763-247f67b3557e")],
    },
    {
      name: "Bridal Matha Patti",
      slug: "bridal-matha-patti",
      sku: "NJ-ST-001",
      description:
        "A delicate matha patti with kundan drops. Light on the hairline, rich in photographs — the finishing note of a bridal look.",
      material: "Kundan",
      occasion: "Wedding",
      color: "Gold",
      price: 1599,
      salePrice: null,
      stock: 16,
      weight: 22,
      tags: ["matha-patti", "bridal"],
      category: "sets",
      collection: "bridal-collection",
      images: [img("photo-1515562141207-7a88fb7ce338"), img("photo-1515562141207-7a88fb7ce338")],
    },
    {
      name: "Layered Coin Necklace",
      slug: "layered-coin-necklace",
      sku: "NJ-NK-005",
      description:
        "Old-coin motifs on a double chain. A conversation piece for festive brunches and the kind of gifting that feels personal.",
      material: "Gold Plated Alloy",
      occasion: "Festive",
      color: "Antique Gold",
      price: 1399,
      salePrice: null,
      stock: 24,
      weight: 20,
      newArrival: true,
      tags: ["coin", "festive", "necklace"],
      category: "necklaces",
      collection: "festive-collection",
      images: [img("photo-1617038260897-41a1f14a8ca0"), img("photo-1599643478518-a784e5dc4c8f")],
    },
    {
      name: "Minimal Gold Hoops",
      slug: "minimal-gold-hoops",
      sku: "NJ-ER-006",
      description:
        "Medium hoops with a mirror finish. They work with a white shirt, a silk saree, and everything in the wardrobe you actually wear.",
      material: "Gold Plated Alloy",
      occasion: "Daily Wear",
      color: "Gold",
      price: 549,
      salePrice: null,
      stock: 70,
      weight: 7,
      bestSeller: true,
      tags: ["hoops", "daily", "minimal"],
      category: "earrings",
      collection: "daily-wear",
      images: [img("photo-1617038260897-41a1f14a8ca0"), img("photo-1535632066927-ab7c9ab60908")],
    },
    {
      name: "AD Stone Choker Set",
      slug: "ad-stone-choker-set",
      sku: "NJ-ST-002",
      description:
        "American diamond choker with matching earrings — bridal sparkle at an everyday luxury price. Designed in Pune for Indian wedding light.",
      material: "American Diamond",
      occasion: "Wedding",
      color: "Silver",
      price: 2999,
      salePrice: 2499,
      stock: 11,
      weight: 48,
      bestSeller: true,
      trending: true,
      tags: ["choker", "bridal", "set"],
      category: "sets",
      collection: "bridal-collection",
      images: [img("photo-1605100804763-247f67b3557e"), img("photo-1602173574767-37ac01994b2a")],
    },
    {
      name: "Meenakari Bangle Pair",
      slug: "meenakari-bangle-pair",
      sku: "NJ-BG-004",
      description:
        "Enamel meenakari on the inner rim, gold on the outside — a secret of colour only you know until you turn your wrist.",
      material: "Gold Plated Alloy",
      occasion: "Festive",
      color: "Multicolor",
      price: 899,
      salePrice: null,
      stock: 26,
      weight: 40,
      tags: ["meenakari", "festive", "bangles"],
      category: "bangles",
      collection: "festive-collection",
      images: [img("photo-1573408301185-9146fe634ad0"), img("photo-1611591437281-460bfbe1220a")],
    },
    {
      name: "Everyday Chain & Pendant",
      slug: "everyday-chain-pendant",
      sku: "NJ-NK-006",
      description:
        "A petite pendant on a 16-inch chain. The first piece you reach for, the last one you take off.",
      material: "Gold Plated Alloy",
      occasion: "Daily Wear",
      color: "Rose Gold",
      price: 699,
      salePrice: null,
      stock: 48,
      weight: 8,
      newArrival: true,
      tags: ["pendant", "daily", "rose-gold"],
      category: "necklaces",
      collection: "daily-wear",
      images: [img("photo-1599643478518-a784e5dc4c8f"), img("photo-1617038260897-41a1f14a8ca0")],
    },
  ];

  const createdProducts = [];
  for (const p of products) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        description: p.description,
        material: p.material,
        care: CARE,
        occasion: p.occasion,
        color: p.color,
        price: p.price,
        salePrice: p.salePrice,
        stock: p.stock,
        weight: p.weight,
        trending: p.trending ?? false,
        newArrival: p.newArrival ?? false,
        bestSeller: p.bestSeller ?? false,
        tags: p.tags,
        categoryId: cat(p.category).id,
        collectionId: col(p.collection).id,
        images: {
          create: p.images.map((url, i) => ({
            url,
            alt: p.name,
            sortOrder: i,
          })),
        },
        videos: { create: [] },
      },
    });
    createdProducts.push(product);
  }

  const reviewCopy = [
    ["Soft gold, lighter than it looks", "Wore the jhumkas for a cousin’s wedding in Pune — compliments all evening, no ear-ache."],
    ["Feels expensive, priced kindly", "I have been looking for daily earrings that don’t shout. These feel like a quiet luxury."],
    ["Packaging was beautiful", "Gifted the pendant to my sister. The box, the card, the piece — all of it felt considered."],
    ["Exactly as photographed", "Colour is true, clasp is secure. Will order the bangles next."],
    ["My go-to festive pair", "Second order from Namasvi. Trust is rare in online jewellery — they earned it."],
  ];

  for (let i = 0; i < createdProducts.length; i++) {
    const product = createdProducts[i];
    const [title, body] = reviewCopy[i % reviewCopy.length];
    await prisma.review.create({
      data: {
        rating: 5 - (i % 2 === 0 ? 0 : 1),
        title,
        body,
        photoUrl: [
          "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
        ][i % 3],
        verified: true,
        status: "APPROVED",
        userId: customers[i % customers.length].id,
        productId: product.id,
      },
    });
  }

  await prisma.coupon.createMany({
    data: [
      { code: "NAMASVI10", type: "PERCENTAGE", value: 10, minOrder: 799, usageLimit: 500 },
      { code: "FESTIVE300", type: "FESTIVAL", value: 300, minOrder: 1499, usageLimit: 200 },
      { code: "WELCOME150", type: "FIXED", value: 150, minOrder: 599, usageLimit: 1000 },
      { code: "REFER500", type: "REFERRAL", value: 500, minOrder: 2499, usageLimit: 100 },
    ],
  });

  await prisma.banner.create({
    data: {
      title: "Jewelry That Celebrates Every Moment",
      subtitle: "Premium quality designs crafted to make every day feel special.",
      image: img("photo-1515562141207-7a88fb7ce338", 1800),
      ctaText: "Shop Collection",
      ctaHref: "/shop",
      active: true,
      sortOrder: 0,
    },
  });

  await prisma.announcement.create({
    data: {
      message:
        "Complimentary shipping on orders above ₹999  ·  Hand-finished in Pune",
      active: true,
    },
  });

  await prisma.siteContent.createMany({
    data: [
      {
        key: "about",
        value: {
          headline: "Made for the woman who dresses for her own life.",
          body: "Namasvi Jewels began in Keshavnagar, Mundhwa — a Pune studio obsessed with the feeling of putting on something beautiful before an ordinary day. We design affordable luxury jewellery that honours Indian occasions without asking you to wait for them.",
        },
      },
      {
        key: "promo",
        value: { text: "New festive drops this week. Use NAMASVI10 at checkout." },
      },
    ],
  });

  const sampleItems = [
    { product: createdProducts[0], qty: 1 },
    { product: createdProducts[3], qty: 1 },
  ];
  const subtotal = sampleItems.reduce(
    (s, i) => s + (i.product.salePrice ?? i.product.price) * i.qty,
    0,
  );

  await prisma.order.create({
    data: {
      orderNumber: "NJ100241",
      userId: customers[0].id,
      email: customers[0].email!,
      phone: customers[0].phone!,
      guestName: customers[0].name,
      status: "DELIVERED",
      paymentStatus: "PAID",
      paymentMethod: "UPI",
      subtotal,
      discount: 0,
      shippingFee: 0,
      total: subtotal,
      shippingName: customers[0].name,
      shippingPhone: customers[0].phone!,
      shippingLine1: "12 Orchid Residency",
      shippingCity: "Pune",
      shippingState: "Maharashtra",
      shippingPincode: "411036",
      items: {
        create: sampleItems.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          sku: i.product.sku,
          price: i.product.salePrice ?? i.product.price,
          quantity: i.qty,
          image: img("photo-1535632066927-ab7c9ab60908"),
        })),
      },
    },
  });

  await prisma.order.create({
    data: {
      orderNumber: "NJ100242",
      userId: customers[1].id,
      email: customers[1].email!,
      phone: customers[1].phone!,
      guestName: customers[1].name,
      status: "PROCESSING",
      paymentStatus: "PAID",
      paymentMethod: "Razorpay",
      subtotal: 1899,
      discount: 150,
      shippingFee: 0,
      total: 1749,
      couponCode: "WELCOME150",
      shippingName: customers[1].name,
      shippingPhone: customers[1].phone!,
      shippingLine1: "Flat 8, Mundhwa Road",
      shippingCity: "Pune",
      shippingState: "Maharashtra",
      shippingPincode: "411036",
      items: {
        create: {
          productId: createdProducts[2].id,
          name: createdProducts[2].name,
          sku: createdProducts[2].sku,
          price: 1899,
          quantity: 1,
          image: img("photo-1515562141207-7a88fb7ce338"),
        },
      },
    },
  });

  await prisma.analyticsEvent.createMany({
    data: [
      ...Array.from({ length: 40 }).map((_, i) => ({
        type: "page_view",
        path: i % 3 === 0 ? "/" : i % 3 === 1 ? "/shop" : "/product/aanya-gold-plated-jhumkas",
        createdAt: new Date(Date.now() - i * 3600_000),
      })),
      { type: "add_to_cart", path: "/product/ira-layered-chain-necklace" },
      { type: "purchase", path: "/checkout", metadata: { total: 1749 } },
    ],
  });

  await prisma.newsletterSubscriber.createMany({
    data: [
      { email: "ananya@example.com" },
      { email: "meera@example.com" },
    ],
  });

  console.log("Seeded Namasvi Jewels. Admin: ivan.p@example.net / Admin@123");
  console.log(`Admin id: ${admin.id}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
