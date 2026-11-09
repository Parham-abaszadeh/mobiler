import mongoose from 'mongoose';
import Product from '../src/models/Product.js';

const COLORS = ['مشکی', 'سفید', 'آبی', 'نقره‌ای', 'طلایی', 'سبز'];
const CATS = {
  mobile: { label: 'گوشی موبایل', brands: ['اپل', 'سامسونگ', 'شیائومی', 'نوکیا', 'ناتینگ'], base: 9e6, step: 2.2e6, spec: ['حافظه', ['۱۲۸ گیگابایت', '۲۵۶ گیگابایت', '۵۱۲ گیگابایت']] },
  laptop: { label: 'لپ‌تاپ', brands: ['ایسوس', 'لنوو', 'اچ‌پی', 'ایسر', 'مک‌بوک'], base: 25e6, step: 4e6, spec: ['رم', ['۸ گیگابایت', '۱۶ گیگابایت', '۳۲ گیگابایت']] },
  headphone: { label: 'هدفون', brands: ['سونی', 'جی‌بی‌ال', 'ای‌اکس‌ال', 'انکر', 'ریزر'], base: 8e5, step: 3.5e5, spec: ['نوع اتصال', ['بی‌سیم', 'سیمی', 'بلوتوث ۵.۳']] },
  powerbank: { label: 'پاور بانک', brands: ['انکر', 'شیائومی', 'باسئوس', 'انرجایزر', 'ریمکس'], base: 6e5, step: 1.8e5, spec: ['ظرفیت', ['۱۰۰۰۰ میلی‌آمپر', '۲۰۰۰۰ میلی‌آمپر', '۳۰۰۰۰ میلی‌آمپر']] },
  accessory: { label: 'لوازم جانبی', brands: ['اپل', 'انکر', 'باسئوس', 'یوگرین', 'سامسونگ'], base: 2e5, step: 9e4, spec: ['نوع', ['کابل شارژ', 'قاب محافظ', 'شارژر دیواری', 'گلس صفحه']] }
};

let n = 0;
const docs = [];
for (const [cat, c] of Object.entries(CATS)) {
  for (let i = 0; i < 20; i++) {
    n++;
    const brand = c.brands[i % 5];
    const price = Math.round((c.base + c.step * (i % 7)) / 1000) * 1000;
    docs.push({
      name: `${c.label} ${brand} مدل ${i + 1}`,
      slug: `${cat}-${i + 1}`,
      brand,
      category: cat,
      price,
      oldPrice: i % 3 === 0 ? Math.round((price * 1.15) / 1000) * 1000 : undefined,
      colors: [COLORS[i % 6], COLORS[(i + 2) % 6]],
      caption: `${c.label} ${brand} با کیفیت ساخت بالا و گارانتی معتبر`,
      description: `${c.label} ${brand} مدل ${i + 1}؛ مناسب استفاده روزمره، با ضمانت اصالت کالا و ۱۸ ماه گارانتی.`,
      specs: [{ k: 'برند', v: brand }, { k: c.spec[0], v: c.spec[1][i % c.spec[1].length] }, { k: 'گارانتی', v: '۱۸ ماه' }],
      stock: 5 + ((n * 7) % 40),
      sold: (n * 13) % 90,
      image: `/img/${cat}.svg`,
      isOffer: cat === 'mobile' && i < 4
    });
  }
}
await mongoose.connect(process.env.MONGODB_URI, { dbName: 'mobiler' });
await Product.deleteMany({});
await Product.insertMany(docs);
console.log(`✔ ${docs.length} محصول ثبت شد`);
await mongoose.disconnect();
