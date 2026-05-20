"use client";
import type { PlateLine } from "@/lib/plate-store";
import { MENU } from "@/data/menu";
import { SITE } from "@/lib/site";
import { formatINRPlain } from "@/lib/utils";
import { encodePlate } from "@/lib/plate-encode";
import { qrDataUrl } from "@/lib/qr";
import {
  rentalLines,
  computePlateTotals,
  EMPTY_RENTALS,
  GST_RATE,
  EXIT_DISCOUNT_RATE,
  type Rentals,
} from "@/lib/plate-store";

export type ImageMeta = {
  name?: string;
  occasion?: string;
  eventDate?: string;
  guests: number;
  rentals?: Rentals;
  discountApplied?: boolean;
};

const WIDTH = 1080;
const PADDING = 56;
const BG = "#0e0e0f";
const FG = "#f5f1ea";
const MUTED = "#9b9690";
const SUBTLE = "#6f6a64";
const SAFFRON = "#e8a33d";
const ELEV = "#1a1816";
const BORDER = "#2a2724";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function generatePlateImage(
  lines: PlateLine[],
  meta: ImageMeta,
): Promise<Blob> {
  const items = lines
    .map((l) => {
      const item = MENU.find((m) => m.id === l.itemId);
      return item ? { item, qty: l.qty } : null;
    })
    .filter((x): x is { item: (typeof MENU)[number]; qty: number } => x !== null);

  const rentals = meta.rentals ?? EMPTY_RENTALS;
  const totals = computePlateTotals(
    lines,
    meta.guests,
    rentals,
    !!meta.discountApplied,
  );
  const { perPlate, foodTotal, deliveryTotal, discount, gst, grandTotal } =
    totals;
  const extras = rentalLines(rentals, meta.guests);
  const extrasTotal = extras.reduce((a, l) => a + l.price, 0);
  const total = grandTotal;

  // Generate QR pointing at the share-plate URL
  const shareUrl = `${window.location.origin}/plate/${encodePlate(lines, meta.guests)}`;
  const qrPng = await qrDataUrl(shareUrl, 320);
  const qrImg = await loadImage(qrPng);

  // Mini-ledger lines that go into the totals card. Count them up front so
  // we can size the canvas correctly.
  const ledgerLines: { label: string; value: string; accent?: string }[] = [
    {
      label: `Food (₹${formatINRPlain(perPlate).replace("₹", "")} × ${meta.guests})`,
      value: `₹${formatINRPlain(foodTotal).replace("₹", "")}`,
    },
  ];
  if (extrasTotal > 0) {
    ledgerLines.push({
      label: "Extras & rentals",
      value: `₹${formatINRPlain(extrasTotal).replace("₹", "")}`,
    });
  }
  if (rentals.deliveryZone !== "none") {
    ledgerLines.push({
      label: "Delivery & setup",
      value:
        rentals.deliveryZone === "outer"
          ? "On call"
          : `₹${formatINRPlain(deliveryTotal).replace("₹", "")}`,
    });
  }
  if (meta.discountApplied && discount > 0) {
    ledgerLines.push({
      label: `Loyalty discount (${Math.round(EXIT_DISCOUNT_RATE * 100)}%)`,
      value: `− ₹${formatINRPlain(discount).replace("₹", "")}`,
      accent: "success",
    });
  }
  ledgerLines.push({
    label: `GST (${Math.round(GST_RATE * 100)}%)`,
    value: `₹${formatINRPlain(gst).replace("₹", "")}`,
  });

  // Calculate dynamic height based on number of items + extras + ledger
  const headerH = 200;
  const titleH = 180;
  const itemRowH = 64;
  const itemsBlockH = items.length * itemRowH + 40;
  const extrasRowH = 48;
  const extrasBlockH = extras.length > 0 ? extras.length * extrasRowH + 56 : 0;
  const ledgerRowH = 40;
  const totalsH = ledgerLines.length * ledgerRowH + 200;
  const qrBlockH = 280;
  const footerH = 80;
  const HEIGHT =
    headerH +
    titleH +
    itemsBlockH +
    extrasBlockH +
    totalsH +
    qrBlockH +
    footerH +
    PADDING;

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Saffron top bar
  ctx.fillStyle = SAFFRON;
  ctx.fillRect(0, 0, WIDTH, 8);

  let y = PADDING + 60;

  // Brand
  ctx.fillStyle = FG;
  ctx.font = 'bold 64px "Times New Roman", serif';
  ctx.textAlign = "left";
  ctx.fillText("Pankti", PADDING, y);
  ctx.font = 'italic 22px "Times New Roman", serif';
  ctx.fillStyle = MUTED;
  ctx.fillText(SITE.tagline, PADDING, y + 30);

  // Phone (top right)
  ctx.textAlign = "right";
  ctx.font = "500 20px sans-serif";
  ctx.fillStyle = MUTED;
  ctx.fillText(SITE.phone, WIDTH - PADDING, y - 30);
  ctx.fillText(SITE.email, WIDTH - PADDING, y - 2);

  y += 80;

  // Divider
  ctx.strokeStyle = BORDER;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PADDING, y);
  ctx.lineTo(WIDTH - PADDING, y);
  ctx.stroke();

  y += 56;

  // Eyebrow
  ctx.fillStyle = SAFFRON;
  ctx.textAlign = "left";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText("A CUSTOM PLATE", PADDING, y);

  y += 44;

  // Title
  ctx.fillStyle = FG;
  ctx.font = 'bold 56px "Times New Roman", serif';
  const title = meta.occasion ? `${meta.occasion} plate` : "Your plate";
  ctx.fillText(title, PADDING, y);

  y += 36;

  // Subtitle
  ctx.fillStyle = MUTED;
  ctx.font = "500 24px sans-serif";
  const subParts: string[] = [];
  subParts.push(`${meta.guests} guests`);
  if (meta.eventDate) subParts.push(meta.eventDate);
  if (meta.name) subParts.push(`for ${meta.name}`);
  ctx.fillText(subParts.join("  ·  "), PADDING, y);

  y += 50;

  // Items block background
  const itemsStartY = y;
  ctx.fillStyle = ELEV;
  drawRoundedRect(
    ctx,
    PADDING,
    itemsStartY,
    WIDTH - PADDING * 2,
    items.length * itemRowH + 32,
    20,
  );
  ctx.fill();

  y = itemsStartY + 16;

  // Items
  for (const { item, qty } of items) {
    const rowTop = y;
    // Name
    ctx.fillStyle = FG;
    ctx.textAlign = "left";
    ctx.font = "600 26px sans-serif";
    ctx.fillText(item.name, PADDING + 24, rowTop + 28);
    // Sub
    ctx.fillStyle = SUBTLE;
    ctx.font = "500 18px sans-serif";
    const cuisine =
      item.cuisine === "south"
        ? "South Indian"
        : item.cuisine === "north"
          ? "North Indian"
          : "Common";
    ctx.fillText(
      `${item.veg ? "Veg" : "Non-veg"} · ${cuisine}${qty > 1 ? `  ·  ×${qty}` : ""}`,
      PADDING + 24,
      rowTop + 52,
    );
    // Price
    ctx.fillStyle = FG;
    ctx.font = "bold 26px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(
      `₹${formatINRPlain(item.price * qty).replace("₹", "")}`,
      WIDTH - PADDING - 24,
      rowTop + 28,
    );
    if (qty > 1) {
      ctx.fillStyle = SUBTLE;
      ctx.font = "500 18px sans-serif";
      ctx.fillText(
        `₹${formatINRPlain(item.price).replace("₹", "")} each`,
        WIDTH - PADDING - 24,
        rowTop + 52,
      );
    }
    y += itemRowH;
  }

  y = itemsStartY + items.length * itemRowH + 32 + 28;

  // Extras & rentals block
  if (extras.length > 0) {
    ctx.fillStyle = SAFFRON;
    ctx.textAlign = "left";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("EXTRAS & RENTALS", PADDING, y + 16);
    y += 36;
    ctx.fillStyle = ELEV;
    drawRoundedRect(
      ctx,
      PADDING,
      y,
      WIDTH - PADDING * 2,
      extras.length * extrasRowH + 16,
      20,
    );
    ctx.fill();
    let ey = y + 8;
    for (const line of extras) {
      ctx.fillStyle = FG;
      ctx.textAlign = "left";
      ctx.font = "600 22px sans-serif";
      ctx.fillText(line.label, PADDING + 24, ey + 22);
      if (line.note) {
        ctx.fillStyle = SUBTLE;
        ctx.font = "500 16px sans-serif";
        ctx.fillText(line.note, PADDING + 24, ey + 42);
      }
      ctx.fillStyle = FG;
      ctx.font = "bold 22px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(
        `₹${formatINRPlain(line.price).replace("₹", "")}`,
        WIDTH - PADDING - 24,
        ey + 22,
      );
      ey += extrasRowH;
    }
    y = ey + 24;
  }

  // Totals ledger card
  const cardH = ledgerLines.length * ledgerRowH + 200;
  ctx.fillStyle = "#1a1611";
  drawRoundedRect(ctx, PADDING, y, WIDTH - PADDING * 2, cardH, 20);
  ctx.fill();

  // Mini-ledger lines
  let ly = y + 16;
  ctx.font = "500 22px sans-serif";
  for (const line of ledgerLines) {
    ctx.fillStyle = line.accent === "success" ? "#6dbd7a" : MUTED;
    ctx.textAlign = "left";
    ctx.fillText(line.label, PADDING + 32, ly + 22);
    ctx.fillStyle = line.accent === "success" ? "#6dbd7a" : FG;
    ctx.font = "bold 22px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(line.value, WIDTH - PADDING - 32, ly + 22);
    ctx.font = "500 22px sans-serif";
    ly += ledgerRowH;
  }

  // Divider
  ctx.strokeStyle = BORDER;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PADDING + 32, ly + 8);
  ctx.lineTo(WIDTH - PADDING - 32, ly + 8);
  ctx.stroke();
  ly += 28;

  // Grand total + effective per plate
  ctx.fillStyle = MUTED;
  ctx.font = "600 18px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("EFFECTIVE / PLATE", PADDING + 32, ly + 8);
  ctx.fillStyle = FG;
  ctx.font = "bold 36px sans-serif";
  ctx.fillText(
    `₹${formatINRPlain(Math.round(totals.effectivePerPlate)).replace("₹", "")}`,
    PADDING + 32,
    ly + 48,
  );

  ctx.textAlign = "right";
  ctx.fillStyle = MUTED;
  ctx.font = "600 18px sans-serif";
  ctx.fillText(
    `ESTIMATED TOTAL · ${meta.guests} GUESTS`,
    WIDTH - PADDING - 32,
    ly + 8,
  );
  ctx.fillStyle = SAFFRON;
  ctx.font = "bold 52px sans-serif";
  ctx.fillText(
    `₹${formatINRPlain(total).replace("₹", "")}`,
    WIDTH - PADDING - 32,
    ly + 56,
  );

  y += cardH + 40;

  // QR block
  const qrSize = 200;
  const qrX = PADDING + 24;
  const qrY = y;
  // White card behind QR
  ctx.fillStyle = "#ffffff";
  drawRoundedRect(ctx, qrX - 12, qrY - 12, qrSize + 24, qrSize + 24, 16);
  ctx.fill();
  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

  // QR caption
  ctx.fillStyle = SAFFRON;
  ctx.textAlign = "left";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText("SCAN TO OPEN ON YOUR PHONE", qrX + qrSize + 40, qrY + 30);
  ctx.fillStyle = FG;
  ctx.font = "600 26px sans-serif";
  ctx.fillText("Customise, share or", qrX + qrSize + 40, qrY + 76);
  ctx.fillText("enquire on WhatsApp", qrX + qrSize + 40, qrY + 110);
  ctx.fillStyle = MUTED;
  ctx.font = "500 20px sans-serif";
  ctx.fillText("No app needed.", qrX + qrSize + 40, qrY + 150);
  ctx.fillText(SITE.phone, qrX + qrSize + 40, qrY + 184);

  // Footer bar
  ctx.fillStyle = SAFFRON;
  ctx.fillRect(0, HEIGHT - 6, WIDTH, 6);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))),
      "image/png",
      0.95,
    );
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export async function downloadPlateImage(
  lines: PlateLine[],
  meta: ImageMeta,
): Promise<void> {
  const blob = await generatePlateImage(lines, meta);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Pankti-Plate-${Date.now()}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// On supported devices (mostly mobile), trigger the native share sheet so the
// user can send the image straight to WhatsApp / contacts. Falls back to download.
export async function sharePlateImage(
  lines: PlateLine[],
  meta: ImageMeta,
): Promise<"shared" | "downloaded"> {
  const blob = await generatePlateImage(lines, meta);
  const file = new File([blob], `Pankti-Plate-${Date.now()}.png`, {
    type: "image/png",
  });
  const nav = navigator as Navigator & {
    canShare?: (data: { files: File[] }) => boolean;
    share?: (data: { files?: File[]; title?: string; text?: string }) => Promise<void>;
  };
  if (nav.canShare?.({ files: [file] }) && nav.share) {
    try {
      await nav.share({
        files: [file],
        title: "My Pankti plate",
        text: `My plate for ${meta.guests} guests — see the full quote attached.`,
      });
      return "shared";
    } catch {
      // user cancelled — fall through to download
    }
  }
  // Fallback: download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return "downloaded";
}
