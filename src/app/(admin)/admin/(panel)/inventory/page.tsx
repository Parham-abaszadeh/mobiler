"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowDownToLine, Box, Boxes, Package, Plus } from "lucide-react";
import { Badge, Button, PageHeader, Panel, SearchInput, SelectField, StatCard, Table } from "@/admin/components/ui";

type Product = { id: string; sku: string; name: string; category: string; brand: string; price: number; stock: number; minStock: number; colors: string[]; colorHex: string };
const CAT: Record<string, string> = { mobile: "گوشی", laptop: "لپ‌تاپ", headphone: "هدفون", powerbank: "پاور بانک", accessory: "لوازم جانبی" };
const statusOf = (p: Product) => (p.stock <= 0 ? "ناموجود" : p.stock <= p.minStock ? "کم‌موجود" : "کافی");
const fa = (n: number) => n.toLocaleString("fa-IR");
const field: React.CSSProperties = { width: 96, padding: "5px 8px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)" };

export default function InventoryPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState({ stock: "", price: "" });

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/products", { cache: "no-store" });
      if (res.status === 401) { window.location.href = "/admin/login"; return; }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      setItems(data); setError("");
    } catch (e: any) { setError(e.message || "دریافت اطلاعات ممکن نشد"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  // موجودی تغییر‌کرده توسط سفارش‌های فروشگاه هر ۱۵ ثانیه به‌روز می‌شود (وقتی در حال ویرایش نیستیم)
  useEffect(() => { if (editing) return; const t = setInterval(load, 15000); return () => clearInterval(t); }, [editing, load]);

  const stats = useMemo(() => ({
    total: items.length,
    ok: items.filter(p => statusOf(p) === "کافی").length,
    low: items.filter(p => statusOf(p) === "کم‌موجود").length,
    out: items.filter(p => statusOf(p) === "ناموجود").length,
  }), [items]);

  const filtered = useMemo(() => items.filter(p =>
    (!query || `${p.sku} ${p.name} ${p.brand}`.toLowerCase().includes(query.toLowerCase())) &&
    (category === "all" || p.category === category) &&
    (status === "all" || (status === "low" ? statusOf(p) === "کم‌موجود" : status === "out" ? statusOf(p) === "ناموجود" : statusOf(p) === "کافی"))
  ), [items, query, category, status]);

  async function save(p: Product) {
    const res = await fetch(`/api/admin/products/${p.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stock: Number(draft.stock), price: Number(draft.price) }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { setError(data.error || "ذخیره ناموفق بود"); return; }
    setItems(list => list.map(x => (x.id === p.id ? data : x)));
    setEditing(null); setError("");
  }
  async function remove(p: Product) {
    if (!window.confirm(`محصول «${p.name}» برای همیشه از فروشگاه حذف شود؟`)) return;
    const res = await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
    if (!res.ok) { const d = await res.json().catch(() => ({})); setError(d.error || "حذف ناموفق بود"); return; }
    setItems(list => list.filter(x => x.id !== p.id));
  }

  return <>
    <PageHeader title="مدیریت انبار" subtitle="کنترل موجودی و قیمت کالاها؛ تغییرات بلافاصله در فروشگاه نمایش داده می‌شود." eyebrow="INVENTORY / CATALOG" action={<><Button variant="secondary" icon={<ArrowDownToLine size={16}/>} onClick={() => window.print()}>گزارش موجودی</Button><Button href="/admin/inventory/new" icon={<Plus size={17}/>}>افزودن محصول</Button></>}/>
    <div className="stats-grid stats-four">
      <StatCard label="کل محصولات" value={fa(stats.total)} hint="در کاتالوگ فروشگاه" icon={<Boxes size={18}/>} tone="blue"/>
      <StatCard label="موجودی کافی" value={fa(stats.ok)} hint="قابل سفارش" icon={<Package size={18}/>} tone="green"/>
      <StatCard label="کم‌موجود" value={fa(stats.low)} hint="نزدیک نقطه سفارش" icon={<AlertTriangle size={18}/>} tone="amber"/>
      <StatCard label="ناموجود" value={fa(stats.out)} hint="نیازمند تأمین" icon={<Box size={18}/>} tone="red"/>
    </div>
    {error && <div className="form-error">{error}</div>}
    <Panel title="کاتالوگ و موجودی محصولات" subtitle="برای اصلاح موجودی یا قیمت، روی «ویرایش» بزنید.">
      <div className="table-toolbar">
        <SearchInput value={query} onChange={setQuery} placeholder="جست‌وجوی نام، کد کالا یا برند..."/>
        <SelectField value={category} onChange={setCategory} options={[{ label: "همه دسته‌ها", value: "all" }, ...Object.entries(CAT).map(([value, label]) => ({ label, value }))]}/>
        <SelectField value={status} onChange={setStatus} options={[{ label: "همه وضعیت‌ها", value: "all" }, { label: "موجودی کافی", value: "ok" }, { label: "کم‌موجود", value: "low" }, { label: "ناموجود", value: "out" }]}/>
      </div>
      <Table
        empty={loading ? "در حال بارگذاری..." : "محصولی پیدا نشد"}
        headers={["محصول", "کد کالا", "دسته", "برند", "رنگ", "قیمت (تومان)", "موجودی", "وضعیت", "عملیات"]}
        rows={filtered.map(p => {
          const isEdit = editing === p.id;
          const st = statusOf(p);
          return [
            <div className="product-cell"><span className="product-thumb" style={{ background: p.colorHex || "linear-gradient(135deg,#293d61,#172235)" }}><Package size={18}/></span><b>{p.name}</b></div>,
            <span className="mono link-text">{p.sku}</span>,
            CAT[p.category] || p.category,
            p.brand,
            <span className="color-cell"><i style={{ background: p.colorHex || "#8093b8" }}/>{p.colors[0] || "—"}</span>,
            isEdit ? <input style={field} type="number" min={0} value={draft.price} onChange={e => setDraft({ ...draft, price: e.target.value })}/> : fa(p.price),
            isEdit ? <input style={{ ...field, width: 72 }} type="number" min={0} value={draft.stock} onChange={e => setDraft({ ...draft, stock: e.target.value })}/> : fa(p.stock),
            <Badge tone={st === "کافی" ? "success" : st === "کم‌موجود" ? "warning" : "danger"}>{st}</Badge>,
            isEdit
              ? <span style={{ display: "flex", gap: 6 }}><Button onClick={() => save(p)}>ذخیره</Button><Button variant="ghost" onClick={() => setEditing(null)}>انصراف</Button></span>
              : <span style={{ display: "flex", gap: 6 }}><Button variant="secondary" onClick={() => { setEditing(p.id); setDraft({ stock: String(p.stock), price: String(p.price) }); }}>ویرایش</Button><Button variant="danger" onClick={() => remove(p)}>حذف</Button></span>,
          ];
        })}
      />
      <div className="table-footer"><span>نمایش {filtered.length.toLocaleString("fa-IR")} محصول از کاتالوگ</span><span>همگام‌سازی با فروشگاه: فعال</span></div>
    </Panel>
  </>;
}
