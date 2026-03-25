import React from "react";
import type { StatPillProps } from "../../shared/model/connection";



// StatPill — dot background per status
const PILL_DOT_CLASS: Record<"connected" | "pending" | "suggested", string> = {
  connected: "bg-success",
  pending:   "bg-warning",
  suggested: "bg-accent",
};

// StatPill — active border + background per status (arbitrary Tailwind values)
const PILL_ACTIVE_CLASS: Record<"connected" | "pending" | "suggested", string> = {
  connected: "border-[1.5px] border-[#22C55E] bg-[#F0FDF4]",
  pending:   "border-[1.5px] border-[#F59E0B] bg-[#FFFBEB]",
  suggested: "border-[1.5px] border-accent bg-accent-tint",
};



const StatPill = ({ status, label, count, isActive, onClick }: StatPillProps): React.JSX.Element => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.75 px-3.25 py-1.5 border rounded-full shadow-card text-[13px] cursor-pointer font-sans transition-all duration-150 ${
        isActive
          ? PILL_ACTIVE_CLASS[status]
          : "bg-surface border-border hover:bg-raised hover:border-border-strong"
      }`}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${PILL_DOT_CLASS[status]}`} />
      <span className="text-secondary">{label}</span>
      <span className="font-bold text-text">{count}</span>
    </button>
  );
}

export default StatPill;