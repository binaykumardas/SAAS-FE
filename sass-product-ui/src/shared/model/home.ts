// ─── Types ────────────────────────────────────────────────────────────────────

import type React from "react";

export interface Stat {
  value: string;
  label: string;
}

export interface Feature {
  icon: React.JSX.Element;
  title: string;
  desc: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  city: string;
  initials: string;
  color: string;
  rating: number;
}

export interface Step {
  step: string;
  title: string;
  desc: string;
}