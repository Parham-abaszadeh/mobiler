import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Order, { ORDER_STATUSES } from '@/models/Order';
import Product from '@/models/Product';
import { isAdmin, unauthorized, bad } from '@/lib/admin-guard';
export const dynamic = 'force-dynamic';

export async function PATCH(req, { params }) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return bad('شناسه نامعتبر');
  let b;
  try { b = await req.json(); } catch { return bad('درخواست نامعتبر'); }
  if (!ORDER_STATUSES.includes(b.status)) return bad('وضعیت نامعتبر');

  try {
    await connectDB();
    // سفارش لغو‌شده دیگر تغییر نمی‌کند؛ شرط status≠cancelled جلوی برگشت‌دادن دوباره‌ی موجودی را می‌گیرد
    const before = await Order.findOneAndUpdate({ _id: id, status: { $ne: 'cancelled' } }, { status: b.status }, { new: false }).lean();
    if (!before) {
      return (await Order.exists({ _id: id })) ? bad('سفارش لغوشده قابل تغییر نیست', 409) : bad('سفارش پیدا نشد', 404);
    }
    if (b.status === 'cancelled') {
      // برگرداندن موجودی کالاها به انبار
      await Promise.all((before.items || []).map((i) => i.product && Product.updateOne({ _id: i.product }, { $inc: { stock: i.qty, sold: -i.qty } })));
    }
    return Response.json({ ok: true, status: b.status });
  } catch (e) {
    console.error('admin order PATCH:', e);
    return bad('خطای سرور', 500);
  }
}
