"use client";
import jsPDF from "jspdf";
import type { PlateLine } from "@/lib/plate-store";
import { MENU, COURSES, type MenuItem } from "@/data/menu";
import { SITE } from "@/lib/site";

export type MenuCardMeta = {
  title?: string; // e.g. "Sangeet menu", "Wedding feast"
  eventDate?: string; // ISO date, optional
  hostName?: string; // e.g. "Sneha & Arjun's Wedding"
};

// Uses jsPDF's built-in fonts only (helvetica, times) — no custom TTF load,
// which keeps the menu card lightweight and avoids font-registration errors.
// Menu cards don't show prices, so we don't need the rupee glyph from Roboto.

export async function generateMenuCardPdf(
  lines: PlateLine[],
  meta: MenuCardMeta = {},
) {
  // A5 portrait — 148 × 210 mm. Comfortable on a home printer and the
  // right scale to fold or stand on a guest table.
  const doc = new jsPDF({ unit: "pt", format: "a5", orientation: "portrait" });
  const serifFamily = "times";
  const sansFamily = "helvetica";

  const w = doc.internal.pageSize.getWidth(); // 420pt
  const h = doc.internal.pageSize.getHeight(); // 595pt
  const margin = 44;

  // Group dishes by course preserving the canonical course order.
  const byCourse = new Map<string, { item: MenuItem; qty: number }[]>();
  for (const line of lines) {
    const item = MENU.find((m) => m.id === line.itemId);
    if (!item) continue;
    if (!byCourse.has(item.course)) byCourse.set(item.course, []);
    byCourse.get(item.course)!.push({ item, qty: line.qty });
  }

  // ── Decorative outer border (subtle, saffron) ─────────────────────────
  doc.setDrawColor(232, 163, 61);
  doc.setLineWidth(0.8);
  doc.rect(20, 20, w - 40, h - 40);
  doc.setLineWidth(0.3);
  doc.setDrawColor(180, 130, 50);
  doc.rect(26, 26, w - 52, h - 52);

  let y = 70;

  // ── Eyebrow ──────────────────────────────────────────────────────────
  doc.setFont(sansFamily, "bold");
  doc.setFontSize(8);
  doc.setTextColor(201, 132, 35);
  const eyebrow = "✦  PANKTI  ✦";
  doc.text(eyebrow, w / 2, y, { align: "center" });

  y += 30;

  // ── Big "MENU" title ─────────────────────────────────────────────────
  doc.setFont(serifFamily, "bold");
  doc.setFontSize(46);
  doc.setTextColor(14, 14, 15);
  doc.setCharSpace(8); // spaced-out letters for an editorial feel
  doc.text("MENU", w / 2, y + 32, { align: "center" });
  doc.setCharSpace(0);

  y += 64;

  // ── Optional subtitle (host / occasion / date) ───────────────────────
  if (meta.hostName || meta.title || meta.eventDate) {
    doc.setFont(serifFamily, "normal");
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);

    if (meta.hostName) {
      doc.text(meta.hostName, w / 2, y, { align: "center" });
      y += 16;
    } else if (meta.title) {
      doc.text(meta.title, w / 2, y, { align: "center" });
      y += 16;
    }

    if (meta.eventDate) {
      doc.setFont(sansFamily, "normal");
      doc.setFontSize(9);
      doc.setTextColor(140, 140, 140);
      const formattedDate = formatDate(meta.eventDate);
      doc.text(formattedDate, w / 2, y, { align: "center" });
      y += 16;
    }

    y += 4;
  }

  // ── Short saffron rule between header and dishes ─────────────────────
  doc.setDrawColor(232, 163, 61);
  doc.setLineWidth(0.5);
  const ruleLen = 60;
  doc.line(w / 2 - ruleLen / 2, y, w / 2 + ruleLen / 2, y);

  y += 24;

  // ── Courses ──────────────────────────────────────────────────────────
  const usedCourses = COURSES.filter((c) => byCourse.has(c.id));

  for (const course of usedCourses) {
    const items = byCourse.get(course.id)!;

    // Page break if running out of space
    if (y > h - 80) {
      doc.addPage();
      y = 70;
    }

    // Course header — small uppercase with side dashes
    doc.setFont(sansFamily, "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(201, 132, 35);
    const courseLabel = course.label.toUpperCase();
    const labelWidth = doc.getTextWidth(courseLabel);
    const sideDashLen = 14;
    const gap = 8;
    const startX =
      w / 2 - (labelWidth / 2 + gap + sideDashLen);
    doc.setLineWidth(0.5);
    doc.setDrawColor(201, 132, 35);
    doc.line(startX, y - 3, startX + sideDashLen, y - 3);
    doc.text(courseLabel, w / 2, y, { align: "center" });
    doc.line(
      w / 2 + labelWidth / 2 + gap,
      y - 3,
      w / 2 + labelWidth / 2 + gap + sideDashLen,
      y - 3,
    );

    y += 16;

    // Dish list — name only, with veg/non-veg dot prefix
    doc.setFont(serifFamily, "normal");
    doc.setFontSize(13);
    doc.setTextColor(20, 20, 20);
    for (const { item } of items) {
      if (y > h - 60) {
        doc.addPage();
        y = 70;
      }
      // Veg / non-veg dot
      if (item.veg) {
        doc.setFillColor(58, 157, 74);
      } else {
        doc.setFillColor(192, 57, 43);
      }
      doc.circle(w / 2 - doc.getTextWidth(item.name) / 2 - 10, y - 4, 2, "F");
      doc.setTextColor(20, 20, 20);
      doc.text(item.name, w / 2, y, { align: "center" });
      y += 17;
    }

    y += 10;
  }

  // ── Footer ───────────────────────────────────────────────────────────
  const footerY = h - 38;
  doc.setFont(sansFamily, "normal");
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text(
    `with love  ·  ${SITE.name} Catering  ·  ${SITE.phone}`,
    w / 2,
    footerY,
    { align: "center" },
  );

  doc.save(`Pankti-Menu-Card-${Date.now()}.pdf`);
}

function formatDate(iso: string): string {
  // Accept ISO date (yyyy-mm-dd) or already-formatted strings.
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
