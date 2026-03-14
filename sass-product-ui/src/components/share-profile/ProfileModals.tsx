/**
 * @file ProfileModals.tsx
 * @location src/components/share-profile/ProfileModals.tsx
 *
 * @description
 * Contains all edit/add modal components for the Profile page.
 * Every modal in this file uses the shared `EditModal` wrapper component
 * which handles the backdrop, header, scroll area, and Save/Cancel buttons.
 *
 * This file exports THREE components:
 *
 *   1. BasicModal       — Edit form for Basic Details
 *                         (firstName, lastName, mobile, devType, dateOfBirth,
 *                          gender, email, aboutMe)
 *
 *   2. CollaborateModal — Edit form for Collaboration Preferences
 *                         (pitch, projectTypes, lookingFor, availability,
 *                          workStyle, timezone)
 *
 *   3. ComingSoonModal  — Placeholder modal for tabs not yet wired to API
 *                         (skills, projects, experience, education, achievements)
 *                         Renders one EditModal per key internally.
 *
 * @pattern  Draft pattern
 *   All modals receive a `draft` (a copy of the real data) and a `setDraft`
 *   (the setState function). They edit the COPY, never the original.
 *   The original data is only updated when the user clicks Save and
 *   the parent's `onSave` handler commits the draft to the hook.
 *
 * @usage
 *   // In Profile.tsx:
 *   {basicDraft && (
 *     <BasicModal
 *       isOpen={editModal === 'basic'}
 *       draft={basicDraft}
 *       setDraft={setBasicDraft}
 *       onSave={handleSaveBasic}
 *       onClose={closeModal}
 *     />
 *   )}
 */

// ── Imports ───────────────────────────────────────────────────

// EditModal: the shared modal wrapper used by ALL modals in this file.
// It provides: backdrop overlay, title bar, X button, scrollable content
// area, Cancel button, and Save button with loading spinner.
// All we need to do is pass it a title and put form fields as children.
import EditModal from '../EditModal';

// Form primitives from ProfileUI.tsx — reusable styled form elements.
// FormInput    : a styled <input> element (text, email, tel, date)
// FormSelect   : a styled <select> dropdown element
// FormTextarea : a styled <textarea> element
import { FormInput, FormSelect, FormTextarea } from './ProfileUI';

// TypeScript type-only imports (no runtime code, just type checking):
// BasicDetails  : shape of the basic form data object
// Collaboration : shape of the collaboration form data object
// TabKey        : union of all tab name strings
//                 'basic' | 'skills' | 'projects' | 'collaborate' |
//                 'experience' | 'education' | 'achievements'
import type { BasicDetails, Collaboration, TabKey } from '../../shared/model/profile';


// ─────────────────────────────────────────────────────────────
// COMPONENT 1 — BasicModal
// Edit form for the Basic Details section of the profile.
// ─────────────────────────────────────────────────────────────

/**
 * BasicModal
 * A modal dialog with a form for editing basic profile information.
 * Opened when the user clicks "Edit" on the Basic Details tab.
 *
 * @prop isOpen   - Controls whether the modal overlay is visible.
 *                  true  → modal is visible on screen
 *                  false → modal is hidden (but may still be in the DOM)
 *                  Set by: `editModal === 'basic'` in Profile.tsx
 *
 * @prop onClose  - Called when Cancel is clicked or backdrop is clicked.
 *                  Resets editModal → null and basicDraft → null in Profile.tsx
 *
 * @prop onSave   - Called when the Save button is clicked.
 *                  Triggers handleSaveBasic() in Profile.tsx which:
 *                    1. Calls saveBasic(draft) from useProfile hook
 *                    2. Hook calls updateBasicDetails() from profileService
 *                    3. data.basicDetails is updated with the response
 *                    4. closeModal() is called
 *
 * @prop saving   - Optional boolean (default: false).
 *                  true  → Save button shows spinner + "Saving..." text
 *                  false → Save button shows normal "Save" text
 *                  Comes from the `saving` state in useProfile hook.
 *
 * @prop draft    - The current copy of basicDetails being edited.
 *                  This is NOT the original data — it's a copy made when
 *                  the modal was opened: `{ ...data.basicDetails }`.
 *                  The form reads its values FROM this draft.
 *
 * @prop setDraft - React's setState function for the basicDraft state.
 *                  Type: React.Dispatch<React.SetStateAction<BasicDetails | null>>
 *                  This exact type is required because useState<BasicDetails | null>
 *                  in Profile.tsx returns this type. Using a custom function
 *                  type would cause a TypeScript error.
 *                  The form calls this to UPDATE the draft as the user types.
 */
export const BasicModal = ({
  isOpen, onClose, onSave, saving = false, draft, setDraft,
}: {
  isOpen:   boolean;
  onClose:  () => void;
  onSave:   () => void;
  saving?:  boolean;   // `?` means optional — defaults to false if not provided
  draft:    BasicDetails;
  // ✅ Matches React's Dispatch<SetStateAction<BasicDetails | null>>
  // This must match the exact type returned by useState<BasicDetails | null>
  // otherwise TypeScript will throw an assignability error.
  setDraft: React.Dispatch<React.SetStateAction<BasicDetails | null>>;
}) => (
  // EditModal wrapper handles all the modal chrome (backdrop, title, buttons)
  // We just pass form fields as children.
  <EditModal
    title="Edit your basic details information."
    isOpen={isOpen}
    onClose={onClose}
    onSave={onSave}
    saving={saving}
  >
    {/* Two-column grid layout for form fields.
        `grid grid-cols-2` — two equal-width columns
        `gap-4`            — 16px gap between all grid cells */}
    <div className="grid grid-cols-2 gap-4">

      {/* ── First Name ────────────────────────────────────────
          `value={draft.firstName}` — controlled input: value comes from draft
          `onChange={v => setDraft(d => d ? { ...d, firstName: v } : d)}`
            v  = the new string value the user typed
            d  = the current draft state (could theoretically be null)
            d ? — null guard: only update if draft is not null (safety check)
            { ...d, firstName: v } — spread all existing fields, override firstName
            : d — if d is null (shouldn't happen), return it unchanged
      */}
      <FormInput
        label="First Name"
        value={draft.firstName}
        placeholder="First name"
        onChange={v => setDraft(d => d ? { ...d, firstName: v } : d)}
      />

      {/* ── Last Name ─────────────────────────────────────────
          Same pattern as First Name — updates draft.lastName
      */}
      <FormInput
        label="Last Name"
        value={draft.lastName}
        placeholder="Last name"
        onChange={v => setDraft(d => d ? { ...d, lastName: v } : d)}
      />

      {/* ── Phone Number ──────────────────────────────────────
          `type="tel"` — tells the browser this is a phone number field.
          On mobile devices this shows a numeric keyboard.
          Updates draft.mobile
      */}
      <FormInput
        label="Phone Number"
        type="tel"
        value={draft.mobile}
        placeholder="Phone number"
        onChange={v => setDraft(d => d ? { ...d, mobile: v } : d)}
      />

      {/* ── Dev Type (dropdown) ───────────────────────────────
          FormSelect renders a <select> dropdown.
          `value={draft.devType}` — controlled: selected option from draft
          `options` — array of { label, value } pairs:
            label : what the user sees in the dropdown (e.g. "Frontend Developer")
            value : what gets stored in the data (e.g. "FRONTEND_DEVELOPER")
          Updates draft.devType with the selected value string
      */}
      <FormSelect
        label="Dev Type"
        value={draft.devType}
        onChange={v => setDraft(d => d ? { ...d, devType: v } : d)}
        options={[
          { label: 'Frontend Developer',  value: 'FRONTEND_DEVELOPER'  },
          { label: 'Backend Developer',   value: 'BACKEND_DEVELOPER'   },
          { label: 'Full Stack Developer',value: 'FULL_STACK_DEVELOPER' },
        ]}
      />

      {/* ── Date of Birth ─────────────────────────────────────
          `type="date"` — renders a native browser date picker.
          Value format is "YYYY-MM-DD" (e.g. "2004-06-05").
          The formatDate() helper in Profile.tsx converts this for display.
          Updates draft.dateOfBirth
      */}
      <FormInput
        label="Date of Birth"
        type="date"
        value={draft.dateOfBirth}
        onChange={v => setDraft(d => d ? { ...d, dateOfBirth: v } : d)}
      />

      {/* ── Gender (dropdown) ─────────────────────────────────
          Same pattern as Dev Type dropdown.
          Stores the raw value ("MALE", "FEMALE", "OTHER") in the draft.
          The formatLabel() helper in ProfileTabs converts it for display.
          Updates draft.gender
      */}
      <FormSelect
        label="Gender"
        value={draft.gender}
        onChange={v => setDraft(d => d ? { ...d, gender: v } : d)}
        options={[
          { label: 'Male',   value: 'MALE'   },
          { label: 'Female', value: 'FEMALE' },
          { label: 'Other',  value: 'OTHER'  },
        ]}
      />

      {/* ── Email Address (full width) ────────────────────────
          `col-span-2` — this field spans BOTH columns (full width).
          `type="email"` — browser validates email format on form submit.
          Updates draft.email
      */}
      <div className="col-span-2">
        <FormInput
          label="Email Address"
          type="email"
          value={draft.email}
          placeholder="email@example.com"
          onChange={v => setDraft(d => d ? { ...d, email: v } : d)}
        />
      </div>

      {/* ── About Me (full width, multiline) ──────────────────
          `col-span-2` — spans both columns (full width).
          FormTextarea renders a <textarea> instead of <input>.
          `rows={3}` — 3 visible lines tall (can scroll for more).
          Updates draft.aboutMe
      */}
      <div className="col-span-2">
        <FormTextarea
          label="About Me"
          value={draft.aboutMe}
          rows={3}
          placeholder="Tell us about yourself..."
          onChange={v => setDraft(d => d ? { ...d, aboutMe: v } : d)}
        />
      </div>

    </div>
  </EditModal>
);


// ─────────────────────────────────────────────────────────────
// COMPONENT 2 — CollaborateModal
// Edit form for the Collaboration Preferences section.
// ─────────────────────────────────────────────────────────────

/**
 * CollaborateModal
 * A modal dialog with a form for editing collaboration preferences.
 * Opened when the user clicks "Edit" on the Collaborate tab.
 *
 * @prop isOpen   - Controls visibility. true → visible.
 *                  Set by: `editModal === 'collaborate'` in Profile.tsx
 *
 * @prop onClose  - Called on Cancel/backdrop click. Resets modal + draft.
 *
 * @prop onSave   - Called on Save click. Triggers handleSaveCollaboration()
 *                  in Profile.tsx → saveCollaboration(draft) in hook
 *                  → updateCollaboration() in service → data updated.
 *
 * @prop saving   - Optional boolean (default: false).
 *                  true → Save button shows loading spinner.
 *
 * @prop draft    - Copy of collaboration data being edited.
 *                  Created when modal opens: `{ ...data.collaboration }`.
 *
 * @prop setDraft - setState for collaborationDraft in Profile.tsx.
 *                  Type: Dispatch<SetStateAction<Collaboration | null>>
 */
export const CollaborateModal = ({
  isOpen, onClose, onSave, saving = false, draft, setDraft,
}: {
  isOpen:   boolean;
  onClose:  () => void;
  onSave:   () => void;
  saving?:  boolean;
  draft:    Collaboration;
  // ✅ Exact React setState type — must match useState<Collaboration | null>
  setDraft: React.Dispatch<React.SetStateAction<Collaboration | null>>;
}) => (
  <EditModal
    title="Edit your collaboration preferences."
    isOpen={isOpen}
    onClose={onClose}
    onSave={onSave}
    saving={saving}
  >
    <div className="grid grid-cols-2 gap-4">

      {/* ── My Pitch (full width, multiline) ──────────────────
          A short description of what the user wants to build.
          `col-span-2` — full width across both columns.
          Updates draft.pitch
      */}
      <div className="col-span-2">
        <FormTextarea
          label="My Pitch"
          value={draft.pitch}
          rows={3}
          placeholder="What do you want to build? Who are you looking for?"
          onChange={v => setDraft(d => d ? { ...d, pitch: v } : d)}
        />
      </div>

      {/* ── Project Types (comma-separated text input) ────────
          The user types values separated by commas (e.g. "SaaS, Mobile").
          We store this as an array in the draft, not a string.

          `value={draft.projectTypes.join(', ')}`
            Converts the array back to a comma-separated string for display.
            e.g. ['SaaS', 'Mobile'] → "SaaS, Mobile"

          `onChange` converts the string back to an array:
            v.split(',')                   — split by comma → ["SaaS", " Mobile"]
            .map(s => s.trim())            — remove spaces  → ["SaaS", "Mobile"]
            .filter(Boolean)               — remove empty strings (e.g. trailing comma)

          Updates draft.projectTypes (string[])
      */}
      <FormInput
        label="Project Types (comma separated)"
        value={draft.projectTypes.join(', ')}
        placeholder="SaaS, Open Source, Mobile"
        onChange={v => setDraft(d => d
          ? { ...d, projectTypes: v.split(',').map(s => s.trim()).filter(Boolean) }
          : d
        )}
      />

      {/* ── Looking For (comma-separated text input) ──────────
          Identical pattern to Project Types above.
          e.g. "Co-founder, Designer" → ['Co-founder', 'Designer']
          Updates draft.lookingFor (string[])
      */}
      <FormInput
        label="Looking For (comma separated)"
        value={draft.lookingFor.join(', ')}
        placeholder="Co-founder, Designer, Backend Dev"
        onChange={v => setDraft(d => d
          ? { ...d, lookingFor: v.split(',').map(s => s.trim()).filter(Boolean) }
          : d
        )}
      />

      {/* ── Availability (dropdown) ───────────────────────────
          How much time the user can commit to collaboration.
          Updates draft.availability
      */}
      <FormSelect
        label="Availability"
        value={draft.availability}
        onChange={v => setDraft(d => d ? { ...d, availability: v } : d)}
        options={[
          { label: 'Full-time', value: 'Full-time' },
          { label: 'Part-time', value: 'Part-time' },
          { label: 'Weekends',  value: 'Weekends'  },
          { label: 'Flexible',  value: 'Flexible'  },
        ]}
      />

      {/* ── Work Style (dropdown) ─────────────────────────────
          Preferred working arrangement.
          Updates draft.workStyle
      */}
      <FormSelect
        label="Work Style"
        value={draft.workStyle}
        onChange={v => setDraft(d => d ? { ...d, workStyle: v } : d)}
        options={[
          { label: 'Remote',    value: 'Remote'    },
          { label: 'Hybrid',    value: 'Hybrid'    },
          { label: 'In-person', value: 'In-person' },
        ]}
      />

      {/* ── Time Zone (text input) ────────────────────────────
          Free-text field for the user's timezone.
          e.g. "IST (UTC+5:30)"
          Updates draft.timezone
      */}
      <FormInput
        label="Time Zone"
        value={draft.timezone}
        placeholder="e.g. IST (UTC+5:30)"
        onChange={v => setDraft(d => d ? { ...d, timezone: v } : d)}
      />

    </div>
  </EditModal>
);


// ─────────────────────────────────────────────────────────────
// COMPONENT 3 — ComingSoonModal
// A placeholder modal for tabs whose full form is not yet built.
// Used for: skills, projects, experience, education, achievements.
// ─────────────────────────────────────────────────────────────

/**
 * ComingSoonModal
 * Renders a placeholder EditModal for each tab that isn't wired to an
 * API form yet. This lets the Edit/Add buttons work visually without
 * crashing — the user sees a "coming soon" message instead of nothing.
 *
 * @prop editModal - The currently open modal key (or null if none open).
 *                   e.g. 'skills' → the Skills coming-soon modal shows.
 *                   Type: TabKey | null
 *
 * @prop onClose   - Called when Cancel/X is clicked. Resets editModal → null.
 *
 * @note
 *   Unlike BasicModal and CollaborateModal, this component is ALWAYS
 *   rendered in Profile.tsx (no conditional wrapper).
 *   Each internal EditModal uses isOpen={editModal === key} to decide
 *   visibility — only one will be open at any time.
 *
 * @note
 *   When you build the real forms:
 *   1. Remove the key from the `keys` array here
 *   2. Create a dedicated modal component (like BasicModal)
 *   3. Add it to Profile.tsx with its own draft state
 */
export const ComingSoonModal = ({
  editModal,
  onClose,
}: {
  editModal: TabKey | null;  // which tab's modal is currently open (or null)
  onClose:   () => void;     // closes the modal
}) => {
  // List of tab keys that don't have a real form yet.
  // Each one gets its own EditModal instance rendered below.
  // When you build a real form for one, remove it from this array
  // and create a dedicated modal component instead.
  const keys: TabKey[] = ['skills', 'projects', 'experience', 'education', 'achievements'];

  return (
    // React Fragment (<>) — lets us return multiple elements without a wrapper div.
    // This is important because modals are portals/fixed overlays and should not
    // be wrapped in an extra DOM element.
    <>
      {/* Loop over each coming-soon key and render one EditModal per key */}
      {keys.map(key => (
        <EditModal
          key={key}   // React list key — must be unique (key names are unique here)

          // Dynamically generates the title:
          //   key.charAt(0).toUpperCase() — capitalises first letter: 's' → 'S'
          //   key.slice(1)                — rest of the string:       'kills'
          //   result:                       'Skills', 'Projects' etc.
          title={`Add ${key.charAt(0).toUpperCase() + key.slice(1)}`}

          // Only THIS modal is open when editModal matches this key.
          // All others will have isOpen=false and stay hidden.
          // e.g. if editModal === 'skills':
          //   key='skills'       → isOpen=true  → visible
          //   key='projects'     → isOpen=false → hidden
          //   key='experience'   → isOpen=false → hidden
          isOpen={editModal === key}

          // Both Cancel and Save call onClose() here because there is no
          // real form data to save — just close the modal either way.
          onClose={onClose}
          onSave={onClose}
        >
          {/* Placeholder content shown inside the modal body.
              `{key}` dynamically inserts the tab name e.g. "skills", "projects".
              This is a reminder for developers of where to build the real form. */}
          <p className="text-sm text-secondary py-6 text-center">
            Full {key} form — connect your API and build the form here.
          </p>
        </EditModal>
      ))}
    </>
  );
};