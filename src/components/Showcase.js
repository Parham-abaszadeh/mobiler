'use client';
import { useState } from 'react';
import useSWR from 'swr';
import ProductCard from './ProductCard';
import { CATEGORIES } from '@/lib/format';

const fetcher = (u) => fetch(u).then((r) => r.json());

export default function Showcase() {
  const [cat, setCat] = useState(CATEGORIES[0].slug);
  // موجودی هر ۱۰ ثانیه از دیتابیس به‌روز می‌شود
  const { data, error, isLoading } = useSWR(`/api/products?category=${cat}&limit=8`, fetcher, { refreshInterval: 10000 });

  return (
    <section id="featured" aria-labelledby="featured-title" className="mx-auto mt-12 max-w-7xl px-4">
      <h2 id="featured-title" className="mb-5 text-lg font-bold">محصولات منتخب پیشنهادی فروشگاه</h2>
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="grid flex-1 grid-cols-2 content-start gap-3 lg:grid-cols-4">
          {isLoading && <p className="col-span-full text-sm text-slate-500">در حال بارگذاری...</p>}
          {(error || data?.error) && <p className="col-span-full text-sm text-red-600">دریافت محصولات ممکن نشد. اتصال دیتابیس را بررسی کنید.</p>}
          {Array.isArray(data) && data.map((p) => <ProductCard key={p._id} p={p} />)}
        </div>
        <nav aria-label="دسته‌بندی" className="flex gap-2 overflow-x-auto md:w-48 md:flex-col md:overflow-visible">
          {CATEGORIES.map((c) => (
            <button key={c.slug} onClick={() => setCat(c.slug)} aria-pressed={cat === c.slug}
              className={`whitespace-nowrap rounded-xl px-4 py-3 text-right text-sm ${cat === c.slug ? 'bg-brand text-white' : 'bg-white ring-1 ring-black/5 hover:bg-blue-50'}`}>
              {c.name}
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
