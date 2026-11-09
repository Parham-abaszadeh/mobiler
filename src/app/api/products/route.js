import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
export const dynamic = 'force-dynamic';

export async function GET(req) {
  const sp = new URL(req.url).searchParams;
  const filter = {};
  if (sp.get('category')) filter.category = sp.get('category');
  if (sp.get('q')) filter.name = { $regex: sp.get('q').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
  const sort = sp.get('sort') === 'bestsellers' ? { sold: -1 } : { createdAt: -1 };
  const limit = Math.min(Number(sp.get('limit')) || 12, 100);
  try {
    await connectDB();
    const items = await Product.find(filter).sort(sort).limit(limit).lean();
    return Response.json(items.map((p) => ({ ...p, _id: String(p._id) })));
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
