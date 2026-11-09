import ProductCard from './ProductCard';

export default function Offers({ items }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby="offers" className="mx-auto -mt-2 max-w-7xl px-4">
      <div className="rounded-3xl bg-gradient-to-br from-navy-800 to-navy-950 p-5 md:p-7">
        <h2 id="offers" className="mb-5 text-center text-lg font-bold text-white">پیشنهاد شگفت‌انگیز</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {items.map((p) => <ProductCard key={p._id} p={p} compact />)}
        </div>
      </div>
    </section>
  );
}
