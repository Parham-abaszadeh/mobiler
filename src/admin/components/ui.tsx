"use client";
import Link from "next/link";
import { ArrowDownRight, ArrowUpLeft, ChevronLeft, ChevronRight, MoreHorizontal, Search } from "lucide-react";
import React from "react";
import { useAppSettings } from "@/admin/components/providers";
import { englishText } from "@/admin/lib/i18n";

function localizeNode(node: any, locale: "fa" | "en"): any {
  if (locale === "fa" || node == null || typeof node === "number" || typeof node === "boolean") return node;
  if (typeof node === "string") return englishText[node] ?? node;
  if (Array.isArray(node)) return node.map((item) => localizeNode(item, locale));
  if (React.isValidElement(node)) {
    const props: any = node.props;
    const nextProps: any = {};
    if (props.children !== undefined) nextProps.children = localizeNode(props.children, locale);
    for (const key of ["placeholder", "title", "aria-label"]) {
      if (typeof props[key] === "string") nextProps[key] = englishText[props[key]] ?? props[key];
    }
    return React.cloneElement(node as React.ReactElement<any>, nextProps);
  }
  return node;
}

export function Localize({ children }: { children: React.ReactNode }) {
  const { locale } = useAppSettings();
  return <>{localizeNode(children, locale)}</>;
}
export function PageHeader({ title, subtitle, action, eyebrow }: { title: string; subtitle?: string; eyebrow?: string; action?: React.ReactNode }) {
  const { locale } = useAppSettings();
  return <div className="page-header"><div><div className="eyebrow">{eyebrow || "CREDITYAR / WORKSPACE"}</div><h1>{localizeNode(title, locale)}</h1>{subtitle && <p>{localizeNode(subtitle, locale)}</p>}</div>{action && <div className="page-actions">{localizeNode(action, locale)}</div>}</div>;
}
export function Button({ children, variant = "primary", href, onClick, icon, type = "button", disabled, className = "", block }: {
  children: React.ReactNode; variant?: "primary" | "secondary" | "ghost" | "danger"; href?: string;
  onClick?: () => void; icon?: React.ReactNode; type?: "button" | "submit"; disabled?: boolean; className?: string; block?: boolean;
}) {
  const { locale } = useAppSettings();
  const classNames = `btn btn-${variant} ${block ? "btn-block" : ""} ${className}`;
  const content = <>{icon && <span className="btn-icon">{icon}</span>}<span>{localizeNode(children, locale)}</span></>;
  return href ? <Link href={href} className={classNames}>{content}</Link> : <button type={type} className={classNames} onClick={onClick} disabled={disabled}>{content}</button>;
}
export function StatCard({ label, value, hint, trend, icon, tone = "blue" }: {
  label: string; value: string; hint?: string; trend?: string; icon: React.ReactNode; tone?: "blue" | "green" | "amber" | "red" | "violet";
}) {
  const { locale } = useAppSettings();
  return <div className={`stat-card tone-${tone}`}><div className="stat-top"><span className="stat-icon">{icon}</span><span className="stat-label">{localizeNode(label, locale)}</span></div><div className="stat-value">{value}</div><div className="stat-bottom">{hint && <span>{localizeNode(hint, locale)}</span>}{trend && <span className={`trend ${tone === "red" ? "negative" : "positive"}`}>{trend}</span>}</div><div className="stat-glow" /></div>;
}
export function Panel({ title, subtitle, action, children, className = "" }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  const { locale } = useAppSettings();
  return <section className={`panel ${className}`}><div className="panel-heading"><div><h2>{localizeNode(title, locale)}</h2>{subtitle && <p>{localizeNode(subtitle, locale)}</p>}</div>{action && <div>{localizeNode(action, locale)}</div>}</div>{localizeNode(children, locale)}</section>;
}
export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "success" | "warning" | "danger" | "info" | "neutral" | "purple" }) {
  const { locale } = useAppSettings();
  return <span className={`badge badge-${tone}`}><i />{localizeNode(children, locale)}</span>;
}
export function Avatar({ name, size = "md", tone = "blue" }: { name: string; size?: "sm" | "md" | "lg"; tone?: string }) {
  const { locale } = useAppSettings();
  const displayName = localizeNode(name, locale) as string;
  const parts = displayName.trim().split(" ").filter(Boolean);
  const initials = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : (parts[0]?.slice(0, 2) || "CY");
  return <span className={`avatar avatar-${size} avatar-${tone}`}>{initials}</span>;
}
export function Table({ headers, rows, empty = "موردی برای نمایش وجود ندارد" }: { headers: string[]; rows: React.ReactNode[][]; empty?: string }) {
  const { locale } = useAppSettings();
  return <div className="table-wrap"><table className="data-table"><thead><tr>{headers.map((header, i) => <th key={`${header}-${i}`}>{localizeNode(header, locale)}</th>)}</tr></thead><tbody>{rows.length ? rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{localizeNode(cell, locale)}</td>)}</tr>) : <tr><td colSpan={headers.length} className="empty-cell">{localizeNode(empty, locale)}</td></tr>}</tbody></table></div>;
}
export function SearchInput({ value, onChange, placeholder = "جست‌وجو..." }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  const { locale } = useAppSettings();
  return <label className="search-field"><Search size={16}/><input value={value} onChange={e => onChange(e.target.value)} placeholder={localizeNode(placeholder, locale)}/></label>;
}
export function SelectField({ value, onChange, options, label }: { value: string; onChange: (value: string) => void; options: { label: string; value: string }[]; label?: string }) {
  const { locale } = useAppSettings();
  return <label className="select-field">{label && <span>{localizeNode(label, locale)}</span>}<select value={value} onChange={e => onChange(e.target.value)}>{options.map(o => <option key={o.value} value={o.value}>{localizeNode(o.label, locale)}</option>)}</select></label>;
}
export function Segmented({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: { label: string; value: string }[] }) {
  const { locale } = useAppSettings();
  return <div className="segmented">{options.map(o => <button key={o.value} onClick={() => onChange(o.value)} className={value === o.value ? "selected" : ""}>{localizeNode(o.label, locale)}</button>)}</div>;
}
export function Progress({ value, color = "blue" }: { value: number; color?: string }) {
  return <div className="progress-track"><span className={`progress-fill progress-${color}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }}/></div>;
}
export function EmptyState({ title, desc, action }: { title: string; desc?: string; action?: React.ReactNode }) {
  const { locale } = useAppSettings();
  return <div className="empty-state"><div className="empty-orb"><Search size={23}/></div><h3>{localizeNode(title, locale)}</h3>{desc && <p>{localizeNode(desc, locale)}</p>}{localizeNode(action, locale)}</div>;
}
export function TrendBars({ values, labels }: { values: number[]; labels: string[] }) {
  const max = Math.max(...values, 1);
  return <div className="trend-chart">{values.map((v, i) => <div className="trend-column" key={labels[i]}><div className="trend-bar" style={{ height: `${(v / max) * 100}%` }}><span>{v}</span></div><small>{labels[i]}</small></div>)}</div>;
}
export function MiniLink({ href, children }: { href: string; children: React.ReactNode }) { const { locale } = useAppSettings(); return <Link className="mini-link" href={href}>{localizeNode(children, locale)}<ChevronLeft size={14}/></Link>; }
export function TableMore() { return <button className="icon-button" aria-label="گزینه‌های بیشتر"><MoreHorizontal size={17}/></button>; }
export function Delta({ children, down = false }: { children: React.ReactNode; down?: boolean }) { return <span className={`delta ${down ? "down" : "up"}`}>{down ? <ArrowDownRight size={13}/> : <ArrowUpLeft size={13}/>} {children}</span>; }
export function Pagination({ page = 1, total = 5 }: { page?: number; total?: number }) { return <div className="pagination"><span>صفحه {page} از {total}</span><div><button disabled={page <= 1}><ChevronRight size={15}/></button><button><ChevronLeft size={15}/></button></div></div>; }
