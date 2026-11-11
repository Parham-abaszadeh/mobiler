# دیپلوی: GitHub ← Vercel

## ۱) MongoDB Atlas
- Network Access ← Add IP Address ← **Allow access from anywhere (0.0.0.0/0)** (Vercel IP ثابت ندارد)
- یک کاربر دیتابیس بسازید و رشته‌ی اتصال را بردارید.

## ۲) GitHub
```bash
git init && git add . && git commit -m "mobiler: shop + admin"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```
`.env.local` در `.gitignore` است و نباید commit شود.

## ۳) Vercel
Import همین ریپو ← Framework: Next.js (خودکار) ← قبل از Deploy این Environment Variableها را برای Production/Preview/Development بگذارید:

| نام | مقدار |
|---|---|
| `MONGODB_URI` | رشته‌ی اتصال Atlas |
| `ADMIN_EMAIL` | ایمیل ورود به پنل |
| `ADMIN_PASSWORD` | رمز قوی و طولانی |
| `SESSION_SECRET` | رشته‌ی تصادفی ≥ ۳۲ کاراکتر: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

## ۴) ثبت محصولات (یک بار، از کامپیوتر خودتان)
```bash
npm install
cp .env.example .env.local   # و مقدارها را پر کنید
npm run seed                 # ۱۰۰ محصول
npm run seed:orders          # اختیاری: سفارش نمونه
```

## ۵) تست
- `https://<دامنه>/api/products?limit=3` ← JSON محصولات
- `https://<دامنه>/` ← فروشگاه
- `https://<دامنه>/admin` ← صفحه ورود ← انبار ← یک موجودی را تغییر دهید ← فروشگاه را رفرش کنید

## نکته‌ی امنیتی
اگر رمز دیتابیس جایی غیر از Vercel/.env.local دیده شده (چت، ایمیل، zip)، در Atlas آن را عوض کنید و در Vercel دوباره بگذارید.
