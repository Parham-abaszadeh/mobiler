"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, Filter, Plus, SlidersHorizontal, UserRoundSearch } from "lucide-react";
import { customers, Customer } from "@/admin/lib/data";
import { Avatar, Badge, Button, PageHeader, Panel, SearchInput, SelectField, StatCard, Table } from "@/admin/components/ui";
import { useAppSettings } from "@/admin/components/providers";

type Mode = "all" | "overdue" | "blocked" | "new";
export function CustomersTable({ mode = "all" }: { mode?: Mode }) {
  const { locale } = useAppSettings();
  const isFa = locale === "fa";
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const [sort, setSort] = useState("recent");
  const statusForMode: Record<Mode, string> = { all: "همه", overdue: "معوق", blocked: "مسدود", new: "جدید" };
  const filtered = useMemo(() => {
    let list = customers.filter(c => mode === "all" || c.status === statusForMode[mode]);
    if (query) list = list.filter(c => `${c.name} ${c.id} ${c.phone}`.toLowerCase().includes(query.toLowerCase()));
    if (city !== "all") list = list.filter(c => c.city === city);
    if (sort === "score") list = [...list].sort((a,b) => b.score-a.score);
    if (sort === "debt") list = [...list].sort((a,b) => parseInt(b.debt.replace(/\D/g,""))-parseInt(a.debt.replace(/\D/g,"")));
    return list;
  }, [mode, query, city, sort]);
  const title = mode === "all" ? (isFa ? "مشتریان خرید اقساطی" : "Installment customers") : mode === "overdue" ? (isFa ? "مشتریان معوق‌شده" : "Overdue customers") : mode === "blocked" ? (isFa ? "مشتریان مسدودشده" : "Blocked customers") : (isFa ? "مشتریان جدید" : "New customers");
  const subtitle = mode === "all" ? (isFa ? "مدیریت پرونده، اعتبار و وضعیت تمام مشتریان دارای خرید اقساطی." : "Manage credit profiles and installment customer accounts.") : mode === "overdue" ? (isFa ? "مشتریانی که یک یا چند قسط سررسیدشده و پرداخت‌نشده دارند." : "Customers with one or more overdue installments.") : mode === "blocked" ? (isFa ? "حساب‌هایی که به‌دلیل ریسک یا تخلف محدود شده‌اند." : "Accounts restricted due to risk or policy violations.") : (isFa ? "درخواست‌های تازه ثبت‌شده که هنوز سابقه خرید اقساطی ندارند." : "Recently registered customers awaiting their first credit decision.");
  const rows = filtered.map(c => [<Link className="table-person table-person-link" href={`/admin/customers/${c.id}`}><Avatar name={c.name} size="sm"/><div><b>{c.name}</b><small>{c.id}</small></div></Link>, <span className="mono muted-cell">{c.phone}</span>, <b>{c.score ? c.score.toLocaleString("fa-IR") : "—"}</b>, c.credit, c.debt, <Badge tone={c.status === "فعال" ? "success" : c.status === "معوق" ? "warning" : c.status === "مسدود" ? "danger" : "info"}>{isFa ? c.status : ({ فعال: "Active", معوق: "Overdue", مسدود: "Blocked", جدید: "New" } as Record<string,string>)[c.status]}</Badge>, <Link className="table-action-link" href={`/admin/customers/${c.id}`}>{isFa ? "مشاهده پرونده" : "View profile"}</Link>]);
  const modeCount = mode === "all" ? customers.length : customers.filter(c => c.status === statusForMode[mode]).length;
  return <>
    <PageHeader title={title} subtitle={subtitle} eyebrow="CUSTOMER INTELLIGENCE" action={<><Button variant="secondary" icon={<Download size={16}/>} onClick={() => downloadCustomers(filtered)}>{isFa ? "خروجی CSV" : "Export CSV"}</Button><Button href="/admin/risk" icon={<Plus size={16}/>}>{isFa ? "اعتبارسنجی جدید" : "New assessment"}</Button></>}/>
    <div className="stats-grid stats-four compact-stats"><StatCard label={isFa ? "کل پرونده‌ها" : "Total profiles"} value={mode === "all" ? "۸۴۰" : modeCount.toLocaleString("fa-IR")} hint={isFa ? "پرونده ثبت‌شده" : "Registered profiles"} icon={<UserRoundSearch size={18}/>} tone="blue"/><StatCard label={isFa ? "فعال و خوش‌حساب" : "Active"} value="۷۶۲" hint="۹۰٫۷٪" icon={<UserRoundSearch size={18}/> } tone="green"/><StatCard label={isFa ? "معوق" : "Overdue"} value="۱۲" hint={isFa ? "نیازمند پیگیری" : "Follow-up required"} icon={<SlidersHorizontal size={18}/>} tone="amber"/><StatCard label={isFa ? "مسدود" : "Blocked"} value="۴" hint={isFa ? "محدودشده" : "Restricted"} icon={<Filter size={18}/>} tone="red"/></div>
    <Panel title={isFa ? "فهرست پرونده‌های مشتری" : "Customer profiles"} subtitle={isFa ? `${filtered.length.toLocaleString("fa-IR")} پرونده مطابق فیلترها` : `${filtered.length} profiles match your filters`}>
      <div className="table-toolbar"><SearchInput value={query} onChange={setQuery} placeholder={isFa ? "نام، شماره تماس یا شناسه مشتری..." : "Name, phone or customer ID..."}/><SelectField value={city} onChange={setCity} options={[{label:isFa?"همه شهرها":"All cities",value:"all"},...Array.from(new Set(customers.map(c=>c.city))).map(x=>({label:x,value:x}))]}/><SelectField value={sort} onChange={setSort} options={[{label:isFa?"مرتب‌سازی: جدیدترین":"Sort: Recent",value:"recent"},{label:isFa?"بالاترین امتیاز":"Highest score",value:"score"},{label:isFa?"بیشترین بدهی":"Highest debt",value:"debt"}]}/></div>
      <Table headers={isFa ? ["مشتری", "شماره تماس", "امتیاز اعتبار", "سقف اعتبار", "بدهی جاری", "وضعیت", "پرونده"] : ["Customer", "Phone", "Credit score", "Credit limit", "Current debt", "Status", "Profile"]} rows={rows} empty={isFa ? "مشتری مطابق فیلترها پیدا نشد." : "No customers match your filters."}/>
      <div className="table-footer"><span>{isFa ? `نمایش ${filtered.length.toLocaleString("fa-IR")} مورد` : `Showing ${filtered.length} records`}</span><span>{isFa ? "اطلاعات نمونه برای پیش‌نمایش رابط کاربری" : "Sample data for UI preview"}</span></div>
    </Panel>
  </>;
}
function downloadCustomers(list: Customer[]) {
  const csv = ["Customer ID,Name,Phone,Credit Score,Credit Limit,Debt,Status,City", ...list.map(c => [c.id,c.name,c.phone,c.score,c.credit,c.debt,c.status,c.city].map(v => `"${String(v).replaceAll('"','""')}"`).join(","))].join("\n");
  const blob = new Blob(["\ufeff",csv],{type:"text/csv;charset=utf-8;"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="credit-yar-customers.csv"; a.click(); URL.revokeObjectURL(url);
}
