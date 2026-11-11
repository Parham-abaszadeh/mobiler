// ساخت چند سفارش نمونه برای دیدن صفحه‌ی «فروش» و داشبورد پنل (موجودی کالاها تغییر نمی‌کند)
// اجرا: npm run seed:orders            (برای پاک‌کردن و ساخت مجدد: npm run seed:orders -- --force)
import mongoose from 'mongoose';
import Product from '../src/models/Product.js';
import Order from '../src/models/Order.js';

if (!process.env.MONGODB_URI) { console.error('MONGODB_URI در .env.local تنظیم نشده است'); process.exit(1); }
await mongoose.connect(process.env.MONGODB_URI, { dbName: 'mobiler', serverSelectionTimeoutMS: 8000 });

const existing = await Order.countDocuments();
if (existing > 0 && !process.argv.includes('--force')) {
  console.log(`⚠ ${existing} سفارش از قبل وجود دارد و چیزی تغییر نکرد. برای پاک‌کردن و ساخت مجدد: npm run seed:orders -- --force`);
  await mongoose.disconnect(); process.exit(0);
}
const products = await Product.find().limit(40).lean();
if (!products.length) { console.error('ابتدا محصولات را ثبت کنید: npm run seed'); process.exit(1); }

const people = [['سارا احمدی', '09123456789'], ['مهدی کریمی', '09125521020'], ['رضا نوری', '09354408172'], ['نگار محمدی', '09102214055'], ['علی رضایی', '09153339210'], ['الهام عباسی', '09367289100']];
const statuses = ['pending', 'confirmed', 'completed', 'completed', 'pending', 'cancelled'];
const docs = Array.from({ length: 12 }, (_, i) => {
  const [name, phone] = people[i % people.length];
  const p = products[(i * 7) % products.length];
  const qty = 1 + (i % 2);
  return {
    code: `ORD-${3400 + i}`,
    customer: { name, phone, address: 'تهران، خیابان نمونه، پلاک ۱۲' },
    items: [{ product: p._id, name: p.name, price: p.price, qty }],
    total: p.price * qty,
    method: i % 3 === 0 ? 'cash' : 'installment',
    status: statuses[i % statuses.length],
    createdAt: new Date(Date.now() - i * 5 * 3600 * 1000)
  };
});
await Order.deleteMany({});
await Order.insertMany(docs);
console.log(`✔ ${docs.length} سفارش نمونه ثبت شد`);
await mongoose.disconnect();
