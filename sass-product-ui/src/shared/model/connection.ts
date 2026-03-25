// ─── Types ────────────────────────────────────────────────────────────────────

export type StatusFilter = "connected" | "pending" | "suggested" | null;

export interface User {
  id: number;
  name: string;
  role: string;
  mutual: number;
  location: string;
  skills: string[];
  connected: boolean;
  pending: boolean;
  initials: string;
  color: string;
}

export interface StatPillProps {
  status: "connected" | "pending" | "suggested";
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

export interface UserCardProps {
  user: User;
  onConnect: (id: number) => void;
}