/**
 * @file ProfileSidebar.tsx
 * @location src/components/share-profile/ProfileSidebar.tsx
 *
 * @description
 * The left column of the Profile page layout.
 * This is a DISPLAY-ONLY component — it receives data as props and renders it.
 * It never fetches data, never has its own state, and never calls any API.
 *
 * It renders TWO cards stacked vertically:
 *   1. Avatar + Info Card  — avatar photo/placeholder, name, dev type badge,
 *                            date of birth, email, mobile, and about me section
 *   2. Completion Card     — a progress bar showing how complete the profile is
 *
 * @props
 *   basic       : BasicDetails — the profile data object to display
 *   formatDate  : function     — converts "2004-06-05" → "05 June 2004"
 *   formatLabel : function     — converts "FULL_STACK_DEVELOPER" → "Full Stack Developer"
 *
 * @note
 *   formatDate and formatLabel are passed in as props (not imported directly)
 *   because they are defined and exported from Profile.tsx. This keeps them
 *   in one place and makes this component easier to test in isolation.
 *
 * @usage
 *   <ProfileSidebar
 *     basic={data.basicDetails}
 *     formatDate={formatDate}
 *     formatLabel={formatLabel}
 *   />
 */

// ── Imports ───────────────────────────────────────────────────

// InfoRow: a reusable row component from ProfileUI.tsx.
// Renders: [icon box] [label text above] [value text below]
// Used for Date of Birth, Email Address, and Mobile rows.
import { InfoRow } from './ProfileUI';

// BasicDetails: TypeScript type for the basic profile data shape.
// { firstName, lastName, email, mobile, devType, dateOfBirth, aboutMe, gender }
// `type` keyword = import only for type checking, no runtime impact.
import type { BasicDetails } from '../../shared/model/profile';


// ─────────────────────────────────────────────────────────────
// PROPS INTERFACE
// Defines the shape of props this component accepts.
// TypeScript checks that the parent (Profile.tsx) passes the correct types.
// ─────────────────────────────────────────────────────────────

/**
 * ProfileSidebarProps
 *
 * basic       : The full basicDetails object from profile data.
 *               Contains: firstName, lastName, email, mobile,
 *               devType, dateOfBirth, aboutMe, gender.
 *
 * formatDate  : A function (d: string) => string
 *               Passed from Profile.tsx. Converts ISO date strings to
 *               human-readable format. e.g. "2004-06-05" → "05 June 2004"
 *
 * formatLabel : A function (v: string) => string
 *               Passed from Profile.tsx. Converts raw enum values to
 *               readable labels. e.g. "FULL_STACK_DEVELOPER" → "Full Stack Developer"
 */
interface ProfileSidebarProps {
  basic:       BasicDetails;
  formatDate:  (d: string) => string;
  formatLabel: (v: string) => string;
}


// ─────────────────────────────────────────────────────────────
// COMPONENT
// Arrow function component — destructures props inline for cleanliness.
// Returns JSX directly (no curly braces + return statement needed
// because it's a single expression wrapped in parentheses).
// ─────────────────────────────────────────────────────────────

/**
 * ProfileSidebar
 * Left column of the Profile page. Display-only, no state or side effects.
 */
const ProfileSidebar = ({
  basic,        // the basic details data object
  formatDate,   // date formatting helper
  formatLabel,  // label formatting helper
}: ProfileSidebarProps) => (

  // ── Outer column wrapper ────────────────────────────────────
  // This div occupies 1 column in the parent 3-column grid (set in Profile.tsx).
  // `lg:col-span-1` — explicitly spans 1 column on large screens (redundant
  //                   but self-documenting — makes the intent clear)
  // `flex flex-col` — stacks child cards vertically
  // `gap-4`         — 16px gap between the two cards
  <div className="lg:col-span-1 flex flex-col gap-4">

    {/* ══════════════════════════════════════════════════════
        CARD 1 — Avatar + Profile Info
        The main profile card containing avatar, name, badge,
        quick-info rows, and the about me section.
    ══════════════════════════════════════════════════════ */}
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-card">
      {/*
        bg-surface    : white in light mode, #18181B in dark mode (from index.css)
        border        : 0.5px border using --color-border token
        border-border : the border color CSS variable
        rounded-2xl   : 16px border radius (from --radius-2xl in index.css)
        p-6           : 24px padding on all sides
        shadow-card   : subtle box shadow (from --shadow-card in index.css)
      */}

      {/* ── Avatar Section ───────────────────────────────────
          `relative`     — makes this a positioning context for the
                           camera button (which uses `absolute` positioning)
          `w-fit`        — shrinks to the width of its content (the avatar circle)
          `mx-auto`      — centres the avatar horizontally in the card
          `mb-5`         — 20px bottom margin before the name section
      */}
      <div className="relative w-fit mx-auto mb-5">

        {/* ── Avatar circle ──────────────────────────────────
            `w-24 h-24`         — 96×96px circle
            `rounded-full`      — makes it perfectly circular
            `overflow-hidden`   — clips the image/placeholder to the circle shape
            `border-2`          — 2px solid border
            `border-accent`     — border uses the accent color (blue)
            `ring-4`            — adds a 4px outer ring (like a halo effect)
            `ring-accent-tint`  — ring uses the light tint of accent (#DBEAFE)
        */}
        <div className="w-24 h-24 rounded-full overflow-hidden
          border-2 border-accent ring-4 ring-accent-tint">

          {/* ── Placeholder avatar (shown when no photo uploaded) ──
              `w-full h-full`            — fills the entire circle
              `bg-raised`                — light grey background (#F4F4F5)
              `flex items-center`        — vertically centres the icon
              `justify-center`           — horizontally centres the icon
              TODO: replace this div with <img src={basic.avatarUrl} />
                    when photo upload is implemented
          */}
          <div className="w-full h-full bg-raised flex items-center justify-center">
            {/* SVG person/user icon — shown when no avatar photo exists */}
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={1.2} className="text-muted">
              {/* Top path: draws the head/shoulders silhouette */}
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </div>
        </div>

        {/* ── Camera / Upload button ────────────────────────
            Positioned absolutely over the bottom-right of the avatar circle.
            `absolute`         — taken out of normal flow, positioned relative
                                 to the parent `relative` div
            `-bottom-1`        — 4px below the bottom edge of the circle
            `-right-1`         — 4px to the right of the circle
            `w-7 h-7`          — 28×28px button
            `rounded-full`     — circular button
            `bg-accent`        — blue background
            `hover:bg-accent-hover` — darker blue on hover
            `text-white`       — white icon
            `border-2 border-surface` — white border creates a "gap" between
                                        the button and the avatar ring
            `flex items-center justify-center` — centres the icon inside
            `transition-all duration-150` — smooth 150ms hover transition
            `shadow-accent`    — blue-tinted drop shadow
            TODO: wire onClick to a file input for photo upload
        */}
        <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full
          bg-accent hover:bg-accent-hover text-white border-2 border-surface
          flex items-center justify-center transition-all duration-150 shadow-accent">
          {/* SVG camera icon inside the upload button */}
          <svg width="11" height="11" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={2.5}>
            {/* Camera body path */}
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
            />
            {/* Camera lens circle path */}
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
          </svg>
        </button>

      </div> {/* end avatar section */}

      {/* ── Name + Dev Type Badge ─────────────────────────────
          `text-center` — centres all content in this block
          `mb-4`        — 16px margin below before the divider
      */}
      <div className="text-center mb-4">

        {/* Full name — concatenates firstName and lastName from data */}
        <h2 className="text-lg font-bold tracking-tight text-text">
          {basic.firstName} {basic.lastName}
        </h2>

        {/* Dev type badge — pill-shaped label below the name.
            `inline-block`    — shrinks to text width (not full width)
            `mt-1.5`          — 6px top margin, small gap below name
            `text-xs`         — 11px font size
            `font-bold`       — bold text
            `uppercase`       — forces ALL CAPS on the text
            `tracking-wider`  — extra letter spacing for uppercase readability
            `bg-accent-tint`  — light blue background (#DBEAFE)
            `text-accent`     — blue text (#2563EB)
            `px-3 py-1`       — 12px horizontal, 4px vertical padding
            `rounded-full`    — fully rounded pill shape

            `formatLabel(basic.devType)` converts the raw stored value:
              "FULL_STACK_DEVELOPER" → "Full Stack Developer"
              "FRONTEND_DEVELOPER"   → "Frontend Developer"
        */}
        <span className="inline-block mt-1.5 text-xs font-bold uppercase
          tracking-wider bg-accent-tint text-accent px-3 py-1 rounded-full">
          {formatLabel(basic.devType)}
        </span>

      </div>

      {/* ── Horizontal Divider ───────────────────────────────
          `h-px`       — 1px height (a thin line)
          `bg-border`  — uses --color-border token (light grey / dark grey)
          `mb-4`       — 16px bottom margin
      */}
      <div className="h-px bg-border mb-4" />

      {/* ── Quick Info Rows ───────────────────────────────────
          Three InfoRow components stacked vertically.
          `flex flex-col gap-3` — vertical stack with 12px gaps

          Each InfoRow receives:
            label : the small text shown above the value
            value : the main text to display
            icon  : an SVG element rendered in a tinted accent box
      */}
      <div className="flex flex-col gap-3">

        {/* Date of Birth row
            `formatDate(basic.dateOfBirth)` converts the raw ISO date:
              "2004-06-05" → "05 June 2004"
            Icon: calendar SVG
        */}
        <InfoRow
          label="Date of Birth"
          value={formatDate(basic.dateOfBirth)}
          icon={
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2}>
              {/* Calendar grid path */}
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
          }
        />

        {/* Email Address row
            `basic.email` is displayed as-is (no formatting needed)
            Icon: envelope SVG
        */}
        <InfoRow
          label="Email Address"
          value={basic.email}
          icon={
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2}>
              {/* Envelope shape path */}
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          }
        />

        {/* Mobile row
            `basic.mobile` is displayed as-is (no formatting needed)
            Icon: phone handset SVG
        */}
        <InfoRow
          label="Mobile"
          value={basic.mobile}
          icon={
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2}>
              {/* Phone handset path */}
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
              />
            </svg>
          }
        />

      </div> {/* end quick info rows */}

      {/* ── Second Horizontal Divider ─────────────────────────
          `my-4` — 16px margin BOTH above and below (top and bottom)
          Visually separates the quick-info rows from the About Me section
      */}
      <div className="h-px bg-border my-4" />

      {/* ── About Me Section ─────────────────────────────────
          Displays the user's bio/description text from basic.aboutMe.
      */}
      <div>
        {/* Section label — small uppercase heading above the text */}
        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
          About Me
        </p>

        {/* The about me text content from basic.aboutMe
            `text-sm`        — 12px font size
            `text-secondary` — secondary text color (--color-secondary)
            `leading-relaxed`— 1.75 line height for comfortable reading
        */}
        <p className="text-sm text-secondary leading-relaxed">{basic.aboutMe}</p>
      </div>

    </div> {/* end Card 1 */}


    {/* ══════════════════════════════════════════════════════
        CARD 2 — Profile Completion
        Shows a progress bar indicating how complete the profile is.
        Currently hardcoded at 78% — in the future this should be
        calculated dynamically based on which fields are filled.

        TODO: calculate completion % dynamically from basicDetails,
              skills, projects, collaboration etc. field presence.
    ══════════════════════════════════════════════════════ */}
    <div className="bg-surface border border-border rounded-2xl p-5 shadow-card">
      {/*
        p-5 (20px) instead of p-6 (24px) — slightly more compact than Card 1
      */}

      {/* ── Completion header row ─────────────────────────────
          Label on the left, percentage on the right.
          `justify-between` — pushes them to opposite ends of the row
          `mb-3`            — 12px margin below before the progress bar
      */}
      <div className="flex items-center justify-between mb-3">
        {/* "Completion" label */}
        <p className="text-xs font-bold uppercase tracking-wider text-text">
          Completion
        </p>
        {/* Percentage display — same accent color as the bar below */}
        <span className="text-xs font-bold text-accent">78%</span>
      </div>

      {/* ── Progress bar ─────────────────────────────────────
          Two-layer approach:
            Outer div: the grey "track" (background of the bar)
            Inner div: the coloured "fill" (shows actual progress)

          Outer div:
            `w-full`        — full width of the card
            `h-1.5`         — 6px height (thin bar)
            `bg-raised`     — grey track color (#F4F4F5 light / #1F1F23 dark)
            `rounded-full`  — fully rounded ends
            `overflow-hidden` — clips the inner fill to the rounded corners
            `mb-3`          — 12px margin below before the hint text

          Inner div:
            `h-full`        — fills the full 6px height of the track
            `bg-accent`     — blue fill color
            `rounded-full`  — rounded fill ends
            `style={{ width: '78%' }}` — inline style to set the fill width.
                              This uses an inline style (not Tailwind class)
                              because the width is a dynamic value.
                              When calculating dynamically: style={{ width: `${completionPercent}%` }}
      */}
      <div className="w-full h-1.5 bg-raised rounded-full overflow-hidden mb-3">
        <div className="h-full bg-accent rounded-full" style={{ width: '78%' }} />
      </div>

      {/* ── Hint text ─────────────────────────────────────────
          Tells the user what action will increase their completion %.
          `text-xs`   — 11px font
          `text-muted` — muted/placeholder color (#A1A1AA light / #52525B dark)
      */}
      <p className="text-xs text-muted">Add more details to reach 100%</p>

    </div> {/* end Card 2 */}

  </div> // end outer column wrapper
);

// ── Default export ────────────────────────────────────────────
// Makes this component importable in Profile.tsx as:
// import ProfileSidebar from '../../components/share-profile/ProfileSidebar'
export default ProfileSidebar;