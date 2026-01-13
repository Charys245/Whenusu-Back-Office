import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const filters = [
  { id: "today", label: "Aujourd'hui" },
  { id: "week", label: "Cette semaine" },
  { id: "month", label: "Ce mois" },
  { id: "custom", label: "Personnalisé" },
];

export function TimeFilter() {
  const [active, setActive] = useState("month");

  return (
    <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-1">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={active === filter.id ? "default" : "ghost"}
          size="sm"
          onClick={() => setActive(filter.id)}
          className={cn(
            "h-8",
            active === filter.id && "shadow-sm"
          )}
        >
          {filter.id === "custom" && <Calendar className="mr-1 h-3 w-3" />}
          {filter.label}
        </Button>
      ))}
    </div>
  );
}

