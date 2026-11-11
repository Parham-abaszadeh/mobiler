"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDownToLine, ArrowUpRight, CalendarDays, CircleDollarSign, PackageCheck, ShoppingBag } from "lucide-react";
import { Avatar, Badge, Button, PageHeader, Panel, SearchInput, SelectField, StatCard, Table } from "@/admin/components/ui";

type Order = { id: string; code: string; customer: string; phone: string; product: string; total: number; method: "cash" | "installment"; status: "pending" | "confirmed" | "completed" | "cancelled"; createdAt: string };
const STATUS: Record<string, string> = { pending: "در انتظار", confirmed: "تأییدشده", completed: "تکمیل‌شده", cancelled: "لغوشده" };
const METHOD: Record<string, string> = { cash: "نقدی", installment: "اقساطی" };
const fa = (n: number) => Math.round(n).toLocaleString("fa-IR");

export default function SalesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [method, setMethod] = useState("all");
  const [state, setState] = useState("all");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      if (res.status === 401) { window.location.href = "/admin/login"; return; }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      setOrders(data); setError("");
    } catch (e: any) { setError(e.message || "دریافت سفارش‌ها ممکن نشد"); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); const t = setInterval(load, 15000); return () => clearInterval(t); }, [load]);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const live = orders.filter(o => o.status !== "cancelled");
    const todays = live.filter(o => new Date(o.createdAt).toDateString() === today);
    return {
      todayCount: todays.length,
      todayInstallment: todays.filter(o => o.method === "installment").length,
      todaySum: todays.reduce((s, o) => s + o.total, 0),
      pending: orders.filter(o => o.status === "pending").length,
      avg: live.length ? live.reduce((s, o) => s + o.total, 0) / live.length : 0,
    };
  }, [orders]);

  const filtered = useMemo(() => orders.filter(o =>
    (!query || `${o.code} ${o.customer} ${o.product}`.toLowerCase().includes(query.toLowerCase())) &&
    (method === "all" || o.method === method) && (state === "all" || o.status === state)
  ), [orders, query, method, state]);

  async function changeStatus(o: Order, status: string) {
    if (status === "cancelled" && !window.confirm("با لغو سفارش، موجودی کالاها به انبار برمی‌گردد و دیگر قابل تغییر نیست. ادامه می‌دهید؟")) return;
    const res = await fetch(`/api/admin/orders/${o.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) { setError(d.error || "تغییر وضعیت ناموفق بود"); return; }
    setError(""); load();
  }

  return <>
    <PageHeader title="مدیریت فروش" subtitle="سفارش‌های ثبت‌شده در فروشگاه، روش پرداخت و وضعیت پردازش." eyebrow="COMMERCE / ORDERS" action={<Button variant="secondary" icon={<ArrowDownToLine size={16}/>} onClick={() => window.print()}>گزارش سفارش‌ها</Button>}/>
    <div className="stats-grid stats-four">
      <StatCard label="سفارش‌های امروز" value={fa(stats.todayCount)} hint={`${fa(stats.todayInstallment)} سفارش اقساطی`} icon={<ShoppingBag size={18}/>} tone="blue"/>
      <StatCard label="مبلغ فروش امروز" value={fa(stats.todaySum)} hint="تومان" icon={<CircleDollarSign size={18}/>} tone="green"/>
      <StatCard label="در انتظار پردازش" value={fa(stats.pending)} hint="نیازمند تأیید" icon={<PackageCheck size={18}/>} tone="amber"/>
      <StatCard label="میانگین ارزش سفارش" value={fa(stats.avg)} hint="تومان" icon={<ArrowUpRight size={18}/>} tone="violet"/>
    </div>
    {error && <div className="form-error">{error}</div>}
    <Panel title="فهرست سفارش‌ها" subtitle="وضعیت هر سفارش را از ستون آخر تغییر دهید.">
      <div className="table-toolbar">
        <SearchInput value={query} onChange={setQuery} placeholder="جست‌وجوی شماره سفارش، مشتری یا کالا..."/>
        <SelectField value={method} onChange={setMethod} options={[{ label: "همه روش‌ها", value: "all" }, { label: "اقساطی", value: "installment" }, { label: "نقدی", value: "cash" }]}/>
        <SelectField value={state} onChange={setState} options={[{ label: "همه وضعیت‌ها", value: "all" }, ...Object.entries(STATUS).map(([value, label]) => ({ label, value }))]}/>
        <span className="filter-count">{filtered.length.toLocaleString("fa-IR")} نتیجه</span>
      </div>
      <Table
        empty={loading ? "در حال بارگذاری..." : "هنوز سفارشی ثبت نشده است"}
        headers={["شماره سفارش", "مشتری", "محصول", "تاریخ ثبت", "مبلغ (تومان)", "روش پرداخت", "وضعیت", "تغییر وضعیت"]}
        rows={filtered.map(o => [
          <b className="mono link-text">{o.code}</b>,
          <div className="table-person"><Avatar name={o.customer} size="sm"/><div><b>{o.customer}</b><small>{o.phone}</small></div></div>,
          o.product,
          new Date(o.createdAt).toLocaleDateString("fa-IR"),
          fa(o.total),
          <Badge tone={o.method === "installment" ? "info" : "neutral"}>{METHOD[o.method]}</Badge>,
          <Badge tone={o.status === "completed" || o.status === "confirmed" ? "success" : o.status === "pending" ? "warning" : "danger"}>{STATUS[o.status]}</Badge>,
          o.status === "cancelled" ? <span className="muted-cell">—</span> : <SelectField value={o.status} onChange={v => changeStatus(o, v)} options={Object.entries(STATUS).map(([value, label]) => ({ label, value }))}/>,
        ])}
      />
      <div className="table-footer"><span>نمایش {filtered.length.toLocaleString("fa-IR")} سفارش</span><span><CalendarDays size={13}/> بروزرسانی خودکار هر ۱۵ ثانیه</span></div>
    </Panel>
  </>;
}
