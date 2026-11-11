import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import Offers from '@/components/Offers';
import Banners from '@/components/Banners';
import Showcase from '@/components/Showcase';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';
const plain = (d) => JSON.parse(JSON.stringify(d));

export default async function Home() {
  let offers = [], best = [], failed = false;
  try {
    await connectDB();
    offers = plain(await Product.find({ isOffer: true }).limit(4).lean());
    best = plain(await Product.find().sort({ sold: -1 }).limit(4).lean());
  } catch { failed = true; }

  return (
    <>
      {failed && <p className="mx-auto mt-4 max-w-7xl rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">اتصال به دیتابیس برقرار نشد. فایل .env.local و دستور npm run seed را بررسی کنید.</p>}
      <Offers items={offers} />
      <Banners />
      <Showcase />
      {best.length > 0 && (
        <section id="bestsellers" className="mx-auto mt-12 max-w-7xl px-4">
          <h2 className="mb-5 text-lg font-bold">پرفروش‌ترین‌ها</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{best.map((p) => <ProductCard key={p._id} p={p} />)}</div>
        </section>
      )}
    </>
  );
}
