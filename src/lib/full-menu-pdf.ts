"use client";
import jsPDF from "jspdf";
import { MENU, COURSES } from "@/data/menu";
import { SITE } from "@/lib/site";

// Single-file, dependency-light A4 brochure of the entire Pankti catalog.
// Designed to be downloaded once and forwarded on WhatsApp, email or
// printed for the kitchen — so the customer doesn't have to walk a friend
// or relative through the website.
//
// Uses jsPDF's built-in fonts (helvetica + times) — no custom TTF, no
// asset fetch, no font-registration risk. Prices are rendered with the
// plain "Rs" prefix to avoid Unicode glyph issues with the built-in fonts.
export async function generateFullMenuPdf() {
  const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
  const w = doc.internal.pageSize.getWidth(); // 595
  const h = doc.internal.pageSize.getHeight(); // 842
  const margin = 48;
  const colGap = 28;
  const colWidth = (w - margin * 2 - colGap) / 2;

  // ── Cover header (drawn once on page 1) ───────────────────────────
  // Saffron top stripe
  doc.setFillColor(232, 163, 61);
  doc.rect(0, 0, w, 8, "F");

  let y = 78;

  // Brand wordmark
  doc.setFont("times", "bold");
  doc.setFontSize(40);
  doc.setTextColor(14, 14, 15);
  doc.text("Pankti", margin, y);
  doc.setFont("times", "italic");
  doc.setFontSize(12);
  doc.setTextColor(120, 120, 120);
  doc.text(SITE.tagline, margin, y + 18);

  // Right header — contact
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(SITE.phone, w - margin, y - 14, { align: "right" });
  doc.text(SITE.email, w - margin, y, { align: "right" });
  doc.text(`${SITE.address}, ${SITE.city}`, w - margin, y + 14, {
    align: "right",
  });

  y += 50;
  doc.setDrawColor(232, 163, 61);
  doc.setLineWidth(1);
  doc.line(margin, y, w - margin, y);
  y += 30;

  // Title
  doc.setFont("times", "bold");
  doc.setFontSize(28);
  doc.setTextColor(14, 14, 15);
  doc.text("THE FULL MENU", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(110, 110, 110);
  doc.text(
    `${MENU.length} dishes across ${COURSES.filter((c) => MENU.some((m) => m.course === c.id)).length} courses`,
    margin,
    y + 18,
  );

  // Date in top-right of title row
  doc.text(
    `Updated ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`,
    w - margin,
    y + 18,
    { align: "right" },
  );

  y += 50;

  // Helper that draws one course block in a two-column layout. Returns
  // the y position after the block.
  let col: 0 | 1 = 0;
  let colY: [number, number] = [y, y];

  const newPage = () => {
    doc.addPage();
    // Saffron stripe on each subsequent page too
    doc.setFillColor(232, 163, 61);
    doc.rect(0, 0, w, 4, "F");
    y = 60;
    colY = [y, y];
    col = 0;
  };

  const colX = (c: 0 | 1) => margin + c * (colWidth + colGap);

  for (const course of COURSES) {
    const items = MENU.filter((m) => m.course === course.id);
    if (items.length === 0) continue;

    // Estimate space needed for this course (header + N rows)
    const estHeight = 26 + items.length * 38 + 12;

    // If the current column doesn't have room, move to the other column
    // or a new page.
    if (colY[col] + estHeight > h - 60) {
      const otherCol: 0 | 1 = col === 0 ? 1 : 0;
      if (colY[otherCol] + estHeight <= h - 60) {
        col = otherCol;
      } else {
        newPage();
      }
    }

    const x = colX(col);
    let cy = colY[col];

    // Course header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(201, 132, 35);
    doc.text(course.label.toUpperCase(), x, cy);
    doc.setDrawColor(232, 163, 61);
    doc.setLineWidth(0.7);
    doc.line(x, cy + 4, x + colWidth, cy + 4);
    cy += 18;

    // Dishes
    for (const item of items) {
      if (cy + 38 > h - 60) {
        // Move to the next column / page
        const otherCol: 0 | 1 = col === 0 ? 1 : 0;
        if (colY[otherCol] + 38 <= h - 60) {
          colY[col] = cy;
          col = otherCol;
          cy = colY[col];
        } else {
          colY[col] = cy;
          newPage();
          cy = colY[col];
        }
      }

      // Veg / non-veg square indicator (matches the website)
      doc.setLineWidth(1);
      if (item.veg) {
        doc.setDrawColor(58, 157, 74);
        doc.setFillColor(58, 157, 74);
      } else {
        doc.setDrawColor(192, 57, 43);
        doc.setFillColor(192, 57, 43);
      }
      doc.rect(x, cy - 7, 7, 7, "S");
      doc.circle(x + 3.5, cy - 3.5, 1.6, "F");

      // Name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(14, 14, 15);
      const name = item.name;
      doc.text(name, x + 12, cy);

      // Price aligned right
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(201, 132, 35);
      doc.text(`Rs ${item.price}`, x + colWidth, cy, { align: "right" });

      // Description
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      const desc = doc.splitTextToSize(item.description, colWidth - 36);
      doc.text(desc as string[], x + 12, cy + 11);

      // Per-plate sublabel
      doc.setFontSize(7);
      doc.setTextColor(160, 160, 160);
      doc.text("per plate", x + colWidth, cy + 10, { align: "right" });

      // Small badges row: Jain · spice
      const badges: string[] = [];
      if (item.jainSafe) badges.push("Jain-safe");
      if (item.spice && item.spice >= 2) badges.push("Spicy");
      if (badges.length > 0) {
        doc.setFontSize(7);
        doc.setTextColor(120, 120, 120);
        doc.text(badges.join(" · "), x + 12, cy + 28);
      }

      cy += 38;
    }

    cy += 8;
    colY[col] = cy;
  }

  // ── Footer on every page ──────────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setDrawColor(232, 163, 61);
    doc.setLineWidth(0.6);
    doc.line(margin, h - 40, w - margin, h - 40);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `${SITE.name} Catering  ·  ${SITE.phone}  ·  ${SITE.email}  ·  ${SITE.city}`,
      w / 2,
      h - 26,
      { align: "center" },
    );
    doc.setFontSize(7);
    doc.setTextColor(160, 160, 160);
    doc.text(`Page ${p} of ${pageCount}`, w - margin, h - 26, {
      align: "right",
    });
    doc.text(
      "Prices subject to seasonal variation · Custom menus on request",
      margin,
      h - 26,
    );
  }

  doc.save(`Pankti-Full-Menu-${Date.now()}.pdf`);
}
