import { toman } from '@/lib/format';

export function StockBadge({ stock }) {
  if (stock <= 0) return <span className="text-xs font-medium text-red-600">ناموجود</span>;
  if (stock <= 5) return <span className="text-xs font-medium text-amber-600">فقط {toman(stock)} عدد باقی مانده</span>;
  return <span className="text-xs text-emerald-700">موجودی: {toman(stock)} عدد</span>;
}

export default function ProductCard({ p, compact }) {
  return (
    <article className="flex flex-col rounded-2xl bg-white p-3 text-navy-950 shadow-sm ring-1 ring-black/5">
      <div className={`grid place-items-center rounded-xl bg-mist ${compact ? 'h-32' : 'h-40'}`}>
        <img src={p.image} alt={p.name} className="h-24 w-24 object-contain" />
      </div>
      <span className="mt-3 w-fit rounded-md bg-blue-50 px-2 py-0.5 text-[11px] text-brand">{p.brand}</span>
      <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5">{p.name}</h3>
      <p className="line-clamp-1 text-xs text-slate-500">{p.caption}</p>
      <div className="mt-2"><StockBadge stock={p.stock} /></div>
      <div className="mt-3 flex items-end justify-between">
        <div>
          {p.oldPrice ? <div className="text-xs text-slate-400 line-through">{toman(p.oldPrice)}</div> : null}
          <div className="text-sm font-bold">{toman(p.price)} <span className="text-xs font-normal">تومان</span></div>
        </div>
        <button disabled={p.stock <= 0} aria-label={`افزودن ${p.name} به سبد`} className="rounded-xl bg-brand px-3 py-2 text-xs text-white disabled:bg-slate-300">افزودن</button>
      </div>
    </article>
  );
}
