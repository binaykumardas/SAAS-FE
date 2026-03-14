// src/components/profile/ProfileModals.tsx
import EditModal from '../EditModal';
import { FormInput, FormSelect, FormTextarea } from './ProfileUI';
import type { BasicDetails, Collaboration, TabKey } from '../../shared/model/profile';

// ── Basic Details Modal ───────────────────────────────────────
export const BasicModal = ({
  isOpen, onClose, onSave, saving = false, draft, setDraft,
}: {
  isOpen:   boolean;
  onClose:  () => void;
  onSave:   () => void;
  saving?:  boolean;
  draft:    BasicDetails;
  // ✅ Matches React's Dispatch<SetStateAction<BasicDetails | null>>
  setDraft: React.Dispatch<React.SetStateAction<BasicDetails | null>>;
}) => (
  <EditModal
    title="Edit your basic details information."
    isOpen={isOpen}
    onClose={onClose}
    onSave={onSave}
    saving={saving}
  >
    <div className="grid grid-cols-2 gap-4">
      <FormInput
        label="First Name" value={draft.firstName} placeholder="First name"
        onChange={v => setDraft(d => d ? { ...d, firstName: v } : d)}
      />
      <FormInput
        label="Last Name" value={draft.lastName} placeholder="Last name"
        onChange={v => setDraft(d => d ? { ...d, lastName: v } : d)}
      />
      <FormInput
        label="Phone Number" type="tel" value={draft.mobile} placeholder="Phone number"
        onChange={v => setDraft(d => d ? { ...d, mobile: v } : d)}
      />
      <FormSelect
        label="Marital Status" value={draft.maritalStatus}
        onChange={v => setDraft(d => d ? { ...d, maritalStatus: v } : d)}
        options={[
          { label: 'Never Married', value: 'NEVER_MARRIED' },
          { label: 'Married',       value: 'MARRIED'       },
          { label: 'Divorced',      value: 'DIVORCED'      },
          { label: 'Widowed',       value: 'WIDOWED'       },
        ]}
      />
      <FormInput
        label="Date of Birth" type="date" value={draft.dateOfBirth}
        onChange={v => setDraft(d => d ? { ...d, dateOfBirth: v } : d)}
      />
      <FormSelect
        label="Gender" value={draft.gender}
        onChange={v => setDraft(d => d ? { ...d, gender: v } : d)}
        options={[
          { label: 'Male',   value: 'MALE'   },
          { label: 'Female', value: 'FEMALE' },
          { label: 'Other',  value: 'OTHER'  },
        ]}
      />
      <div className="col-span-2">
        <FormInput
          label="Email Address" type="email" value={draft.email}
          placeholder="email@example.com"
          onChange={v => setDraft(d => d ? { ...d, email: v } : d)}
        />
      </div>
      <div className="col-span-2">
        <FormTextarea
          label="About Me" value={draft.aboutMe} rows={3}
          placeholder="Tell us about yourself..."
          onChange={v => setDraft(d => d ? { ...d, aboutMe: v } : d)}
        />
      </div>
    </div>
  </EditModal>
);

// ── Collaborate Modal ─────────────────────────────────────────
export const CollaborateModal = ({
  isOpen, onClose, onSave, saving = false, draft, setDraft,
}: {
  isOpen:   boolean;
  onClose:  () => void;
  onSave:   () => void;
  saving?:  boolean;
  draft:    Collaboration;
  // ✅ Matches React's Dispatch<SetStateAction<Collaboration | null>>
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
      <div className="col-span-2">
        <FormTextarea
          label="My Pitch" value={draft.pitch} rows={3}
          placeholder="What do you want to build? Who are you looking for?"
          onChange={v => setDraft(d => d ? { ...d, pitch: v } : d)}
        />
      </div>
      <FormInput
        label="Project Types (comma separated)"
        value={draft.projectTypes.join(', ')}
        placeholder="SaaS, Open Source, Mobile"
        onChange={v => setDraft(d => d
          ? { ...d, projectTypes: v.split(',').map(s => s.trim()).filter(Boolean) }
          : d
        )}
      />
      <FormInput
        label="Looking For (comma separated)"
        value={draft.lookingFor.join(', ')}
        placeholder="Co-founder, Designer, Backend Dev"
        onChange={v => setDraft(d => d
          ? { ...d, lookingFor: v.split(',').map(s => s.trim()).filter(Boolean) }
          : d
        )}
      />
      <FormSelect
        label="Availability" value={draft.availability}
        onChange={v => setDraft(d => d ? { ...d, availability: v } : d)}
        options={[
          { label: 'Full-time', value: 'Full-time' },
          { label: 'Part-time', value: 'Part-time' },
          { label: 'Weekends',  value: 'Weekends'  },
          { label: 'Flexible',  value: 'Flexible'  },
        ]}
      />
      <FormSelect
        label="Work Style" value={draft.workStyle}
        onChange={v => setDraft(d => d ? { ...d, workStyle: v } : d)}
        options={[
          { label: 'Remote',    value: 'Remote'    },
          { label: 'Hybrid',    value: 'Hybrid'    },
          { label: 'In-person', value: 'In-person' },
        ]}
      />
      <FormInput
        label="Time Zone" value={draft.timezone}
        placeholder="e.g. IST (UTC+5:30)"
        onChange={v => setDraft(d => d ? { ...d, timezone: v } : d)}
      />
    </div>
  </EditModal>
);

// ── Coming Soon Modal ─────────────────────────────────────────
export const ComingSoonModal = ({
  editModal, onClose,
}: {
  editModal: TabKey | null;
  onClose:   () => void;
}) => {
  const keys: TabKey[] = ['skills', 'projects', 'experience', 'education', 'achievements'];

  return (
    <>
      {keys.map(key => (
        <EditModal
          key={key}
          title={`Add ${key.charAt(0).toUpperCase() + key.slice(1)}`}
          isOpen={editModal === key}
          onClose={onClose}
          onSave={onClose}
        >
          <p className="text-sm text-secondary py-6 text-center">
            Full {key} form — connect your API and build the form here.
          </p>
        </EditModal>
      ))}
    </>
  );
};