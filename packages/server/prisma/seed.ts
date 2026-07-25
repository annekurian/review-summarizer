import { PrismaClient, type Product } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

const products = [
  {
    id: 1,
    name: 'Wireless Noise Cancelling Headphones',
    description:
      'Over-ear Bluetooth headphones with active noise cancellation and 30-hour battery life.',
    price: 199.99,
    brand: 'Sony',
    rating: 4.8,
    imagePath: 'headphones.jpg',
    imageAlt: 'Photo by Sam Grozyan on Unsplash',
  },
  {
    id: 2,
    name: 'Smart Fitness Watch',
    description:
      'Water-resistant fitness smartwatch with heart rate monitor, GPS, and sleep tracking.',
    price: 149.5,
    brand: 'Apple',
    rating: 4.7,
    imagePath: 'smart-watch.jpg',
    imageAlt: 'Photo by Pratik Prasad on Unsplash',
  },
  {
    id: 3,
    name: 'Mechanical Gaming Keyboard',
    description:
      'RGB backlit mechanical keyboard with blue switches and aluminum frame.',
    price: 89.99,
    brand: 'Keychron',
    rating: 4.6,
    imagePath: 'keyboard.jpg',
    imageAlt: 'Photo by Martin Garrido on Unsplash',
  },
  {
    id: 4,
    name: '4K Ultra HD Monitor',
    description: '27-inch 4K UHD monitor with IPS panel and HDR support.',
    price: 329.0,
    brand: 'Acer',
    rating: 4.6,
    imagePath: 'monitor.jpg',
    imageAlt: 'Photo by Nicolas Gonzalez on Unsplash',
  },
  {
    id: 5,
    name: 'Portable External SSD 1TB',
    description:
      'High-speed USB-C external solid state drive with 1TB storage capacity.',
    price: 119.95,
    brand: 'Portronics',
    rating: 4.5,
    imagePath: 'ssd.jpg',
    imageAlt: 'Photo by Siyuan Hu on Unsplash',
  },
];

const reviews = [
  // Product 1 — Wireless Noise Cancelling Headphones
  {
    author: 'Rahul Menon',
    rating: 5,
    productId: 1,
    content:
      'I have been using these headphones for a couple of weeks now and the noise cancellation is absolutely amazing. I travel frequently and this has made flights so much more comfortable. The sound quality is crisp with deep bass and clear vocals. Battery life easily lasts multiple days and the build quality feels very premium. Highly recommended for anyone who listens to music daily.',
  },
  {
    author: 'Anjali Nair',
    rating: 4,
    productId: 1,
    content:
      'The headphones are very comfortable to wear for long hours and the noise cancelling works well in office environments. Sound quality is good but I expected slightly more bass. The Bluetooth connection is stable and the battery life is excellent. Overall I am very happy with this purchase.',
  },
  {
    author: 'Vikram Pillai',
    rating: 5,
    productId: 1,
    content:
      'Excellent headphones with premium feel and great sound quality. I use them for both music and online meetings and the microphone clarity is very good. Noise cancellation blocks out fan noise and traffic sounds effectively. Definitely worth the price.',
  },
  {
    author: 'Sneha Joseph',
    rating: 4,
    productId: 1,
    content:
      'Very good build quality and comfortable ear cushions. I can wear them for hours without discomfort. The sound is balanced and clear. The only downside is that the carrying case is a bit bulky, but otherwise the product is fantastic.',
  },
  {
    author: 'Arjun Varghese',
    rating: 5,
    productId: 1,
    content:
      'These are the best wireless headphones I have owned so far. Battery life is outstanding and the fast charging feature is very useful. Noise cancellation is perfect for working in noisy environments. I would definitely recommend this product.',
  },

  // Product 2 — Smart Fitness Watch
  {
    author: 'Kiran Thomas',
    rating: 5,
    productId: 2,
    content:
      'This fitness watch has become part of my daily routine. The step tracking, heart rate monitoring, and sleep tracking all seem very accurate. The battery lasts almost a week and the display is bright even in sunlight. Very useful for tracking workouts and daily activity.',
  },
  {
    author: 'Meera Das',
    rating: 4,
    productId: 2,
    content:
      'I like the design and the watch is very comfortable to wear all day. The fitness tracking features are helpful and the mobile app is easy to use. GPS tracking works well during my runs. Battery life could be slightly better but still good overall.',
  },
  {
    author: 'Sanjay Kumar',
    rating: 4,
    productId: 2,
    content:
      'Good smartwatch for the price with many useful health tracking features. Notifications from the phone work well and the interface is smooth. I mainly use it for step tracking and heart rate monitoring and it performs well.',
  },
  {
    author: 'Divya R',
    rating: 5,
    productId: 2,
    content:
      'Very impressed with this fitness watch. Sleep tracking insights are very helpful and the workout modes are accurate. The watch is lightweight and stylish so I can wear it all day without any issues.',
  },
  {
    author: 'Rohit Babu',
    rating: 4,
    productId: 2,
    content:
      'Great value for money fitness watch. Easy to set up and use. The battery life is good and the watch charges quickly. It tracks steps, calories, and heart rate accurately. I would recommend it for beginners.',
  },

  // Product 3 — Mechanical Gaming Keyboard
  {
    author: 'Akhil S',
    rating: 5,
    productId: 3,
    content:
      'This mechanical keyboard is fantastic for both gaming and typing. The keys are very responsive and the tactile feedback from the blue switches is very satisfying. RGB lighting looks amazing and can be customized easily. Build quality is solid and feels durable.',
  },
  {
    author: 'Neethu Paul',
    rating: 4,
    productId: 3,
    content:
      'I bought this keyboard mainly for typing and I really enjoy using it. The keys are clicky and comfortable. The RGB lighting effects are beautiful. The keyboard is slightly heavy but that also makes it feel premium and stable on the desk.',
  },
  {
    author: 'Manu George',
    rating: 5,
    productId: 3,
    content:
      'Excellent keyboard for gamers. The response time is great and the keys feel very accurate. I also like the aluminum body which makes it feel strong and durable. Definitely a great purchase for gaming setup.',
  },
  {
    author: 'Anoop Krishnan',
    rating: 4,
    productId: 3,
    content:
      'Very good mechanical keyboard with bright RGB lighting and solid build quality. The keys are a bit loud but that is expected with blue switches. Overall performance is very good and I am satisfied.',
  },
  {
    author: 'Lakshmi N',
    rating: 5,
    productId: 3,
    content:
      'This is my first mechanical keyboard and I love typing on it. The key travel is perfect and it improves typing speed. The RGB lighting adds a nice aesthetic to my desk setup. Highly recommended.',
  },

  // Product 4 — 4K Ultra HD Monitor
  {
    author: 'Nithin Raj',
    rating: 5,
    productId: 4,
    content:
      'The 4K monitor display quality is stunning. Colors are very accurate and the screen is very sharp. I use it for both work and watching movies and the experience is excellent. The stand is sturdy and setup was very easy.',
  },
  {
    author: 'Priya Menon',
    rating: 4,
    productId: 4,
    content:
      'Very clear and bright display with good color reproduction. The screen size is perfect for multitasking and productivity work. HDR support is decent. Overall very good monitor for the price.',
  },
  {
    author: 'Abhishek Nair',
    rating: 5,
    productId: 4,
    content:
      'Amazing monitor for video editing and design work. The IPS panel provides great viewing angles and color accuracy. Text is very sharp and the 4K resolution makes a huge difference.',
  },
  {
    author: 'Sreejith P',
    rating: 4,
    productId: 4,
    content:
      'Good build quality and excellent display clarity. The monitor works perfectly with my laptop via HDMI. The only thing missing is built-in speakers but otherwise it is a great monitor.',
  },
  {
    author: 'Athira S',
    rating: 5,
    productId: 4,
    content:
      'I am very happy with this monitor. The display is crystal clear and perfect for coding, watching videos, and general use. The thin bezels make it look modern and stylish.',
  },

  // Product 5 — Portable External SSD 1TB
  {
    author: 'Deepak R',
    rating: 5,
    productId: 5,
    content:
      'This external SSD is extremely fast and very convenient to carry around. File transfer speeds are very high and I use it for backing up large video files. The build quality is solid and the drive is very compact.',
  },
  {
    author: 'Reshma K',
    rating: 4,
    productId: 5,
    content:
      'Very useful portable SSD with fast transfer speeds. I use it daily for moving files between office and home computer. It is lightweight and easy to carry. Works perfectly with USB-C.',
  },
  {
    author: 'Gokul V',
    rating: 5,
    productId: 5,
    content:
      'Excellent performance external SSD. Transfer speeds are much faster compared to my old external hard drive. The size is very small but storage capacity is large. Very good product.',
  },
  {
    author: 'Anu Mathew',
    rating: 4,
    productId: 5,
    content:
      'Good portable SSD for everyday use. The design is sleek and it fits easily in my laptop bag. File transfers are quick and reliable. Price is slightly high but performance is great.',
  },
  {
    author: 'Jithin Paul',
    rating: 5,
    productId: 5,
    content:
      'I use this SSD for storing project files and backups. The speed and reliability are excellent. Plug and play works perfectly on my laptop. Highly recommended for professionals.',
  },
];

async function main() {
  console.log('Seeding products...');
  await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  });

  console.log('Seeding reviews...');
  await prisma.review.createMany({
    data: reviews,
    skipDuplicates: true,
  });

  console.log('Seeded 5 products and 25 reviews successfully.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
