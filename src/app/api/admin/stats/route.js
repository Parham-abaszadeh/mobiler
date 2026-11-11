import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { isAdmin, unauthorized, bad } from '@/lib/admin-guard';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  try {
    await connectDB();
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const [todayAgg, pending, inv, recent] = await Promise.all([
      Order.aggregate([{ $match: { createdAt: { $gte: start }, status: { $ne: 'cancelled' } } }, { $group: { _id: null, sales: { $sum: '$total' }, orders: { $sum: 1 } } }]),
      Order.countDocuments({ status: 'pending' }),
      Product.aggregate([{ $project: { out: { $lte: ['$stock', 0] }, low: { $and: [{ $gt: ['$stock', 0] }, { $lte: ['$stock', { $ifNull: ['$minStock', 5] }] }] } } },
        { $group: { _id: null, total: { $sum: 1 }, out: { $sum: { $cond: ['$out', 1, 0] } }, low: { $sum: { $cond: ['$low', 1, 0] } } } }]),
      Order.find().sort({ createdAt: -1 }).limit(4).lean()
    ]);
    const t = todayAgg[0] || { sales: 0, orders: 0 };
    const i = inv[0] || { total: 0, out: 0, low: 0 };
    return Response.json({
      today: { sales: t.sales, orders: t.orders },
      pending,
      inventory: { total: i.total, out: i.out, low: i.low, ok: i.total - i.out - i.low },
      recent: recent.map((o) => ({
        id: String(o._id),
        code: o.code || String(o._id).slice(-6).toUpperCase(),
        customer: o.customer?.name || '—',
        product: (o.items || []).map((x) => x.name).join('، ') || '—',
        total: o.total || 0,
        status: o.status || 'pending',
        createdAt: o.createdAt
      }))
    });
  } catch (e) {
    console.error('admin stats:', e);
    return bad('خطای سرور', 500);
  }
}
