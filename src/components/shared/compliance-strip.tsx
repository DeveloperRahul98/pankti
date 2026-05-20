import {
  BadgeCheck,
  ShieldCheck,
  Receipt,
  CalendarCheck,
  Sparkles,
} from "lucide-react";
import { COMPLIANCE } from "@/lib/site";

// Trust + compliance signals shown in the footer. Tender committees and
// corporate clients scan for FSSAI / GST / certifications before reading
// anything else — surfacing them prominently signals "this is a serious,
// legally-registered, audit-ready operation."
export function ComplianceStrip() {
  const yearsServing = new Date().getFullYear() - COMPLIANCE.establishedYear;

  const items: {
    icon: typeof BadgeCheck;
    label: string;
    value: string;
  }[] = [
    {
      icon: BadgeCheck,
      label: "FSSAI Reg.",
      value: COMPLIANCE.fssaiNumber,
    },
    {
      icon: Receipt,
      label: "GSTIN",
      value: COMPLIANCE.gstin,
    },
    {
      icon: ShieldCheck,
      label: "Certified",
      value: "ISO 22000 · HACCP",
    },
    {
      icon: CalendarCheck,
      label: `Est. ${COMPLIANCE.establishedYear}`,
      value: `${yearsServing} years serving Hyderabad`,
    },
  ];

  return (
    <section
      aria-label="Compliance & trust signals"
      className="border border-[var(--border)] bg-[var(--bg)] rounded-2xl px-5 py-4 mb-12"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <span className="text-[10px] uppercase tracking-[0.18em] text-primary font-semibold">
          Registered, insured, audit-ready
        </span>
      </div>
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <li
              key={it.label}
              className="flex items-start gap-2.5 rounded-lg bg-[var(--bg-elev)] border border-[var(--border)] p-3"
            >
              <Icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
                  {it.label}
                </div>
                <div
                  className="text-xs font-semibold text-fg tabular-nums truncate"
                  title={it.value}
                >
                  {it.value}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {COMPLIANCE.bankReady && (
        <p className="mt-3 text-[11px] text-fg-subtle">
          Accepts UPI · NEFT · Cheque · GST invoices on request · Hygiene
          audits welcome at the kitchen on appointment.
        </p>
      )}
    </section>
  );
}
