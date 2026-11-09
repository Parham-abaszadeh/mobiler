export default function Banners() {
  return (
    <section aria-label="تبلیغات" className="mx-auto mt-10 grid max-w-7xl gap-4 px-4 md:grid-cols-2">
      <a href="/#featured" className="flex h-44 items-center rounded-3xl bg-gradient-to-l from-slate-200 to-slate-50 p-8">
        <div><h2 className="text-xl font-bold">گوشی‌های آیفون اپل</h2><p className="mt-2 text-sm text-slate-600">خرید گوشی با ضمانت اصالت و گارانتی</p></div>
      </a>
      <a href="/#featured" className="flex h-44 items-center rounded-3xl bg-gradient-to-l from-black to-navy-950 p-8 text-white">
        <div><h2 className="text-xl font-bold">لپ‌تاپ‌های حرفه‌ای</h2><p className="mt-2 text-sm text-white/70">مقایسه قیمت و مشخصات را ببینید</p></div>
      </a>
    </section>
  );
}
