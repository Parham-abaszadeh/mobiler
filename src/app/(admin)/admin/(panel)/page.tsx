"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, AlertTriangle, ArrowLeft, ArrowUpLeft, BadgeCheck, Banknote, Box, CalendarDays, CheckCircle2, Clock3, CreditCard, Fingerprint, Package, ShieldAlert, ShoppingBag, TrendingUp, Users, Wallet, Zap } from "lucide-react";
import { Avatar, Badge, MiniLink, PageHeader, Panel, Progress, StatCard, Table, TrendBars } from "@/admin/components/ui";

type Stats = { today: { sales: number; orders: number }; pending: number; inventory: { total: number; ok: number; low: number; out: number }; recent: { id: string; code: string; customer: string; product: string; total: number; status: string; createdAt: string }[] };
const fa = (n: number) => Math.round(n).toLocaleString("fa-IR");
const ST: Record<string, string> = { pending: "در انتظار", confirmed: "تأییدشده", completed: "تکمیل‌شده", cancelled: "لغوشده" };
const ago = (d: string) => { const m = Math.max(0, Math.round((Date.now() - new Date(d).getTime()) / 60000)); return m < 1 ? "هم‌اکنون" : m < 60 ? `${fa(m)} دقیقه پیش` : m < 1440 ? `${fa(m / 60)} ساعت پیش` : `${fa(m / 1440)} روز پیش`; };

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => {
    const load = () => fetch("/api/admin/stats", { cache: "no-store" }).then(r => (r.status === 401 ? ((window.location.href = "/admin/login"), null) : r.json())).then(d => d && !d.error && setStats(d)).catch(() => {});
    load(); const t = setInterval(load, 20000); return () => clearInterval(t);
  }, []);
  const inv = stats?.inventory ?? { total: 0, ok: 0, low: 0, out: 0 };
  const pct = (n: number) => (inv.total ? Math.round((n / inv.total) * 100) : 0);
  const recent = stats?.recent ?? [];
  return <>
    <PageHeader title="داشبورد مدیریتی" subtitle="نمای لحظه‌ای از اعتبار، اقساط، فروش و عملکرد انبار فروشگاه شما." eyebrow="OVERVIEW / NOVEMBER 2026" action={<div className="header-date"><CalendarDays size={15}/> سه‌شنبه، ۱۹ آبان ۱۴۰۵</div>}/>
    <div className="stats-grid stats-four">
      <StatCard label="فروش امروز" value={fa(stats?.today.sales ?? 0)} hint={`تومان · ${fa(stats?.today.orders ?? 0)} سفارش`} icon={<ShoppingBag size={19}/>} tone="green"/>
      <StatCard label="مطالبات اقساط" value="۳۱۰ م" hint="۱۲ مورد معوق" trend="۸ پرونده" icon={<CreditCard size={19}/>} tone="amber"/>
      <StatCard label="در انتظار تأیید" value={fa(stats?.pending ?? 0)} hint="سفارش جدید" icon={<Clock3 size={19}/>} tone="violet"/>
      <StatCard label="هشدارهای ریسک" value="۸" hint="۳ مورد با اولویت بالا" trend="مشاهده هشدارها" icon={<ShieldAlert size={19}/>} tone="red"/>
    </div>
    <div className="dashboard-grid main-dashboard-grid">
      <Panel title="روند فروش و وصولی" subtitle="عملکرد هشت هفته اخیر" className="sales-chart-panel" action={<button className="select-chip">۸ هفته اخیر <CalendarDays size={14}/></button>}>
        <div className="chart-summary"><div><small>مجموع فروش</small><strong>۸۴۰ میلیون تومان</strong><span className="positive-text"><TrendingUp size={13}/> ۱۲٫۸٪ رشد</span></div><div><small>وصولی اقساط</small><strong>۳۱۸ میلیون تومان</strong><span className="muted-text">۳۷٫۸٪ از فروش</span></div></div>
        <div className="chart-legend"><span><i className="legend-blue"/> فروش</span><span><i className="legend-cyan"/> وصولی اقساط</span></div>
        <div className="bar-chart"><div className="chart-grid-lines"><i/><i/><i/><i/></div><div className="bar-chart-inner">{[{l:"هفته ۱",a:60,b:34},{l:"هفته ۲",a:72,b:39},{l:"هفته ۳",a:52,b:45},{l:"هفته ۴",a:84,b:56},{l:"هفته ۵",a:68,b:42},{l:"هفته ۶",a:93,b:60},{l:"هفته ۷",a:76,b:51},{l:"هفته ۸",a:100,b:72}].map((v,i)=><div className="bar-group" key={v.l}><div className="bars"><span className="bar bar-main" style={{height:`${v.a}%`}}/><span className="bar bar-second" style={{height:`${v.b}%`}}/></div><small>{v.l}</small></div>)}</div></div>
      </Panel>
      <Panel title="وضعیت اعتبار مشتریان" subtitle="توزیع مشتریان بر اساس امتیاز اعتباری">
        <div className="credit-donut-wrap"><div className="credit-donut"><div><strong>۸۴۰</strong><small>میانگین امتیاز</small></div></div><div className="donut-legend"><div><i className="legend-green"/><span>کم‌ریسک</span><b>۶۲٪</b></div><div><i className="legend-blue"/><span>ریسک متوسط</span><b>۲۶٪</b></div><div><i className="legend-amber"/><span>پرریسک</span><b>۱۲٪</b></div></div></div>
        <div className="risk-note"><ShieldAlert size={15}/><span>۸ پرونده نیازمند بازبینی دستی هستند.</span><Link href="/admin/risk">بررسی</Link></div>
      </Panel>
    </div>
    <div className="dashboard-grid lower-dashboard-grid">
      <Panel title="آخرین سفارش‌های اقساطی" subtitle="آخرین سفارش‌های ثبت‌شده در فروشگاه (زنده)" action={<MiniLink href="/admin/sales">همه سفارش‌ها</MiniLink>} className="recent-orders-panel">
        <Table empty="هنوز سفارشی ثبت نشده است" headers={["مشتری", "محصول", "مبلغ سفارش (تومان)", "وضعیت", "زمان"]} rows={recent.map(row => [<div className="table-person"><Avatar name={row.customer} size="sm"/><div><b>{row.customer}</b><small>{row.code}</small></div></div>, row.product, fa(row.total), <Badge tone={row.status === "completed" || row.status === "confirmed" ? "success" : row.status === "pending" ? "warning" : "danger"}>{ST[row.status]}</Badge>, <span className="muted-cell">{ago(row.createdAt)}</span>])}/>
      </Panel>
      <Panel title="نمای سریع عملیات" subtitle="میانبرهای پرکاربرد سامانه" className="quick-panel">
        <div className="quick-actions-grid"><Link href="/admin/inventory/new"><span className="quick-icon blue"><Package size={18}/></span><b>افزودن محصول</b><small>ثبت کالای جدید</small><ArrowLeft size={14}/></Link><Link href="/admin/customers/new"><span className="quick-icon green"><Users size={18}/></span><b>مشتری جدید</b><small>ثبت درخواست اقساط</small><ArrowLeft size={14}/></Link><Link href="/admin/risk"><span className="quick-icon amber"><Fingerprint size={18}/></span><b>اعتبارسنجی</b><small>بررسی پرونده‌ها</small><ArrowLeft size={14}/></Link><Link href="/admin/finance"><span className="quick-icon violet"><Wallet size={18}/></span><b>گزارش مالی</b><small>حسابرسی تراکنش‌ها</small><ArrowLeft size={14}/></Link></div>
      </Panel>
    </div>
    <div className="dashboard-grid bottom-dashboard-grid">
      <Panel title="سلامت موجودی انبار" subtitle="وضعیت کلی کالاهای قابل فروش" action={<MiniLink href="/admin/inventory">مدیریت انبار</MiniLink>}>
        <div className="inventory-health"><div className="inventory-total"><Package size={19}/><strong>{fa(inv.total)}</strong><small>قلم کالا</small></div><div className="inventory-states"><div><div><span>موجودی کافی</span><b>{fa(inv.ok)} کالا</b></div><Progress value={pct(inv.ok)} color="green"/></div><div><div><span>موجودی کم</span><b>{fa(inv.low)} کالا</b></div><Progress value={pct(inv.low)} color="amber"/></div><div><div><span>ناموجود</span><b>{fa(inv.out)} کالا</b></div><Progress value={pct(inv.out)} color="red"/></div></div></div>
      </Panel>
      <Panel title="فعالیت‌های اخیر" subtitle="آخرین رخدادهای ثبت‌شده در سامانه" action={<MiniLink href="/admin/activity">مشاهده لاگ‌ها</MiniLink>}>
        <div className="timeline-list"><div className="timeline-item"><span className="timeline-icon success"><CheckCircle2 size={15}/></span><div><b>پرداخت قسط با موفقیت ثبت شد</b><small>سارا احمدی · سفارش ORD-3401</small></div><time>۵ دقیقه پیش</time></div><div className="timeline-item"><span className="timeline-icon warning"><AlertTriangle size={15}/></span><div><b>افزایش سطح ریسک مشتری</b><small>مهدی کریمی · نیازمند بازبینی</small></div><time>۱۸ دقیقه پیش</time></div><div className="timeline-item"><span className="timeline-icon info"><Box size={15}/></span><div><b>موجودی کالا به‌روزرسانی شد</b><small>هدفون Sony WH-1000XM5</small></div><time>۴۵ دقیقه پیش</time></div></div>
      </Panel>
    </div>
  </>;
}
