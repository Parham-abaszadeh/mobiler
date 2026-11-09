export default function Footer() {
  return (
    <footer className="mt-16 bg-navy-950 text-white/80">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-2">
        <section id="about"><h2 className="mb-2 font-bold text-white">درباره ما</h2><p className="text-sm leading-7">موبایلر فروشگاه نمونه‌ی لوازم الکترونیکی است که به‌عنوان فروشگاه آزمایشی به سامانه اعتباریار متصل می‌شود.</p></section>
        <section id="contact"><h2 className="mb-2 font-bold text-white">تماس با ما</h2><p className="text-sm leading-7">پشتیبانی: ۰۲۱-۱۲۳۴۵۶۷۸ · support@mobiler.example</p></section>
      </div>
    </footer>
  );
}
