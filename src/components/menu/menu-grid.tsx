"use client";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MENU, COURSES, type MenuItem } from "@/data/menu";
import { OCCASIONS } from "@/data/occasions";
import { SIGNATURE_PLATES } from "@/data/signature-plates";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { MenuFilters, type Filters } from "@/components/menu/menu-filters";
import { usePlate } from "@/lib/plate-store";
import { toast } from "sonner";

export function MenuGrid() {
  const params = useSearchParams();
  const occasionId = params.get("occasion");
  const setOccasion = usePlate((s) => s.setOccasion);
  const loadFromEncoded = usePlate((s) => s.loadFromEncoded);
  const linesLength = usePlate((s) => s.lines.length);

  const [filters, setFilters] = useState<Filters>({
    veg: "all",
    jain: false,
    cuisine: "all",
    search: "",
    maxPrice: 0,
  });

  // Apply occasion preset on first arrival if plate is empty
  useEffect(() => {
    if (!occasionId) return;
    setOccasion(occasionId);
    const occ = OCCASIONS.find((o) => o.id === occasionId);
    if (!occ) return;
    if (linesLength > 0) return;
    const plate = SIGNATURE_PLATES.find((p) => p.id === occ.signaturePlateId);
    if (!plate) return;
    const lines = plate.itemIds.map((id) => ({ itemId: id, qty: 1 }));
    loadFromEncoded(lines, 50);
    toast(`Loaded "${plate.name}" as a starting point`, {
      description: "Customise freely — add or remove anything.",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [occasionId]);

  const filtered = useMemo(() => {
    return MENU.filter((m) => {
      if (filters.veg === "veg" && !m.veg) return false;
      if (filters.veg === "nonveg" && m.veg) return false;
      if (filters.jain && !m.jainSafe) return false;
      if (filters.cuisine !== "all" && m.cuisine !== filters.cuisine) return false;
      if (filters.maxPrice > 0 && m.price > filters.maxPrice) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !m.name.toLowerCase().includes(q) &&
          !m.description.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [filters]);

  const byCourse = useMemo(() => {
    const map: Record<string, MenuItem[]> = {};
    for (const item of filtered) {
      (map[item.course] ||= []).push(item);
    }
    return map;
  }, [filtered]);

  return (
    <div className="space-y-2">
      <MenuFilters filters={filters} setFilters={setFilters} />

      {filtered.length === 0 ? (
        <div className="py-24 text-center text-fg-muted">
          No dishes match these filters.
        </div>
      ) : (
        <div className="pt-6 space-y-14">
          {COURSES.map((course) => {
            const items = byCourse[course.id];
            if (!items?.length) return null;
            return (
              <section key={course.id} id={course.id}>
                <div className="flex items-baseline gap-3 mb-5">
                  <h2 className="font-display text-3xl md:text-4xl tracking-tight">
                    {course.label}
                  </h2>
                  <span className="text-sm text-fg-subtle tabular-nums">
                    {items.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                  {items.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
