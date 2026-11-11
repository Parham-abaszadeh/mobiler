import mongoose from 'mongoose';
import { randomInt } from 'node:crypto';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { toInt, toLatinDigits } from '@/lib/catalog';
export const dynamic = 'force-dynamic';

const bad = (error, status = 400) => Response.json({ error }, { status });

// ثبت سفارش از فروشگاه: قیمت از دیتابیس خوانده می‌شود و موجودی به‌صورت اتمیک کم می‌شود
export async function POST(req) {
  let b;
  try { b = await req.json(); } catch { return bad('درخواست نامعتبر'); }

  const name = String(b?.customer?.name ?? '').trim();
  const phone = toLatinDigits(b?.customer?.phone).replace(/\s|-/g, '');
  const address = String(b?.customer?.address ?? '').trim();
  const method = b?.method === 'installment' ? 'installment' : 'cash';
  if (name.length < 2 || name.length > 80) return bad('نام و نام خانوادگی نامعتبر است');
  if (!/^09\d{9}$/.test(phone)) return bad('شماره موبایل نامعتبر است');
  if (address.length < 5 || address.length > 500) return bad('آدرس نامعتبر است');
  if (!Array.isArray(b.items) || b.items.length < 1 || b.items.length > 20) return bad('سبد خرید نامعتبر است');

  const wanted = new Map(); // productId -> qty (ادغام ردیف‌های تکراری)
  for (const it of b.items) {
    const qty = toInt(it?.qty, 1, 20);
    if (!mongoose.isValidObjectId(it?.productId) || qty === null) return bad('اقلام سبد نامعتبر است');
    wanted.set(String(it.productId), (wanted.get(String(it.productId)) || 0) + qty);
  }

  await connectDB();
  const taken = []; // برای برگشت در صورت خطا
  const lines = [];
  try {
    for (const [pid, qty] of wanted) {
      const p = await Product.findOneAndUpdate({ _id: pid, stock: { $gte: qty } }, { $inc: { stock: -qty, sold: qty } }, { new: true }).lean();
      if (!p) {
        const exists = await Product.findById(pid).select('name').lean();
        throw Object.assign(new Error('stock'), { userMsg: exists ? `موجودی «${exists.name}» کافی نیست` : 'یکی از کالاها پیدا نشد' });
      }
      taken.push([pid, qty]);
      lines.push({ product: p._id, name: p.name, price: p.price, qty });
    }
    const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
    let order;
    for (let attempt = 0; attempt < 5 && !order; attempt++) {
      try {
        order = await Order.create({ code: `ORD-${randomInt(100000, 999999)}`, customer: { name, phone, address }, items: lines, total, method });
      } catch (e) { if (e?.code !== 11000) throw e; }
    }
    if (!order) throw new Error('order-create-failed');
    return Response.json({ ok: true, code: order.code, total }, { status: 201 });
  } catch (e) {
    await Promise.all(taken.map(([pid, qty]) => Product.updateOne({ _id: pid }, { $inc: { stock: qty, sold: -qty } })));
    if (e.userMsg) return bad(e.userMsg, 409);
    console.error('orders POST:', e);
    return bad('ثبت سفارش ناموفق بود', 500);
  }
}
