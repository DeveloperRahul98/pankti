"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Bookmark, Check } from "lucide-react";
import { usePlate } from "@/lib/plate-store";
import { useSavedPlates } from "@/lib/saved-plates";

export function SavePlateButton() {
  const lines = usePlate((s) => s.lines);
  const guests = usePlate((s) => s.guests);
  const save = useSavedPlates((s) => s.save);
  const [naming, setNaming] = useState(false);
  const [name, setName] = useState("");
  const [justSaved, setJustSaved] = useState(false);

  if (lines.length === 0) return null;

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    save(name || "My plate", lines, guests);
    toast.success(`Saved as "${name || "My plate"}"`, {
      description: "Find it on the homepage under Your saved plates.",
    });
    setName("");
    setNaming(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  if (justSaved) {
    return (
      <div className="px-5 py-2 text-xs text-[var(--success)] inline-flex items-center gap-1.5 justify-center">
        <Check className="h-3.5 w-3.5" />
        Saved
      </div>
    );
  }

  if (!naming) {
    return (
      <div className="px-5 pt-3">
        <button
          type="button"
          onClick={() => setNaming(true)}
          className="w-full inline-flex items-center justify-center gap-1.5 rounded-full border border-[var(--border-strong)] py-2 text-xs font-semibold text-fg-muted hover:text-fg hover:border-primary transition-colors"
        >
          <Bookmark className="h-3.5 w-3.5" />
          Save this plate
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSave} className="px-5 pt-3 flex gap-1.5">
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name e.g. Mom's 60th"
        className="!py-1.5 !text-xs flex-1"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-primary text-primary-fg px-3 py-1.5 text-xs font-bold"
      >
        Save
      </button>
      <button
        type="button"
        onClick={() => setNaming(false)}
        className="text-xs text-fg-subtle px-2"
      >
        ✕
      </button>
    </form>
  );
}
