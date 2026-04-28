import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@charlotte.edu' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@charlotte.edu',
      password_hash: passwordHash,
      role: 'admin',
    },
  });

  const lulu = await prisma.user.upsert({
    where: { email: 'lrettke@charlotte.edu' },
    update: {},
    create: {
      username: 'lulu',
      email: 'lrettke@charlotte.edu',
      password_hash: passwordHash,
      role: 'student',
    },
  });

  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@charlotte.edu' },
    update: {},
    create: {
      username: 'buyer',
      email: 'buyer@charlotte.edu',
      password_hash: passwordHash,
      role: 'student',
    },
  });

  const textbooks = await prisma.category.upsert({
    where: { name: 'Textbooks' },
    update: {},
    create: { name: 'Textbooks' },
  });

  const electronics = await prisma.category.upsert({
    where: { name: 'Electronics' },
    update: {},
    create: { name: 'Electronics' },
  });

  await prisma.category.upsert({
    where: { name: 'Misc' },
    update: {},
    create: { name: 'Misc' },
  });

  const alani = await prisma.listing.upsert({
    where: { listing_id: 101 },
    update: {},
    create: {
      listing_id: 101,
      seller_id: lulu.user_id,
      category_id: electronics.category_id,
      title: '12 Pack Alani Nu Variety',
      description: 'Having heart palpitations, must sell',
      price: 10.0,
      condition: 'new',
      status: 'available',
      images: {
        create: [
          {
            image_url: 'https://example.com/alani-pack.jpg',
            alt_text: 'Unopened Alani Nu variety pack',
          },
        ],
      },
    },
  });

  await prisma.listing.upsert({
    where: { listing_id: 102 },
    update: {},
    create: {
      listing_id: 102,
      seller_id: buyer.user_id,
      category_id: textbooks.category_id,
      title: 'Calculus textbook',
      description: 'Used MATH 1241 textbook with light notes.',
      price: 45.0,
      condition: 'good',
      status: 'available',
    },
  });

  await prisma.message.upsert({
    where: { message_id: 300 },
    update: {},
    create: {
      message_id: 300,
      listing_id: alani.listing_id,
      sender_id: buyer.user_id,
      receiver_id: lulu.user_id,
      content: 'Is this still available? I have $8 cash if that works.',
      is_read: false,
    },
  });

  await prisma.meetup.upsert({
    where: { meetup_id: 400 },
    update: {},
    create: {
      meetup_id: 400,
      listing_id: alani.listing_id,
      buyer_id: buyer.user_id,
      seller_id: lulu.user_id,
      location: 'Student Union',
      scheduled_time: new Date('2026-05-01T18:00:00.000Z'),
      status: 'proposed',
      notes: 'Meet near the main entrance.',
    },
  });

  console.log('Seeded Camparket data');
  console.log('Admin: admin@charlotte.edu / Password123!');
  console.log('Student seller: lrettke@charlotte.edu / Password123!');
  console.log('Student buyer: buyer@charlotte.edu / Password123!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
