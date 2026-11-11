import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { isAdmin, unauthorized, bad } from '@/lib/admin-guard';
import { CATEGORY_SLUGS, toInt, shape } from '@/lib/catalog';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  try {
    await connectDB();
    const items = await Product.find().sort({ createdAt: -1 }).limit(1000).lean();
    return Response.json(items.map(shape));
  } catch (e) {
    console.error('admin products GET:', e);
    return bad('خطای سرور', 500);
  }
}

export async function POST(req) {
  if (!(await isAdmin())) return unauthorized();
  let b;
  try { b = await req.json(); } catch { return bad('درخواست نامعتبر'); }

  const name = String(b.name ?? '').trim();
  const sku = String(b.sku ?? '').trim();
  const brand = String(b.brand ?? '').trim().slice(0, 60);
  const description = String(b.description ?? '').trim().slice(0, 2000);
  const colorName = String(b.colorName ?? '').trim().slice(0, 40);
  const hex = String(b.hex ?? '').trim();
  const price = toInt(b.price, 0, 10_000_000_000);
  const stock = toInt(b.stock ?? 0, 0, 1_000_000);
  const minStock = toInt(b.minStock ?? 5, 0, 1_000_000);

  if (!name || name.length > 120) return bad('نام محصول الزامی است (حداکثر ۱۲۰ کاراکتر)');
  if (!/^[A-Za-z0-9_-]{1,40}$/.test(sku)) return bad('کد کالا فقط می‌تواند شامل حروف انگلیسی، عدد، - و _ باشد');
  if (!CATEGORY_SLUGS.includes(b.category)) return bad('دسته‌بندی نامعتبر است');
  if (price === null) return bad('قیمت نامعتبر است');
  if (stock === null || minStock === null) return bad('موجودی یا نقطه سفارش نامعتبر است');
  if (hex && !/^#[0-9a-fA-F]{6}$/.test(hex)) return bad('کد رنگ نامعتبر است');

  try {
    await connectDB();
    const slug = sku.toLowerCase();
    if (await Product.exists({ $or: [{ sku }, { slug }] })) return bad('این کد کالا قبلاً ثبت شده است', 409);
    const doc = await Product.create({
      name, slug, sku, brand: brand || '—', category: b.category, price, stock, minStock,
      colors: colorName ? [colorName] : [], colorHex: hex || undefined,
      caption: description.slice(0, 100), description,
      specs: [{ k: 'برند', v: brand || '—' }], image: `/img/${b.category}.svg`
    });
    return Response.json(shape(doc.toObject()), { status: 201 });
  } catch (e) {
    if (e?.code === 11000) return bad('این کد کالا قبلاً ثبت شده است', 409);
    console.error('admin products POST:', e);
    return bad('خطای سرور', 500);
  }
}
