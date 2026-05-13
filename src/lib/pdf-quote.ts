"use client";
import jsPDF from "jspdf";
import type { PlateLine } from "@/lib/plate-store";
import { MENU } from "@/data/menu";
import { SITE } from "@/lib/site";
import { formatINRPlain } from "@/lib/utils";

export type QuoteMeta = {
  name?: string;
  phone?: string;
  eventDate?: string;
  occasion?: string;
  guests: number;
};

// Cache the font bytes once per page-load so we don't re-fetch on every PDF.
let robotoBase64: string | null = null;

async function loadRupeeFont(doc: jsPDF) {
  if (!robotoBase64) {
    const resp = await fetch("/fonts/Roboto-Regular.ttf");
    if (!resp.ok) throw new Error("Could not load font for PDF");
    const buf = await resp.arrayBuffer();
    // Convert binary -> base64 in chunks to avoid call-stack limits
    const bytes = new Uint8Array(buf);
    let bin = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      bin += String.fromCharCode.apply(
        null,
        Array.from(bytes.subarray(i, i + chunk)),
      );
    }
    robotoBase64 = btoa(bin);
  }
  doc.addFileToVFS("Roboto-Regular.ttf", robotoBase64);
  doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  doc.addFont("Roboto-Regular.ttf", "Roboto", "bold");
}

export async function generateQuotePdf(lines: PlateLine[], meta: QuoteMeta) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  await loadRupeeFont(doc);

  const w = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = 56;

  // Saffron accent bar
  doc.setFillColor(232, 163, 61);
  doc.rect(0, 0, w, 6, "F");

  // Brand
  doc.setTextColor(14, 14, 15);
  doc.setFont("times", "bold");
  doc.setFontSize(28);
  doc.text("Pankti", margin, y);
  doc.setFont("times", "italic");
  doc.setFontSize(11);
  doc.setTextColor(120, 120, 120);
  doc.text(SITE.tagline, margin, y + 16);

  // Right header
  doc.setFont("Roboto", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(SITE.phone, w - margin, y - 4, { align: "right" });
  doc.text(SITE.email, w - margin, y + 8, { align: "right" });
  doc.text(`${SITE.address}, ${SITE.city}`, w - margin, y + 20, {
    align: "right",
  });

  y += 56;
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, w - margin, y);
  y += 28;

  // Quote heading
  doc.setFont("times", "bold");
  doc.setFontSize(20);
  doc.setTextColor(14, 14, 15);
  doc.text("Catering Quote", margin, y);
  doc.setFont("Roboto", "normal");
  doc.setFontSize(10);
  doc.setTextColor(110, 110, 110);
  doc.text(
    `Generated ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`,
    w - margin,
    y,
    { align: "right" },
  );

  y += 28;

  // Client meta block
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  const metaPairs: [string, string][] = [
    ["Name", meta.name || "—"],
    ["Phone", meta.phone || "—"],
    ["Event date", meta.eventDate || "—"],
    ["Occasion", meta.occasion || "—"],
    ["Guests", String(meta.guests)],
  ];
  metaPairs.forEach(([k, v], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = margin + col * 240;
    const ry = y + row * 18;
    doc.setFont("Roboto", "bold");
    doc.setTextColor(14, 14, 15);
    doc.text(k, x, ry);
    doc.setFont("Roboto", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(v, x + 72, ry);
  });
  y += Math.ceil(metaPairs.length / 2) * 18 + 18;

  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, w - margin, y);
  y += 22;

  // Items table header
  doc.setFont("Roboto", "bold");
  doc.setFontSize(9);
  doc.setTextColor(14, 14, 15);
  doc.text("ITEM", margin, y);
  doc.text("QTY", w - margin - 180, y, { align: "right" });
  doc.text("PRICE", w - margin - 100, y, { align: "right" });
  doc.text("SUBTOTAL", w - margin, y, { align: "right" });
  y += 8;
  doc.setDrawColor(232, 163, 61);
  doc.line(margin, y, w - margin, y);
  y += 16;

  // Items
  doc.setFont("Roboto", "normal");
  doc.setFontSize(10);
  let perPlate = 0;
  for (const line of lines) {
    const item = MENU.find((m) => m.id === line.itemId);
    if (!item) continue;
    if (y > 740) {
      doc.addPage();
      y = 64;
    }
    const subtotal = item.price * line.qty;
    perPlate += subtotal;
    doc.setTextColor(14, 14, 15);
    doc.text(item.name, margin, y);
    doc.setTextColor(110, 110, 110);
    doc.text(
      `${item.veg ? "Veg" : "Non-veg"} · ${item.cuisine === "south" ? "South Indian" : item.cuisine === "north" ? "North Indian" : "Common"}`,
      margin,
      y + 12,
    );
    doc.setTextColor(14, 14, 15);
    doc.text(String(line.qty), w - margin - 180, y, { align: "right" });
    doc.text(formatINRPlain(item.price), w - margin - 100, y, {
      align: "right",
    });
    doc.text(formatINRPlain(subtotal), w - margin, y, { align: "right" });
    y += 28;
  }

  // Totals
  y += 6;
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, w - margin, y);
  y += 22;
  doc.setFont("Roboto", "normal");
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text("Per plate", margin, y);
  doc.setFont("Roboto", "bold");
  doc.setTextColor(14, 14, 15);
  doc.text(formatINRPlain(perPlate), w - margin, y, { align: "right" });
  y += 18;
  doc.setFont("Roboto", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text(`Guests × ${meta.guests}`, margin, y);
  doc.setFont("Roboto", "bold");
  doc.setTextColor(14, 14, 15);
  doc.text(formatINRPlain(perPlate * meta.guests), w - margin, y, {
    align: "right",
  });
  y += 24;

  // Grand total
  doc.setFillColor(247, 240, 226);
  doc.rect(margin - 8, y - 16, w - 2 * margin + 16, 36, "F");
  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.setTextColor(14, 14, 15);
  doc.text("Estimated total", margin, y + 4);
  doc.setFont("Roboto", "bold");
  doc.setFontSize(18);
  doc.setTextColor(201, 132, 35);
  doc.text(formatINRPlain(perPlate * meta.guests), w - margin, y + 6, {
    align: "right",
  });

  y += 60;
  doc.setFont("Roboto", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(140, 140, 140);
  doc.text(
    "This is an estimate based on selected items. Final pricing may vary with portion sizes,",
    margin,
    y,
  );
  doc.text(
    "service style and venue. Tax and service charge applicable. Quote valid for 14 days.",
    margin,
    y + 12,
  );

  // Footer
  doc.setDrawColor(232, 163, 61);
  doc.line(margin, 800, w - margin, 800);
  doc.setFont("Roboto", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(`Pankti Catering  ·  ${SITE.phone}  ·  ${SITE.email}`, w / 2, 812, {
    align: "center",
  });

  doc.save(`Pankti-Quote-${Date.now()}.pdf`);
}
