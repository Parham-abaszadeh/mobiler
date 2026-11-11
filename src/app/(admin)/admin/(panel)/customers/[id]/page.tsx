"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Activity, ArrowDownRight, ArrowUpLeft, Ban, CalendarClock, Check, ChevronLeft, CreditCard, Download, FileText, Fingerprint, LockKeyhole, Mail, MapPin, Phone, ShieldAlert, ShieldCheck, ShoppingBag, TrendingDown, UserRound, Wallet } from "lucide-react";
import { Avatar, Badge, Button, PageHeader, Panel, Progress, StatCard, Table } from "@/admin/components/ui";
import { customers } from "@/admin/lib/data";

export default function CustomerProfilePage() {
  const params = useParams<{id:string}>();
  const customer = useMemo(() => customers.find(c => c.id === params.id) || customers[0], [params.id]);
  const [limit, setLimit] = useState(200);
  const [blocked, setBlocked] = useState(customer.status === "مسدود");
  const [notice, setNotice] = useState("");
  const transactions = [
    {id:"INS-2048", title:"قسط سوم · لپ‌تاپ ASUS", date:"۱۵ آبان ۱۴۰۵", amount:"۲۱ میلیون", state:"معوق"},
    {id:"INS-2021", title:"قسط دوم · هدفون Sony", date:"۱۵ مهر ۱۴۰۵", amount:"۱۴ میلیون", state:"پرداخت‌شده"},
    {id:"INS-1982", title:"پیش‌پرداخت · گوشی Samsung", date:"۱۵ شهریور ۱۴۰۵", amount:"۱۹ میلیون", state:"پرداخت‌شده"},
  ];
  return <>
    <PageHeader title="پرونده اعتباری مشتری" subtitle="نمای کامل سوابق خرید، اقساط، امتیاز و تصمیم‌های اعتباری." action={<Button href="/admin/customers" variant="secondary" icon={<ChevronLeft size={16}/>}>بازگشت به مشتریان</Button>}/>
    {notice && <div className="inline-notice"><Check size={15}/>{notice}<button onClick={()=>setNotice("")}>×</button></div>}
    <section className="profile-hero"><div className="profile-main"><Avatar name={customer.name} size="lg" tone="violet"/><div><div className="profile-name-row"><h2>{customer.name}</h2><Badge tone={blocked ? "danger" : customer.status === "معوق" ? "warning" : "success"}>{blocked ? "مسدود" : customer.status}</Badge></div><p>{customer.id} <span>·</span> عضو از {customer.joined}</p><div className="profile-contact"><span><Phone size={13}/>{customer.phone}</span><span><Mail size={13}/>{customer.email}</span><span><MapPin size={13}/>{customer.city}</span></div></div></div><div className="profile-hero-side"><span className="eyebrow">CUSTOMER RELATIONSHIP</span><strong>مشتری خرید اقساطی</strong><small>آخرین فعالیت: ۱۸ دقیقه پیش</small></div></section>
    <div className="stats-grid stats-four profile-stats"><StatCard label="امتیاز اعتباری" value={String(customer.score || 0)} hint="از ۱۰۰۰ امتیاز" icon={<Fingerprint size={18}/>} tone="amber"/><StatCard label="سقف اعتبار فعلی" value={`${limit} میلیون`} hint="قابل استفاده برای خرید" icon={<Wallet size={18}/>} tone="blue"/><StatCard label="بدهی جاری" value={customer.debt} hint="مجموع اقساط باز" icon={<CreditCard size={18}/>} tone="red"/><StatCard label="خریدهای اقساطی" value={`${customer.orders} مورد`} hint="از زمان عضویت" icon={<ShoppingBag size={18}/>} tone="green"/></div>
    <div className="dashboard-grid profile-content-grid">
      <div className="stack-panels">
        <Panel title="سوابق اقساط" subtitle="آخرین اقساط و وضعیت پرداخت"><Table headers={["شناسه", "شرح", "سررسید", "مبلغ", "وضعیت"]} rows={transactions.map(t=>[<span className="mono link-text">{t.id}</span>,t.title,t.date,t.amount,<Badge tone={t.state === "پرداخت‌شده" ? "success" : "warning"}>{t.state}</Badge>])}/></Panel>
        <Panel title="تاریخچه فعالیت مشتری" subtitle="رویدادهای مهم پرونده"><div className="timeline-list"><div className="timeline-item"><span className="timeline-icon success"><Check size={15}/></span><div><b>پرداخت موفق قسط دوم</b><small>تراکنش TX-9015 · ثبت خودکار</small></div><time>۱۴ مهر</time></div><div className="timeline-item"><span className="timeline-icon warning"><CalendarClock size={15}/></span><div><b>سررسید قسط سوم</b><small>یادآوری پرداخت برای مشتری ارسال شد</small></div><time>۱۵ آبان</time></div><div className="timeline-item"><span className="timeline-icon info"><FileText size={15}/></span><div><b>به‌روزرسانی پرونده اعتباری</b><small>سوابق سفارش و رفتار پرداخت تحلیل شد</small></div><time>امروز</time></div></div></Panel>
      </div>
      <div className="stack-panels">
        <Panel title="تحلیل اعتبار" subtitle="شاخص‌های تصمیم‌گیری سامانه"><div className="score-display"><div className="score-ring"><strong>{customer.score || "—"}</strong><small>Credit score</small></div><div className="score-details"><Badge tone={customer.score >= 700 ? "success" : customer.score >= 500 ? "warning" : "danger"}>{customer.score >= 700 ? "ریسک پایین" : customer.score >= 500 ? "ریسک متوسط" : "ریسک بالا"}</Badge><h3>{customer.score >= 700 ? "مشتری خوش‌حساب" : "نیازمند بررسی بیشتر"}</h3><p>امتیاز با توجه به سابقه پرداخت، تعداد تأخیرها و الگوی سفارش محاسبه شده است.</p></div></div><div className="metric-progress"><div><span>نظم پرداخت اقساط</span><b>۸۶٪</b></div><Progress value={86} color="green"/><div><span>ثبات سفارش‌ها</span><b>۷۴٪</b></div><Progress value={74}/><div><span>ریسک رفتار خرید</span><b>۲۸٪</b></div><Progress value={28} color="amber"/></div></Panel>
        <Panel title="اقدام روی اعتبار" subtitle="تغییرات مدیریتی در این بخش ثبت و لاگ می‌شوند"><div className="credit-control"><label>سقف اعتبار جدید</label><div className="number-stepper"><button onClick={()=>setLimit(v=>Math.max(0,v-10))}>−</button><strong>{limit.toLocaleString("fa-IR")} میلیون تومان</strong><button onClick={()=>setLimit(v=>v+10)}>+</button></div><Button block onClick={()=>setNotice(`سقف اعتبار به ${limit} میلیون تومان تغییر کرد.`)} icon={<Check size={15}/>}>ثبت سقف اعتبار</Button><div className="profile-actions"><Button variant="secondary" onClick={()=>{setLimit(Math.max(0,limit-20));setNotice("سقف اعتبار ۲۰ میلیون تومان کاهش یافت.")}} icon={<TrendingDown size={15}/>}>کاهش سقف</Button><Button variant={blocked ? "primary" : "danger"} onClick={()=>{setBlocked(v=>!v);setNotice(blocked?"محدودیت حساب برداشته شد.":"حساب مشتری مسدود شد.")}} icon={blocked?<ShieldCheck size={15}/>:<Ban size={15}/>}>{blocked ? "رفع مسدودی" : "مسدودسازی حساب"}</Button></div></div></Panel>
        <Panel title="اطلاعات تکمیلی" subtitle="مشخصات ثبت‌شده مشتری"><div className="detail-pairs"><div><span>شناسه ملی</span><b>۰۰۸۴••••۱۲۳</b></div><div><span>تاریخ عضویت</span><b>{customer.joined}</b></div><div><span>تعداد سفارش‌ها</span><b>{customer.orders.toLocaleString("fa-IR")}</b></div><div><span>وضعیت احراز هویت</span><Badge tone="success">تأییدشده</Badge></div></div></Panel>
      </div>
    </div>
  </>;
}
