# موبایلر (فروشگاه نمونه‌ی اعتباریار)
Next.js 14 (App Router) + Tailwind (RTL) + MongoDB Atlas + SWR.

## اجرا
1. `npm install`
2. `cp .env.example .env.local` و `MONGODB_URI` را با آدرس Atlas پر کنید (در Network Access باید IP شما مجاز باشد)
3. `npm run seed` ← ثبت ۱۰۰ محصول (نیاز به Node 20.6 یا بالاتر)
4. `npm run dev` ← http://localhost:3000

## ساختار
- `src/app` صفحات و API (`/api/products?category=&q=&sort=&limit=`)
- `src/components` هدر، پیشنهادها، بنرها، ویترین دسته‌بندی، کارت محصول
- `src/models` مدل‌های Mongoose (Product, Order)
- `scripts/seed.mjs` تولید ۱۰۰ محصول (۵ دسته × ۲۰)
