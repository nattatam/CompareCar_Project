import { Badge } from "@/components/ui/badge";
import { badgeLabel, type Powertrain } from "@/lib/types";

interface PowertrainBadgeProps {
  powertrain: Powertrain;
  className?: string;
}

const styles: Record<string, string> = {
  ICE: "bg-zinc-100 text-zinc-700 ring-zinc-300",
  EV: "bg-blue-50 text-blue-700 ring-blue-200",
  MHEV: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  HEV: "bg-teal-50 text-teal-700 ring-teal-200",
  PHEV: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  "REEV/EREV": "bg-amber-50 text-amber-700 ring-amber-200",
};

export default function PowertrainBadge({
  powertrain,
  className = "",
}: PowertrainBadgeProps) {
  const label = badgeLabel(powertrain);
  const style = styles[label] ?? styles.ICE;
  return (
    <Badge
      variant="outline"
      className={`rounded-full px-2.5 font-semibold ring-1 ring-inset ${style} ${className}`}
    >
      {label}
    </Badge>
  );
}
