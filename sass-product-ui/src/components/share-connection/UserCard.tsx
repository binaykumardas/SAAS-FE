
import React from "react";
import type { UserCardProps } from "../../shared/model/connection";
import { IconCheck, IconClock, IconConnect, IconMessage, IconPin } from "../../shared/icons/icons";


// Mutual dots — MUTUAL_COLORS = ["#2563EB", "#7C3AED", "#059669"] at 25% opacity
const MUTUAL_DOT_CLASS: string[] = [
  "bg-[rgba(37,99,235,0.25)]",
  "bg-[rgba(124,58,237,0.25)]",
  "bg-[rgba(5,150,105,0.25)]",
];

const UserCard = ({ user, onConnect }: UserCardProps): React.JSX.Element => {
  return (
    <div className="bg-surface border border-border rounded-xl p-[18px] shadow-card flex flex-col gap-3 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] hover:-translate-y-0.5">

      {/* Avatar + Name */}
      <div className="flex items-center gap-[11px]">
        {/*
          Avatar: we set --user-color as a CSS variable (not a style property)
          and consume it via color-mix() in Tailwind arbitrary values.
          This is the only "style" prop left — it sets a variable, not direct CSS.
        */}
        <div
          style={{ "--user-color": user.color } as React.CSSProperties}
          className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center text-sm font-bold
            bg-[color-mix(in_srgb,var(--user-color)_12%,transparent)]
            border-[2px] border-[color-mix(in_srgb,var(--user-color)_25%,transparent)]
            text-[var(--user-color)]"
        >
          {user.initials}
        </div>

        <div className="flex-1 min-w-0">
          <p className="m-0 text-sm font-semibold text-text truncate">
            {user.name}
          </p>
          <span className="inline-block mt-[3px] px-2 py-[2px] rounded-full text-[10px] font-bold tracking-[0.04em] uppercase bg-accent-tint text-accent">
            {user.role}
          </span>
        </div>

        {user.connected && (
          <span className="text-success ml-auto shrink-0">
            <IconCheck />
          </span>
        )}
      </div>

      {/* Location */}
      <div className="flex items-center gap-[5px] text-xs text-muted">
        <IconPin />
        {user.location}
      </div>

      {/* Skills */}
      <div className="flex gap-[5px] flex-wrap">
        {user.skills.map((skill: string) => (
          <span
            key={skill}
            className="px-2 py-[3px] rounded-md text-[11px] font-medium bg-raised text-secondary border border-border"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Mutual connections */}
      <div className="flex items-center gap-[6px] text-[11px] text-muted">
        <div className="flex">
          {MUTUAL_DOT_CLASS.slice(0, Math.min(3, user.mutual)).map((cls: string, i: number) => (
            <div
              key={i}
              className={`w-[18px] h-[18px] rounded-full border-2 border-surface ${cls} ${i !== 0 ? "-ml-[5px]" : ""}`}
            />
          ))}
        </div>
        {user.mutual} mutual connections
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Action Button */}
      {user.connected ? (
        <button className="w-full py-2 rounded-lg text-xs font-semibold font-sans border border-border bg-transparent text-secondary cursor-pointer flex items-center justify-center gap-[5px] transition-colors duration-150 hover:bg-raised">
          <IconMessage /> Message
        </button>
      ) : (
        <button
          onClick={() => onConnect(user.id)}
          className={`w-full py-2 rounded-lg text-xs font-semibold font-sans border-none cursor-pointer flex items-center justify-center gap-[5px] transition-all duration-150 ${
            user.pending
              ? "bg-raised text-secondary"
              : "bg-accent text-white shadow-accent hover:bg-accent-hover"
          }`}
        >
          {user.pending
            ? <><IconClock /> Pending</>
            : <><IconConnect /> Connect</>
          }
        </button>
      )}
    </div>
  );
}

export default UserCard;