// src/components/share-profile/ProfileUI.tsx
import type { ReactNode } from "react";
import { useId } from "react";

export const DetailField = ({
  label,
  value,
}: {
  label: string;
  value: string | undefined | null;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-semibold tracking-wider uppercase text-muted">
      {label}
    </span>
    <span className="text-sm font-medium text-text">{value || "—"}</span>
  </div>
);

export const FormInput = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: boolean | string;
}) => {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`auth-input w-full px-3.5 py-2.5 rounded-lg text-sm bg-raised border text-text placeholder:text-muted transition-all duration-150 ${error ? "border-red-500 focus:border-red-500" : "border-border"}`}
      />
      {/* Shows validation error if error prop is passed */}
      {error && (
        <span className="text-red-500 text-[11px] font-medium">
          {typeof error === "string" ? error : "This field is required."}
        </span>
      )}
    </div>
  );
};

export const FormSelect = ({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { id: number; label: string; value: number | string }[];
  error?: boolean | string;
}) => {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`auth-input w-full px-3.5 py-2.5 rounded-lg text-sm bg-raised border text-text transition-all duration-150 cursor-pointer ${error ? "border-red-500 focus:border-red-500" : "border-border"}`}
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {/* Shows validation error if error prop is passed */}
      {error && (
        <span className="text-red-500 text-[11px] font-medium">
          {typeof error === "string" ? error : "This field is required."}
        </span>
      )}
    </div>
  );
};

export const FormTextarea = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  error?: boolean | string;
}) => {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`auth-input w-full px-3.5 py-2.5 rounded-lg text-sm bg-raised border text-text placeholder:text-muted transition-all duration-150 resize-none ${error ? "border-red-500 focus:border-red-500" : "border-border"}`}
      />
      {/* Shows validation error if error prop is passed */}
      {error && (
        <span className="text-red-500 text-[11px] font-medium">
          {typeof error === "string" ? error : "This field is required."}
        </span>
      )}
    </div>
  );
};

export const SectionCard = ({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: ReactNode;
}) => (
  <div className="bg-surface border border-border rounded-2xl p-6 shadow-card">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-sm font-bold tracking-tight text-text uppercase">
        {title}
      </h2>
      <button
        type="button"
        onClick={onEdit}
        className="flex items-center gap-1.5 text-xs font-semibold text-accent bg-accent-tint hover:bg-accent hover:text-white px-3 py-1.5 rounded-lg transition-all duration-150"
      >
        <svg
          width="11"
          height="11"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
          />
        </svg>{" "}
        Edit
      </button>
    </div>
    {children}
  </div>
);

export const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg bg-accent-tint text-accent flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-xs text-muted font-medium">{label}</p>
      <p className="text-sm text-text font-semibold">{value}</p>
    </div>
  </div>
);

export const SkillChip = ({ name, level }: { name: string; level: string }) => {
  const levelColor: Record<string, string> = {
    Expert: "bg-accent-tint text-accent border-accent-tint",
    Intermediate: "bg-raised text-secondary border-border",
    Beginner: "bg-raised text-muted border-border",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${levelColor[level] ?? levelColor.Beginner}`}
    >
      {name}
      <span className="text-[10px] font-normal opacity-70">
        {(level || "B")[0]}
      </span>
    </span>
  );
};

export const Tag = ({ label }: { label: string }) => (
  <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-raised border border-border text-secondary">
    {label}
  </span>
);

export const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    Live: "bg-success/10 text-success border-success/20",
    "In Progress": "bg-warning/10 text-warning border-warning/20",
    Archived: "bg-raised text-muted border-border",
  };
  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${map[status] ?? map.Archived}`}
    >
      {status}
    </span>
  );
};

export const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: string;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}) => (
  <div className="bg-surface border border-border rounded-2xl p-12 shadow-card flex flex-col items-center justify-center text-center gap-4">
    <div className="w-12 h-12 rounded-xl bg-accent-tint flex items-center justify-center text-2xl">
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-bold text-text mb-1">{title}</h3>
      <p className="text-sm text-secondary">{description}</p>
    </div>
    <button
      type="button"
      onClick={onAction}
      className="mt-1 px-5 py-2.5 rounded-lg text-sm font-semibold bg-accent hover:bg-accent-hover text-white shadow-accent transition-all duration-150"
    >
      {actionLabel}
    </button>
  </div>
);

export const ListHeader = ({
  title,
  onAdd,
}: {
  title: string;
  onAdd: () => void;
}) => (
  <div className="flex items-center justify-between">
    <h2 className="text-sm font-bold uppercase tracking-tight text-text">
      {title}
    </h2>
    <button
      type="button"
      onClick={onAdd}
      className="text-xs font-semibold text-accent bg-accent-tint hover:bg-accent hover:text-white px-3 py-1.5 rounded-lg transition-all duration-150"
    >
      + Add
    </button>
  </div>
);
