import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { isAdmin, unauthorized, bad } from '@/lib/admin-guard';
import { toInt, shape } from '@/lib/catalog';
export const dynamic = 'force-dynamic';

export async function PATCH(req, { params }) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return bad('شناسه نامعتبر');
  let b;
  try { b = await req.json(); } catch { return bad('درخواست نامعتبر'); }

  const $set = {};
  const $inc = {};
  if (b.name !== undefined) { const v = String(b.name).trim(); if (!v || v.length > 120) return bad('نام نامعتبر'); $set.name = v; }
  if (b.brand !== undefined) $set.brand = String(b.brand).trim().slice(0, 60);
  if (b.description !== undefined) $set.description = String(b.description).trim().slice(0, 2000);
  if (b.isOffer !== undefined) $set.isOffer = !!b.isOffer;
  if (b.price !== undefined) { const v = toInt(b.price, 0, 10_000_000_000); if (v === null) return bad('قیمت نامعتبر'); $set.price = v; }
  if (b.minStock !== undefined) { const v = toInt(b.minStock, 0, 1_000_000); if (v === null) return bad('نقطه سفارش نامعتبر'); $set.minStock = v; }
  if (b.stock !== undefined) { const v = toInt(b.stock, 0, 1_000_000); if (v === null) return bad('موجودی نامعتبر'); $set.stock = v; }
  // تغییر نسبی و اتمیک موجودی (امن در برابر سفارش‌های هم‌زمان)
  if (b.stockDelta !== undefined && b.stock === undefined) { const v = toInt(b.stockDelta, -1_000_000, 1_000_000); if (v === null || v === 0) return bad('مقدار تغییر موجودی نامعتبر'); $inc.stock = v; }

  const update = {};
  if (Object.keys($set).length) update.$set = $set;
  if (Object.keys($inc).length) update.$inc = $inc;
  if (!Object.keys(update).length) return bad('چیزی برای ویرایش ارسال نشده');

  try {
    await connectDB();
    const filter = $inc.stock < 0 ? { _id: id, stock: { $gte: -$inc.stock } } : { _id: id };
    const doc = await Product.findOneAndUpdate(filter, update, { new: true, runValidators: true }).lean();
    if (!doc) return bad('محصول پیدا نشد یا موجودی کافی نیست', 404);
    return Response.json(shape(doc));
  } catch (e) {
    console.error('admin product PATCH:', e);
    return bad('خطای سرور', 500);
  }
}

export async function DELETE(_req, { params }) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return bad('شناسه نامعتبر');
  try {
    await connectDB();
    const doc = await Product.findByIdAndDelete(id).lean();
    if (!doc) return bad('محصول پیدا نشد', 404);
    return Response.json({ ok: true });
  } catch (e) {
    console.error('admin product DELETE:', e);
    return bad('خطای سرور', 500);
  }
}
