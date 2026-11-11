// دسته‌بندی‌های مشترک فروشگاه و پنل
export const CATEGORY_SLUGS = ['mobile', 'laptop', 'headphone', 'powerbank', 'accessory'];

export const toLatinDigits = (s) =>
  String(s ?? '')
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

// عدد صحیح در بازه؛ در غیر این صورت null
export function toInt(v, min, max) {
  const n = typeof v === 'string' ? Number(toLatinDigits(v).trim()) : v;
  if (typeof n !== 'number' || !Number.isFinite(n) || !Number.isInteger(n)) return null;
  if (n < min || n > max) return null;
  return n;
}

export const shape = (p) => ({
  id: String(p._id),
  sku: p.sku || String(p.slug || '').toUpperCase(),
  name: p.name,
  category: p.category,
  brand: p.brand || '—',
  price: p.price,
  stock: p.stock ?? 0,
  minStock: p.minStock ?? 5,
  colors: p.colors || [],
  colorHex: p.colorHex || '',
  isOffer: !!p.isOffer,
  sold: p.sold ?? 0,
  image: p.image || ''
});
