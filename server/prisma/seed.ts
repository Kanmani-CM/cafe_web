import { PrismaClient, Role, ReservationStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@auroracafe.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!';
  const adminName = process.env.ADMIN_NAME || 'Aurora General Manager';

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: adminName,
      role: Role.ADMIN,
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: adminName,
      role: Role.ADMIN,
    },
  });

  console.log(`👤 Admin user ready: ${admin.email}`);

  // 2. Seed Tables
  const tablesData = [
    { tableNumber: 1, capacity: 2, location: 'Window' },
    { tableNumber: 2, capacity: 2, location: 'Window' },
    { tableNumber: 3, capacity: 4, location: 'Indoor' },
    { tableNumber: 4, capacity: 4, location: 'Indoor' },
    { tableNumber: 5, capacity: 6, location: 'Indoor' },
    { tableNumber: 6, capacity: 2, location: 'Patio' },
    { tableNumber: 7, capacity: 4, location: 'Patio' },
    { tableNumber: 8, capacity: 6, location: 'Patio' },
    { tableNumber: 9, capacity: 8, location: 'Terrace' },
    { tableNumber: 10, capacity: 2, location: 'Bar' },
  ];

  for (const table of tablesData) {
    await prisma.table.upsert({
      where: { tableNumber: table.tableNumber },
      update: {
        capacity: table.capacity,
        location: table.location,
      },
      create: table,
    });
  }

  console.log(`🪑 Seeded ${tablesData.length} dining tables`);

  // 3. Seed Menu Items
  const menuItems = [
    // Coffee & Espresso
    {
      name: 'Artisan Velvet Flat White',
      description: 'Double ristretto shot of our Ethiopian Yirgacheffe blend paired with velvety micro-foamed organic whole milk.',
      price: 5.5,
      imageUrl: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80',
      category: 'Coffee',
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true,
      isPopular: true,
      isAvailable: true,
    },
    {
      name: 'Single Origin Pour-Over (Geisha)',
      description: 'Slow-dripped pour-over featuring Panama Geisha beans with delicate jasmine aroma, bergamot notes, and a silky finish.',
      price: 7.0,
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      category: 'Coffee',
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      isPopular: true,
      isAvailable: true,
    },
    {
      name: 'Salted Caramel Cold Brew',
      description: '20-hour steeped slow cold brew infused with homemade salted caramel syrup and finished with light vanilla cold foam.',
      price: 6.25,
      imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
      category: 'Coffee',
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true,
      isPopular: true,
      isAvailable: true,
    },
    {
      name: 'Spanish Cinnamon Latte',
      description: 'Rich double espresso sweetened with condensed milk, infused with Ceylon cinnamon bark and steamed oat milk.',
      price: 6.0,
      imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80',
      category: 'Coffee',
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true,
      isPopular: false,
      isAvailable: true,
    },
    {
      name: 'Espresso Romano',
      description: 'Traditional double espresso pulled over a strip of fresh candied lemon peel for a bright, aromatic morning kick.',
      price: 4.25,
      imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=800&q=80',
      category: 'Coffee',
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      isPopular: false,
      isAvailable: true,
    },

    // Artisanal Teas
    {
      name: 'Ceremonial Uji Matcha Latte',
      description: 'Stone-ground first-harvest Japanese ceremonial grade matcha whisked to perfection with creamy oat milk and raw wildflower honey.',
      price: 6.5,
      imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
      category: 'Tea',
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      isPopular: true,
      isAvailable: true,
    },
    {
      name: 'Lavender French Earl Grey',
      description: 'Fragrant bergamot black tea blended with dried Provence lavender buds, cornflowers, and a hint of vanilla bean.',
      price: 5.0,
      imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      category: 'Tea',
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      isPopular: false,
      isAvailable: true,
    },
    {
      name: 'Moroccan Fresh Mint Herbal',
      description: 'Steeped spearmint and peppermint leaves with dried citrus peel, served in a traditional glass with a cinnamon swizzle.',
      price: 4.75,
      imageUrl: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80',
      category: 'Tea',
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      isPopular: false,
      isAvailable: true,
    },

    // Brunch & Mains
    {
      name: 'Truffle Mushroom Brioche Toast',
      description: 'Pan-seared wild forest mushrooms, thyme cream sauce, and shaved Parmigiano on toasted brioche with a sunny pasture-raised egg.',
      price: 15.5,
      imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
      category: 'Brunch',
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isPopular: true,
      isAvailable: true,
    },
    {
      name: 'Artisan Avocado & Poached Eggs',
      description: 'Thick-sliced rustic sourdough, smashed Hass avocado, heirloom cherry tomatoes, dukkah crunch, pickled radishes, and two organic poached eggs.',
      price: 14.5,
      imageUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
      category: 'Brunch',
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isPopular: true,
      isAvailable: true,
    },
    {
      name: 'Smoked Salmon Benedict',
      description: 'House-smoked Norwegian salmon, toasted English muffins, poached cage-free eggs, crowned with yuzu hollandaise and fried capers.',
      price: 17.0,
      imageUrl: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=800&q=80',
      category: 'Brunch',
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isPopular: true,
      isAvailable: true,
    },
    {
      name: 'Mediterranean Shakshuka Skillet',
      description: 'Two eggs gently poached in a spiced bell pepper and tomato stew with cumin, crumbled sheep feta, and grilled sourdough flatbread.',
      price: 14.0,
      imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80',
      category: 'Brunch',
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isPopular: false,
      isAvailable: true,
    },
    {
      name: 'Warm Harvest Quinoa & Roasted Veggie Bowl',
      description: 'Herbed tri-color quinoa, roasted butternut squash, Tuscan kale, crisp chickpeas, avocado, and creamy tahini-lemon dressing.',
      price: 13.5,
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      category: 'Brunch',
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      isPopular: false,
      isAvailable: true,
    },

    // Fresh Pastries
    {
      name: 'Pistachio Cardamom Frangipane Croissant',
      description: 'Twice-baked butter croissant filled with fragrant green pistachio frangipane, topped with toasted slivered pistachios and powdered sugar.',
      price: 5.75,
      imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
      category: 'Pastries',
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isPopular: true,
      isAvailable: true,
    },
    {
      name: 'Artisan Cinnamon Cardamom Knot',
      description: 'Swedish-inspired pull-apart brioche dough spiced with freshly ground cardamom seeds, cinnamon brown sugar butter, and pearl sugar.',
      price: 4.5,
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      category: 'Pastries',
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isPopular: true,
      isAvailable: true,
    },
    {
      name: 'Valrhona Dark Chocolate Pain au Chocolat',
      description: 'Layers of golden flaky French pastry wrapping two batons of intense 70% single-estate dark Valrhona chocolate.',
      price: 5.0,
      imageUrl: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&q=80',
      category: 'Pastries',
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isPopular: false,
      isAvailable: true,
    },

    // Signature Desserts
    {
      name: 'Basque Burnt Cheesecake',
      description: 'Caramelized mahogany crust with an ultra-creamy, molten vanilla bean custard center. Served with seasonal berry compote.',
      price: 8.5,
      imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
      category: 'Desserts',
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true,
      isPopular: true,
      isAvailable: true,
    },
    {
      name: 'Café Aurora Espresso Tiramisu',
      description: 'Savoiardi ladyfingers soaked in our freshly pulled espresso and dark rum, layered with whipped mascarpone cream and dusted with raw cocoa.',
      price: 8.0,
      imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
      category: 'Desserts',
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isPopular: true,
      isAvailable: true,
    },

    // Refreshers
    {
      name: 'Sparkling Hibiscus & Blood Orange Fizz',
      description: 'Brewed wild hibiscus flowers, squeezed Sicilian blood orange juice, sparkling mineral water, fresh mint, and dehydrated citrus wheel.',
      price: 5.5,
      imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
      category: 'Beverages',
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      isPopular: false,
      isAvailable: true,
    },
  ];

  // Clear existing menu items and re-seed for clean state
  await prisma.menuItem.deleteMany({});
  for (const item of menuItems) {
    await prisma.menuItem.create({
      data: item,
    });
  }

  console.log(`☕ Seeded ${menuItems.length} menu items`);

  // 4. Seed Sample Reservations
  const table1 = await prisma.table.findFirst({ where: { tableNumber: 1 } });
  const table3 = await prisma.table.findFirst({ where: { tableNumber: 3 } });

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);
  const dayAfterStr = dayAfter.toISOString().split('T')[0];

  await prisma.reservation.deleteMany({});

  await prisma.reservation.create({
    data: {
      referenceNumber: 'RES-8921-AURORA',
      customerName: 'Sophia Montgomery',
      customerEmail: 'sophia.m@example.com',
      customerPhone: '+1 (555) 234-5678',
      date: tomorrowStr,
      timeSlot: '11:00',
      guestCount: 2,
      specialNotes: 'Celebrating an anniversary, window table preferred please.',
      status: ReservationStatus.CONFIRMED,
      tableId: table1 ? table1.id : undefined,
    },
  });

  await prisma.reservation.create({
    data: {
      referenceNumber: 'RES-4512-AURORA',
      customerName: 'Liam Chen',
      customerEmail: 'liam.chen@example.com',
      customerPhone: '+1 (555) 876-5432',
      date: dayAfterStr,
      timeSlot: '13:30',
      guestCount: 4,
      specialNotes: 'High chair needed for a toddler.',
      status: ReservationStatus.PENDING,
      tableId: table3 ? table3.id : undefined,
    },
  });

  console.log('📅 Seeded sample reservations');

  // 5. Seed Sample Contact Messages
  await prisma.contactMessage.deleteMany({});
  await prisma.contactMessage.create({
    data: {
      name: 'Elena Rostova',
      email: 'elena@events-studio.com',
      phone: '+1 (555) 345-6789',
      subject: 'Private Event & Roastery Buyout Inquiry',
      message: 'Hello Aurora team, we are planning a private morning brunch workshop for 25 people next month. Do you offer private patio bookings or roastery tours?',
      isRead: false,
    },
  });

  await prisma.contactMessage.create({
    data: {
      name: 'Marcus Vance',
      email: 'marcus.v@coffeedigest.com',
      phone: '+1 (555) 901-2345',
      subject: 'Coffee Origin Collaboration Feature',
      message: 'Loved your Panama Geisha pour-over last weekend! Would love to interview your head roaster for an upcoming artisan coffee piece.',
      isRead: true,
    },
  });

  console.log('✉️ Seeded sample contact messages');
  console.log('✨ Database seeding successfully finished!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
