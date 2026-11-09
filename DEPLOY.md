# دیپلوی (Vercel + MongoDB Atlas)
1. Atlas ← Network Access ← Add IP Address ← Allow Access From Anywhere (0.0.0.0/0)
2. Vercel ← Project ← Settings ← Environment Variables ← MONGODB_URI (همان مقدار .env.local) برای Production/Preview/Development
3. Redeploy
4. تست: /api/products?limit=3
5. ثبت محصولات (فقط یک بار، از کامپیوتر): npm run seed   (برای ثبت مجدد و پاک‌کردن: npm run seed -- --force)
