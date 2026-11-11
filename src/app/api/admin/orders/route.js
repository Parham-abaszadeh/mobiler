import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { isAdmin, unauthorized, bad } from '@/lib/admin-guard';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  try {
    await connectDB();
    const items = await Order.find().sort({ createdAt: -1 }).limit(500).lean();
    return Response.json(
      items.map((o) => ({
        id: String(o._id),
        code: o.code || String(o._id).slice(-6).toUpperCase(),
        customer: o.customer?.name || '—',
        phone: o.customer?.phone || '',
        product: (o.items || []).map((i) => `${i.name}${i.qty > 1 ? ` ×${i.qty}` : ''}`).join('، ') || '—',
        total: o.total || 0,
        method: o.method || 'cash',
        status: o.status || 'pending',
        createdAt: o.createdAt
      }))
    );
  } catch (e) {
    console.error('admin orders GET:', e);
    return bad('خطای سرور', 500);
  }
}
