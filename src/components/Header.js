const LINKS = [
  ['خانه', '/'],
  ['محصولات', '/#featured'],
  ['پرفروش‌ترین‌ها', '/#bestsellers'],
  ['تماس با ما', '/#contact'],
  ['درباره ما', '/#about']
];

export default function Header() {
  return (
    <header className="relative bg-gradient-to-b from-navy-950 to-navy-900 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <a href="/" className="text-2xl font-extrabold tracking-tight">موبایلر</a>
        <nav aria-label="منوی اصلی" className="hidden gap-7 text-sm md:flex">
          {LINKS.map(([t, h]) => (
            <a key={t} href={h} className="text-white/80 transition hover:text-white">{t}</a>
          ))}
        </nav>
        <a href="/cart" className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/20">سبد خرید</a>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-2">
        <form action="/search" className="glass mx-auto flex max-w-2xl items-center gap-2 rounded-2xl px-4 py-2 shadow-lg" role="search">
          <input name="q" type="search" aria-label="جستجو" placeholder="جستجوی گوشی، لپ‌تاپ، هدفون..." className="w-full bg-transparent py-2 text-sm text-white placeholder:text-white/60 focus:outline-none" />
          <button className="rounded-xl bg-white px-5 py-2 text-sm font-medium text-brand">جستجو</button>
        </form>
      </div>
    </header>
  );
}
