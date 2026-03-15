/* eslint-disable react-refresh/only-export-components */
/**
 * @file Profile.tsx
 * @location src/pages/Profile.tsx
 *
 * @description
 * This is the main Profile page component.
 * It is responsible for:
 *   1. Fetching profile data via the `useProfile` custom hook
 *   2. Managing which tab is currently active (Basic, Skills, Projects etc.)
 *   3. Managing which edit modal is currently open
 *   4. Handling the draft → save → close flow for editing
 *
 * @dataflow
 *   profile.json → profileService.ts → useProfile hook → Profile.tsx → child components
 *
 * @structure
 *   - Helpers        : formatDate, formatLabel (utility functions)
 *   - TABS config    : array that drives the tab bar
 *   - LoadingSkeleton: shown while data is being fetched
 *   - ErrorState     : shown if data fetch fails
 *   - Profile        : main page component (default export)
 */

// ── React core import ─────────────────────────────────────────
// `useState` is a React hook that lets us store and update values
// inside a component. When the value changes, the component re-renders.
import { useState } from 'react';

// ── TypeScript type imports ───────────────────────────────────
// `type` keyword means we are importing only the TypeScript type definitions,
// not any actual runtime code. These are used for type checking only.
//
// BasicDetails     : shape of the basic profile form data
//                    { firstName, lastName, email, mobile, gender, ... }
//
// Collaboration    : shape of the collaboration preferences form data
//                    { pitch, projectTypes, lookingFor, availability, ... }
//
// Skill            : shape of individual skill objects added to the profile
//
// TabKey           : union type of all valid tab names
//                    'basic' | 'skills' | 'projects' | 'collaborate' |
//                    'experience' | 'education' | 'achievements'
import type { BasicDetails, Collaboration, Skill, TabKey } from '../../shared/model/profile';

// ── Custom hook import ────────────────────────────────────────
// `useProfile` is our custom data-fetching hook.
// It calls profileService.ts which reads from profile.json (mock) or real API.
// It returns: { data, loading, saving, error, saveBasic, saveCollaboration, saveSkills, refetch }
// We never call profileService.ts directly from the page — always via this hook.
import useProfile from '../../hooks/useProfile';

// ── Component imports ─────────────────────────────────────────
// ProfileSidebar : the left column — avatar, name, quick info, completion bar
import ProfileSidebar from '../../components/share-profile/ProfileSidebar';

// Tab components : each tab has its own component to keep this file lean.
// They are pure display components — they only receive props and render.
// They do NOT fetch any data themselves.
//
// AchievementsTab : renders the achievements list
// BasicTab        : renders the basic details card
// CollaborateTab  : renders the collaboration preferences card
// EducationTab    : renders the education list
// ExperienceTab   : renders the work experience list
// ProjectsTab     : renders the projects list
// SkillsTab       : renders the skills grouped by category
import {
  AchievementsTab,
  BasicTab,
  CollaborateTab,
  EducationTab,
  ExperienceTab,
  ProjectsTab,
  SkillsTab,
} from '../../components/share-profile/ProfileTabs';

// Modal components : each modal is used when user clicks "Edit" or "Add"
//
// BasicModal       : edit modal for Basic Details form
// CollaborateModal : edit modal for Collaboration Preferences form
// SkillsModal      : edit modal for adding/removing Skills
// ComingSoonModal  : placeholder modal for tabs not yet wired to API
//                    (Projects, Experience, Education, Achievements)
import {
  BasicModal,
  CollaborateModal,
  SkillsModal,
  ComingSoonModal,
} from '../../components/share-profile/ProfileModals';


// ─────────────────────────────────────────────────────────────
// SECTION 1 — HELPER FUNCTIONS
// These are utility functions used across the page and child components.
// They are exported so other files (ProfileTabs, ProfileSidebar) can
// import and reuse them without duplicating code.
// ─────────────────────────────────────────────────────────────

/**
 * formatDate
 * Converts a date string (e.g. "2004-06-05") into a human-readable format.
 *
 * @param d - ISO date string e.g. "2004-06-05"
 * @returns  Human-readable string e.g. "05 June 2004"
 *           Returns "—" (em dash) if the string is empty or falsy
 *
 * @example
 *   formatDate("2004-06-05")  → "05 June 2004"
 *   formatDate("")            → "—"
 *   formatDate("2023-01-15")  → "15 January 2023"
 *
 * How it works:
 *   1. `if (!d) return '—'`  — guard against empty/null/undefined input
 *   2. `new Date(d)`         — parses the string into a JavaScript Date object
 *   3. `.toLocaleDateString` — formats it using browser locale settings
 *   4. The options object    — specifies the exact format we want
 */
export const formatDate = (d: string) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', {
    day: '2-digit',   // e.g. "05"
    month: 'long',    // e.g. "June"
    year: 'numeric',  // e.g. "2004"
  });
};

/**
 * formatLabel
 * Converts a raw enum/API value into a readable display label.
 *
 * @param val - Raw value from data e.g. "NEVER_MARRIED" or "MALE"
 * @returns    Formatted label e.g. "Never Married" or "Male"
 *
 * @example
 *   formatLabel("NEVER_MARRIED") → "Never Married"
 *   formatLabel("MALE")          → "Male"
 *   formatLabel("IN_PROGRESS")   → "In Progress"
 *
 * How it works:
 *   1. `.replace(/_/g, ' ')`           — replaces ALL underscores with spaces
 *                                         "NEVER_MARRIED" → "NEVER MARRIED"
 *   2. `.replace(/\b\w/g, c => c.toUpperCase())` — capitalises the first
 *                                         letter of EVERY word
 *                                         "NEVER MARRIED" → "Never Married"
 *   Note: `/g` is the global flag — apply to ALL matches, not just the first.
 *         `/\b/` matches a word boundary (start of a word).
 *         `/\w/` matches any word character (letter, digit, underscore).
 */
export const formatLabel = (val: string) =>
  val.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());


// ─────────────────────────────────────────────────────────────
// SECTION 2 — TABS CONFIGURATION
// This array defines the tab bar shown at the top of the right column.
// It is defined OUTSIDE the component so it is created ONCE and never
// re-created on re-renders. This is a performance best practice.
//
// Each object has:
//   key   : matches the TabKey type — used to identify which tab is active
//           and which tab component to render
//   label : the display text shown in the tab button
// ─────────────────────────────────────────────────────────────
const TABS: { key: TabKey; label: string }[] =[
  { key: 'basic',        label: 'Basic'        },
  { key: 'skills',       label: 'Skills'       },
  { key: 'projects',     label: 'Projects'     },
  { key: 'collaborate',  label: 'Collaborate'  },
  { key: 'experience',   label: 'Experience'   },
  { key: 'education',    label: 'Education'    },
  { key: 'achievements', label: 'Achievements' },
];


// ─────────────────────────────────────────────────────────────
// SECTION 3 — LOADING SKELETON COMPONENT
// Shown while the profile data is being fetched from the service.
// This prevents showing an empty page while waiting for data.
// It is a simple inline component — no props needed.
// ─────────────────────────────────────────────────────────────

/**
 * LoadingSkeleton
 * A full-screen loading indicator shown while data is being fetched.
 * Uses Tailwind's `animate-spin` to rotate the spinner.
 */
const LoadingSkeleton = () => (
  // Full-screen container, vertically and horizontally centred
  <div className="min-h-screen bg-bg flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      {/* Spinning circle — border-t-transparent creates the "gap" in the ring */}
      <div className="w-8 h-8 border-2 border-accent border-t-transparent
        rounded-full animate-spin" />
      {/* Loading text below the spinner */}
      <p className="text-sm text-muted">Loading profile...</p>
    </div>
  </div>
);


// ─────────────────────────────────────────────────────────────
// SECTION 4 — ERROR STATE COMPONENT
// Shown when the data fetch fails (network error, server error etc.)
// Receives two props:
//   message  : the error message to display (from the hook's error state)
//   onRetry  : function to call when the user clicks "Try again"
//              (this calls refetch() from the hook which re-runs fetchProfile)
// ─────────────────────────────────────────────────────────────

/**
 * ErrorState
 * A full-screen error card shown when profile data fails to load.
 *
 * @param message  - Error message string to display to the user
 * @param onRetry  - Callback function triggered when "Try again" is clicked
 */
const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  // Full-screen container, centred
  <div className="min-h-screen bg-bg flex items-center justify-center px-4">
    {/* Error card — max width 384px, centred */}
    <div className="bg-surface border border-danger-border rounded-2xl p-8
      text-center max-w-sm w-full shadow-card">

      {/* Warning icon container — uses danger color tokens from index.css */}
      <div className="w-12 h-12 rounded-xl bg-danger-bg flex items-center
        justify-center mx-auto mb-4">
        {/* SVG warning triangle icon */}
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={1.8} className="text-danger">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>

      {/* Static error heading */}
      <h3 className="text-sm font-bold text-text mb-1">Failed to load profile</h3>

      {/* Dynamic error message passed in as prop */}
      <p className="text-xs text-secondary mb-4">{message}</p>

      {/* Retry button — calls onRetry() which triggers refetch() in the hook */}
      <button
        onClick={onRetry}
        className="px-5 py-2.5 rounded-lg text-sm font-semibold
          bg-accent hover:bg-accent-hover text-white
          shadow-accent transition-all duration-150">
        Try again
      </button>
    </div>
  </div>
);


// ─────────────────────────────────────────────────────────────
// SECTION 5 — MAIN PAGE COMPONENT
// This is the heart of the file. It:
//   1. Calls useProfile() to get data and actions
//   2. Manages all UI state (active tab, open modal, drafts)
//   3. Renders the page layout (sidebar + tab bar + tab content + modals)
// ─────────────────────────────────────────────────────────────

/**
 * Profile (default export)
 * Main profile page component. Orchestrates data flow and UI state.
 * All data comes from the `useProfile` hook — no hardcoded values here.
 */
const Profile = () => {

  // ── Step 1: Get data and actions from the hook ─────────────
  //
  // `useProfile()` calls profileService.ts → profile.json (or real API).
  // It returns an object we destructure into data, loading, saving, error, 
  // and the save functions like saveBasic, saveCollaboration, and saveSkills.
  const {
    data,
    loading,
    saving,
    error,
    saveBasic,
    saveCollaboration,
    saveSkills,
    refetch,
  } = useProfile();


  // ── Step 2: UI state — active tab ──────────────────────────
  // `activeTab` tracks which tab panel is currently visible.
  // Default is 'basic' — so the Basic Details tab shows on first load.
  const [activeTab, setActiveTab] = useState<TabKey>('basic');


  // ── Step 3: UI state — which modal is open ─────────────────
  // `editModal` tracks which modal is currently open.
  const[editModal, setEditModal] = useState<TabKey | null>(null);


  // ── Step 4: Draft state — copy of data being edited ────────
  //
  // WHY DO WE NEED DRAFTS?
  // When a user opens a modal and starts typing, we must NOT immediately
  // update the real `data` object. If the user clicks Cancel, we want to
  // discard changes. So we keep a COPY (draft) that is modified freely.
  // Only when the user clicks Save do we apply the draft to the real data.
  const [basicDraft,         setBasicDraft]         = useState<BasicDetails | null>(null);
  const [collaborationDraft, setCollaborationDraft] = useState<Collaboration | null>(null);
  const [skillsDraft,        setSkillsDraft]        = useState<Skill[] | null>(null);


  // ── Step 5: Early returns for loading and error states ─────
  // These must come AFTER all useState/useEffect calls (React rules of hooks).
  if (loading) return <LoadingSkeleton />;
  if (error || !data) return <ErrorState message={error ?? 'No data'} onRetry={refetch} />;


  // ─────────────────────────────────────────────────────────
  // SECTION 5A — MODAL HANDLER FUNCTIONS
  // These functions manage the open → edit → save/cancel flow.
  // They only exist below the early returns because we need `data`
  // to be available (confirmed non-null by the guards above).
  // ─────────────────────────────────────────────────────────

  /**
   * openModal
   * Called when the user clicks an "Edit" or "Add" button.
   * Sets up the draft state and marks the modal as open.
   *
   * @param tab - Which tab's modal to open (e.g. 'basic', 'collaborate')
   */
  const openModal = (tab: TabKey) => {
    // Create SHALLOW COPIES so changes don't affect the original until saved.
    if (tab === 'basic')       setBasicDraft({ ...data.basicDetails });
    if (tab === 'collaborate') setCollaborationDraft({ ...data.collaboration });
    if (tab === 'skills')      setSkillsDraft([...(data.skills || [])]); 
    
    setEditModal(tab);
  };

  /**
   * closeModal
   * Called when the user clicks Cancel or the X button in any modal.
   * Resets all modal-related state to its initial (closed) values.
   */
  const closeModal = () => {
    setEditModal(null);
    setBasicDraft(null);
    setCollaborationDraft(null);
    setSkillsDraft(null);
  };

  /**
   * handleSaveBasic
   * Called when the user clicks "Save" inside the BasicModal.
   */
  const handleSaveBasic = async () => {
    if (!basicDraft) return;
    if (saveBasic) await saveBasic(basicDraft);
    closeModal();
  };

  /**
   * handleSaveCollaboration
   * Called when "Save" is clicked inside CollaborateModal.
   */
  const handleSaveCollaboration = async () => {
    if (!collaborationDraft) return;
    if (saveCollaboration) await saveCollaboration(collaborationDraft);
    closeModal();
  };

  /**
   * handleSaveSkills
   * Called when "Save" is clicked inside SkillsModal.
   */
  const handleSaveSkills = async () => {
    if (!skillsDraft) return;
    if (saveSkills) await saveSkills(skillsDraft);
    closeModal();
  };


  // ─────────────────────────────────────────────────────────
  // SECTION 5B — RENDER
  // The JSX returned by the component.
  // At this point we know: loading=false, error=null, data is not null.
  // ─────────────────────────────────────────────────────────
  return (
    // Page wrapper
    // `min-h-screen`       — takes up at least the full viewport height
    // `bg-bg`              — uses --color-bg CSS token from index.css
    // `transition-colors`  — smooth color transition when dark mode toggles
    // `duration-250`       — transition takes 250ms
    <div className="min-h-screen bg-bg transition-colors duration-250">

      {/* ── Page content wrapper ────────────────────────────
          `max-w-6xl`     — caps width at 1152px on large screens
          `mx-auto`       — centres the content horizontally
          `px-4 sm:px-6`  — 16px padding on mobile, 24px on small screens+
          `py-8`          — 32px vertical padding top and bottom
      */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Page Header ──────────────────────────────────
            Two-column layout: title on left, completion badge on right.
            `justify-between` — pushes them to opposite ends
            `mb-8`            — 32px space below the header
        */}
        <div className="flex items-center justify-between mb-8">
          <div>
            {/* Page title */}
            <h1 className="text-2xl font-bold tracking-tight text-text">My Profile</h1>
            {/* Subtitle */}
            <p className="text-sm text-secondary mt-1">Manage your personal information</p>
          </div>

          {/* Completion badge — hidden on mobile (`hidden sm:flex`) */}
          <div className="hidden sm:flex items-center gap-2
            bg-surface border border-border rounded-xl px-4 py-2 shadow-card">
            {/* Small filled dot using accent color */}
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-xs font-semibold text-text">78% complete</span>
          </div>
        </div>

        {/* ── Two-column grid layout ────────────────────────
            On mobile (default): single column (stacked)
            On large screens (lg:): 3-column grid
              - Left sidebar takes 1 column (lg:col-span-1)
              - Right content takes 2 columns (lg:col-span-2)
            `gap-6` — 24px gap between columns
        */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT COLUMN: Profile Sidebar ────────────────
              ProfileSidebar is a separate component in ProfileSidebar.tsx
              It receives:
                basic       : data.basicDetails — to display name, email, DOB etc.
                formatDate  : utility to format date strings
                formatLabel : utility to format enum values like "MALE" → "Male"
              It does NOT receive any edit handlers — the sidebar is display-only.
          */}
          <ProfileSidebar
            basic={data.basicDetails}
            formatDate={formatDate}
            formatLabel={formatLabel}
          />

          {/* ── RIGHT COLUMN: Tab bar + Tab content ──────────
              Takes 2 of the 3 grid columns on large screens.
              `flex flex-col gap-5` — stacks tab bar and content vertically
          */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* ── Tab Bar ────────────────────────────────────
                `overflow-x-auto` — allows horizontal scrolling on mobile
                                    so all 7 tabs are accessible
                `pb-1`            — tiny bottom padding to show scroll indicator
            */}
            <div className="overflow-x-auto pb-1">
              {/* Inner container — sized to content (`w-fit`) not full width */}
              <div className="flex gap-1 bg-raised border border-border rounded-xl p-1 w-fit">

                {/* Loop over TABS array to render one button per tab */}
                {TABS.map(tab => (
                  <button
                    key={tab.key}             // React needs a unique key for list items
                    onClick={() => setActiveTab(tab.key)}  // clicking sets this as active tab
                    className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap
                      transition-all duration-150
                      ${activeTab === tab.key
                        // Active tab: white background, accent text, subtle shadow
                        ? 'bg-surface text-accent border border-border shadow-card'
                        // Inactive tab: no background, secondary text, hover effect
                        : 'text-secondary hover:text-text'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Tab Content ────────────────────────────────
                Conditional rendering — only ONE tab renders at a time.
                Pattern: {activeTab === 'xxx' && <XxxTab ... />}
                  true  → component renders
                  false → nothing renders (component is unmounted)
                Each tab component receives ONLY the data slice it needs.
                They do NOT get the full `data` object — just their slice.
            */}

            {/* Basic Details tab */}
            {activeTab === 'basic' && (
              <BasicTab
                basic={data.basicDetails}    // only the basicDetails slice
                formatDate={formatDate}       // helper to format DOB
                formatLabel={formatLabel}     // helper to format gender, marital status
                onEdit={() => openModal('basic')}  // clicking Edit opens BasicModal
              />
            )}

            {/* Skills tab */}
            {activeTab === 'skills' && (
              <SkillsTab
                skills={data.skills}          // array of { id, name, level, category }
                onEdit={() => openModal('skills')}  // opens Real Skills Modal!
              />
            )}

            {/* Projects tab */}
            {activeTab === 'projects' && (
              <ProjectsTab
                projects={data.projects}      // array of project objects
                onAdd={() => openModal('projects')}  // opens ComingSoonModal
              />
            )}

            {/* Collaborate tab */}
            {activeTab === 'collaborate' && (
              <CollaborateTab
                collaboration={data.collaboration}  // single collaboration object
                onEdit={() => openModal('collaborate')}  // opens CollaborateModal
              />
            )}

            {/* Experience tab */}
            {activeTab === 'experience' && (
              <ExperienceTab
                experiences={data.experiences}  // array of experience objects
                onAdd={() => openModal('experience')}  // opens ComingSoonModal
              />
            )}

            {/* Education tab */}
            {activeTab === 'education' && (
              <EducationTab
                educations={data.educations}    // array of education objects
                onAdd={() => openModal('education')}   // opens ComingSoonModal
              />
            )}

            {/* Achievements tab */}
            {activeTab === 'achievements' && (
              <AchievementsTab
                achievements={data.achievements}  // array of achievement objects
                formatDate={formatDate}             // to format achievement dates
                onAdd={() => openModal('achievements')}  // opens ComingSoonModal
              />
            )}

          </div>
        </div>
      </div>

      {/* ── MODALS ─────────────────────────────────────────────
          Modals are rendered OUTSIDE the grid layout because they are
          fixed/absolute positioned overlays on top of everything.
          They are placed at the bottom of the JSX tree by convention.
      */}

      {/* ── Basic Details Modal ──────────────────────────────
          Conditional rendering: `{basicDraft && <BasicModal ... />}`
          basicDraft is null  → modal is NOT in the DOM at all
          basicDraft has data → modal IS in the DOM and may be open or closed
      */}
      {basicDraft && (
        <BasicModal
          isOpen={editModal === 'basic'}
          onClose={closeModal}
          onSave={handleSaveBasic}
          saving={saving}
          draft={basicDraft}
          setDraft={setBasicDraft}
        />
      )}

      {/* ── Collaborate Modal ────────────────────────────────
          Identical pattern to BasicModal above.
      */}
      {collaborationDraft && (
        <CollaborateModal
          isOpen={editModal === 'collaborate'}
          onClose={closeModal}
          onSave={handleSaveCollaboration}
          saving={saving}
          draft={collaborationDraft}
          setDraft={setCollaborationDraft}
        />
      )}

      {/* ── Skills Modal ────────────────────────────────
          Wired up to our new Draft array pattern for adding/removing multiple tags
      */}
      {skillsDraft && (
        <SkillsModal
          isOpen={editModal === 'skills'}
          onClose={closeModal}
          onSave={handleSaveSkills}
          saving={saving}
          draft={skillsDraft}
          setDraft={setSkillsDraft}
        />
      )}

      {/* ── Coming Soon Modal ────────────────────────────────
          Always rendered (no conditional wrapper) because it handles
          multiple tabs (projects, experience, education, achievements).
      */}
      <ComingSoonModal editModal={editModal} onClose={closeModal} />

    </div>
  );
};

// ── Default export ────────────────────────────────────────────
export default Profile;