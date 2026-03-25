import { useState } from "react";
import type { StatusFilter, User } from "../../shared/model/connection";
import UserData from '../../assets/json/profile.json';
import { IconSearch } from "../../shared/icons/icons";
import UserCard from "../../components/share-connection/UserCard";
import StatPill from "../../components/share-connection/StatPill";

// ─── Constants ────────────────────────────────────────────────────────────────

const USERS: User[] = UserData;

const ROLE_FILTERS: string[] = ["All", "Developer", "Designer", "DevOps", "Data Science", "Product"];

// Result label badge per status
const BADGE_CLASS: Record<"connected" | "pending" | "suggested", string> = {
  connected: "bg-[#F0FDF4] text-[#16A34A]",
  pending:   "bg-[#FFFBEB] text-[#B45309]",
  suggested: "bg-accent-tint text-accent",
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const FindConnections = (): React.JSX.Element => {
  const [users, setUsers]               = useState<User[]>(USERS);
  const [search, setSearch]             = useState<string>("");
  const [activeRole, setActiveRole]     = useState<string>("All");
  const [activeStatus, setActiveStatus] = useState<StatusFilter>(null);

  const connectedCount: number = users.filter((u: User) => u.connected).length;
  const pendingCount: number   = users.filter((u: User) => u.pending).length;
  const suggestedCount: number = users.filter((u: User) => !u.connected && !u.pending).length;

  const handleConnect = (id: number): void => {
    setUsers((prev: User[]) =>
      prev.map((u: User) => u.id === id ? { ...u, pending: !u.pending } : u)
    );
  };

  const handleStatusClick = (status: "connected" | "pending" | "suggested"): void => {
    setActiveStatus((prev: StatusFilter) => prev === status ? null : status);
  };

  const statusFiltered: User[] = (() => {
    if (activeStatus === "connected") return users.filter((u: User) => u.connected);
    if (activeStatus === "pending")   return users.filter((u: User) => u.pending);
    if (activeStatus === "suggested") return users.filter((u: User) => !u.connected && !u.pending);
    return users;
  })();

  const filtered: User[] = statusFiltered.filter((u: User) => {
    const q: string = search.toLowerCase();
    const matchSearch: boolean =
      u.name.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      u.skills.some((s: string) => s.toLowerCase().includes(q));
    const matchRole: boolean =
      activeRole === "All" ||
      u.role.toLowerCase().includes(activeRole.toLowerCase());
    return matchSearch && matchRole;
  });

  return (
    <div className="min-h-screen bg-bg font-sans text-text px-8 py-7">

      {/* ── Header ── */}
      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-[21px] font-bold m-0">Find Connections</h1>
          <p className="mt-[3px] text-[13px] text-secondary">
            Discover and connect with developers, designers, and more
          </p>
        </div>
        <div className="flex gap-[10px] flex-wrap">
          <StatPill status="connected" label="Connected" count={connectedCount} isActive={activeStatus === "connected"} onClick={() => handleStatusClick("connected")} />
          <StatPill status="pending"   label="Pending"   count={pendingCount}   isActive={activeStatus === "pending"}   onClick={() => handleStatusClick("pending")}   />
          <StatPill status="suggested" label="Suggested" count={suggestedCount} isActive={activeStatus === "suggested"} onClick={() => handleStatusClick("suggested")} />
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-surface border border-border rounded-xl px-[18px] py-[14px] mb-5 shadow-card flex gap-[14px] items-center flex-wrap">

        {/* Search */}
        <div className="flex-1 min-w-[180px] relative">
          <span className="absolute left-[10px] top-1/2 -translate-y-1/2 flex pointer-events-none">
            <IconSearch />
          </span>
          <input
            className="auth-input w-full pl-[34px] pr-3 py-2 border border-border rounded-lg text-[13px] bg-raised text-text font-sans outline-none transition-colors duration-150"
            placeholder="Search by name, role, or skill…"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
        </div>

        {/* Role filters */}
        <div className="flex gap-[6px] flex-wrap">
          {ROLE_FILTERS.map((f: string) => (
            <button
              key={f}
              onClick={() => setActiveRole(f)}
              className={`px-[13px] py-[6px] rounded-lg text-xs font-medium font-sans cursor-pointer transition-all duration-150 border ${
                activeRole === f
                  ? "border-accent bg-accent-tint text-accent"
                  : "border-border bg-transparent text-secondary hover:bg-raised"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Result label ── */}
      <p className="text-xs text-muted mb-[14px]">
        Showing <strong className="text-text">{filtered.length}</strong> people
        {activeStatus && (
          <span className={`ml-[6px] inline-flex items-center px-[9px] py-[2px] rounded-full text-[11px] font-semibold ${BADGE_CLASS[activeStatus]}`}>
            {activeStatus}
          </span>
        )}
      </p>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted">
          <svg
            width="36" height="36" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="1.5"
            className="mx-auto mb-[10px] block"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <p className="text-sm font-medium">No {activeStatus ?? "matching"} users found</p>
          <p className="text-xs mt-1">Try clearing your search or switching the filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(248px,1fr))] gap-[14px]">
          {filtered.map((user: User) => (
            <UserCard key={user.id} user={user} onConnect={handleConnect} />
          ))}
        </div>
      )}
    </div>
  );
}

export default FindConnections;