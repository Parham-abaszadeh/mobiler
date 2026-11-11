export type Customer = { id: string; name: string; phone: string; score: number; credit: string; debt: string; orders: number; status: "فعال" | "معوق" | "مسدود" | "جدید"; city: string; joined: string; email: string };
export const customers: Customer[] = [
  { id: "CUS-1042", name: "سارا احمدی", phone: "0912 345 6789", score: 842, credit: "۲۰۰ میلیون", debt: "۲۱ میلیون", orders: 8, status: "فعال", city: "تهران", joined: "۱۴۰۴/۰۶/۱۲", email: "s.ahmadi@example.com" },
  { id: "CUS-1038", name: "مهدی کریمی", phone: "0912 552 1020", score: 540, credit: "۲۰ میلیون", debt: "۱۸ میلیون", orders: 5, status: "معوق", city: "کرج", joined: "۱۴۰۴/۰۵/۲۱", email: "m.karimi@example.com" },
  { id: "CUS-1031", name: "رضا نوری", phone: "0935 440 8172", score: 765, credit: "۱۲۰ میلیون", debt: "۰", orders: 12, status: "فعال", city: "اصفهان", joined: "۱۴۰۴/۰۴/۰۸", email: "r.noori@example.com" },
  { id: "CUS-1027", name: "نگار محمدی", phone: "0910 221 4055", score: 392, credit: "۰", debt: "۴۲ میلیون", orders: 4, status: "مسدود", city: "شیراز", joined: "۱۴۰۴/۰۳/۱۷", email: "n.mohammadi@example.com" },
  { id: "CUS-1022", name: "علی رضایی", phone: "0915 333 9210", score: 710, credit: "۸۰ میلیون", debt: "۱۲ میلیون", orders: 3, status: "فعال", city: "مشهد", joined: "۱۴۰۴/۰۲/۲۹", email: "a.rezaei@example.com" },
  { id: "CUS-1018", name: "نازنین حسینی", phone: "0902 611 7720", score: 0, credit: "در انتظار", debt: "۰", orders: 0, status: "جدید", city: "رشت", joined: "۱۴۰۴/۰۸/۰۲", email: "n.hosseini@example.com" },
  { id: "CUS-1012", name: "امیرحسین مرادی", phone: "0917 883 1234", score: 618, credit: "۶۰ میلیون", debt: "۹ میلیون", orders: 6, status: "فعال", city: "تبریز", joined: "۱۴۰۴/۰۷/۱۹", email: "a.moradi@example.com" },
  { id: "CUS-1004", name: "الهام عباسی", phone: "0936 728 9100", score: 455, credit: "۱۰ میلیون", debt: "۳۲ میلیون", orders: 2, status: "معوق", city: "یزد", joined: "۱۴۰۴/۰۱/۱۱", email: "e.abbasi@example.com" },
];
export const products = [
  { id: "LP-1001", name: "لپ‌تاپ ASUS Vivobook 15", category: "لپ‌تاپ", brand: "ASUS", color: "نقره‌ای", price: "۳۸ میلیون", stock: 40, status: "کافی" },
  { id: "HP-2007", name: "هدفون Sony WH-1000XM5", category: "هدفون", brand: "Sony", color: "مشکی", price: "۱۴ میلیون", stock: 120, status: "کافی" },
  { id: "PH-3012", name: "گوشی Samsung Galaxy A55", category: "گوشی", brand: "Samsung", color: "آبی", price: "۱۹ میلیون", stock: 64, status: "کافی" },
  { id: "MS-4003", name: "موس Logitech MX Master", category: "لوازم جانبی", brand: "Logitech", color: "خاکستری", price: "۴ میلیون", stock: 6, status: "کم‌موجود" },
  { id: "LP-1008", name: "لپ‌تاپ Lenovo IdeaPad 3", category: "لپ‌تاپ", brand: "Lenovo", color: "خاکستری", price: "۳۱ میلیون", stock: 0, status: "ناموجود" },
];
export const transactions = [
  { id: "TX-9021", date: "۱۵ آبان ۱۴۰۵", dateISO: "2026-11-06", customer: "سارا احمدی", category: "لپ‌تاپ", type: "قسط", amount: 21000000, status: "پرداخت‌شده", method: "درگاه آنلاین" },
  { id: "TX-9018", date: "۱۴ آبان ۱۴۰۵", dateISO: "2026-11-05", customer: "مهدی کریمی", category: "هدفون", type: "قسط", amount: 21000000, status: "معوق", method: "درگاه آنلاین" },
  { id: "TX-9015", date: "۱۴ آبان ۱۴۰۵", dateISO: "2026-11-05", customer: "رضا نوری", category: "گوشی", type: "نقدی", amount: 14000000, status: "پرداخت‌شده", method: "کارت‌به‌کارت" },
  { id: "TX-9012", date: "۱۳ آبان ۱۴۰۵", dateISO: "2026-11-04", customer: "نگار محمدی", category: "لپ‌تاپ", type: "پیش‌پرداخت", amount: 32000000, status: "در انتظار", method: "درگاه آنلاین" },
  { id: "TX-9009", date: "۱۲ آبان ۱۴۰۵", dateISO: "2026-11-03", customer: "علی رضایی", category: "موبایل", type: "قسط", amount: 12000000, status: "پرداخت‌شده", method: "کیف پول" },
  { id: "TX-9004", date: "۱۱ آبان ۱۴۰۵", dateISO: "2026-11-02", customer: "الهام عباسی", category: "لوازم جانبی", type: "قسط", amount: 9000000, status: "معوق", method: "درگاه آنلاین" },
];
export const formatMoney = (amount: number) => new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
