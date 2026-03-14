// src/pages/Profile.tsx
import { useState } from 'react';
import EditModal from '../../components/EditModal';

// ── Types ─────────────────────────────────────────────────────
interface BasicDetails {
  firstName:     string;
  lastName:      string;
  mobile:        string;
  gender:        string;
  maritalStatus: string;
  dateOfBirth:   string;
  aboutMe:       string;
  email:         string;
}

interface PersonalDetails {
  height:         string;
  bodyType:       string;
  weight:         string;
  disability:     string;
  complexion:     string;
  qualification:  string;
  bloodGroup:     string;
  swastayani:     string;
  dikshya:        string;
  swastayaniDate: string;
  dikshyaDate:    string;
}

// ── Reusable: Field wrapper ───────────────────────────────────
const DetailField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-semibold tracking-wider uppercase text-muted">
      {label}
    </span>
    <span className="text-sm font-medium text-text">{value}</span>
  </div>
);

// ── Reusable: Form input ──────────────────────────────────────
const FormInput = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
}: {
  label:       string;
  type?:       string;
  value:       string;
  onChange:    (v: string) => void;
  placeholder?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-text">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="auth-input w-full px-3.5 py-2.5 rounded-lg text-sm
        bg-raised border border-border text-text
        placeholder:text-muted transition-all duration-150"
    />
  </div>
);

// ── Reusable: Form select ─────────────────────────────────────
const FormSelect = ({
  label,
  value,
  onChange,
  options,
}: {
  label:   string;
  value:   string;
  onChange:(v: string) => void;
  options: { label: string; value: string }[];
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-text">{label}</label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="auth-input w-full px-3.5 py-2.5 rounded-lg text-sm
        bg-raised border border-border text-text
        transition-all duration-150 cursor-pointer"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

// ── Reusable: Form textarea ───────────────────────────────────
const FormTextarea = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label:        string;
  value:        string;
  onChange:     (v: string) => void;
  placeholder?: string;
  rows?:        number;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-text">{label}</label>
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="auth-input w-full px-3.5 py-2.5 rounded-lg text-sm
        bg-raised border border-border text-text
        placeholder:text-muted transition-all duration-150 resize-none"
    />
  </div>
);

// ── Reusable: Section Card ────────────────────────────────────
const SectionCard = ({
  title,
  onEdit,
  children,
}: {
  title:    string;
  onEdit:   () => void;
  children: React.ReactNode;
}) => (
  <div className="bg-surface border border-border rounded-2xl p-6 shadow-card">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-sm font-bold tracking-tight text-text uppercase">
        {title}
      </h2>
      <button
        onClick={onEdit}
        className="flex items-center gap-1.5 text-xs font-semibold
          text-accent bg-accent-tint hover:bg-accent hover:text-white
          px-3 py-1.5 rounded-lg transition-all duration-150"
      >
        <svg width="11" height="11" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
          />
        </svg>
        Edit
      </button>
    </div>
    {children}
  </div>
);

// ── Reusable: Info Row ────────────────────────────────────────
const InfoRow = ({
  icon, label, value,
}: {
  icon:  React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg bg-accent-tint text-accent
      flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-xs text-muted font-medium">{label}</p>
      <p className="text-sm text-text font-semibold">{value}</p>
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────
const Profile = () => {
  const [activeTab, setActiveTab] = useState<'basic' | 'personal' | 'family'>('basic');

  // Which modal is open: null | 'basic' | 'personal' | 'family'
  const [editModal, setEditModal] = useState<'basic' | 'personal' | 'family' | null>(null);

  // ── Basic state ──
  const [basic, setBasic] = useState<BasicDetails>({
    firstName:     'Binay',
    lastName:      'Das',
    mobile:        '9967564321',
    gender:        'MALE',
    maritalStatus: 'NEVER_MARRIED',
    dateOfBirth:   '2004-06-05',
    aboutMe:       'Software engineer with a passion for technology and travel. Looking for a life partner who shares similar values and interests.',
    email:         'binay@email.com',
  });
  const [basicDraft, setBasicDraft] = useState<BasicDetails>(basic);

  // ── Personal state ──
  const [personal, setPersonal] = useState<PersonalDetails>({
    height:         '5ft 10inch',
    bodyType:       'Athletic',
    weight:         '70 Kg',
    disability:     'No',
    complexion:     'Fair',
    qualification:  "Bachelor's Degree",
    bloodGroup:     'O+',
    swastayani:     'Yes',
    dikshya:        'Yes',
    swastayaniDate: '2016-07-20',
    dikshyaDate:    '2011-02-14',
  });
  const [personalDraft, setPersonalDraft] = useState<PersonalDetails>(personal);

  // ── Open modal handlers ──
  const openModal = (tab: 'basic' | 'personal' | 'family') => {
    if (tab === 'basic')    setBasicDraft({ ...basic });
    if (tab === 'personal') setPersonalDraft({ ...personal });
    setEditModal(tab);
  };

  const closeModal = () => setEditModal(null);

  // ── Save handlers ──
  const saveBasic    = () => { setBasic(basicDraft);       closeModal(); };
  const savePersonal = () => { setPersonal(personalDraft); closeModal(); };

  const tabs = [
    { key: 'basic',    label: 'Basic Details'    },
    { key: 'personal', label: 'Personal Details' },
    { key: 'family',   label: 'Family Details'   },
  ] as const;

  // ── Helpers ──
  const formatDate = (d: string) => {
    if (!d) return '—';
    const date = new Date(d);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const formatLabel = (val: string) =>
    val.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="min-h-screen bg-bg transition-colors duration-250">

      {/* Top accent stripe */}
      <div className="h-0.5 w-full bg-accent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text">My Profile</h1>
            <p className="text-sm text-secondary mt-1">Manage your personal information</p>
          </div>
          <div className="hidden sm:flex items-center gap-2
            bg-surface border border-border rounded-xl px-4 py-2 shadow-card">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-xs font-semibold text-text">78% complete</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left Column ── */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-card">

              {/* Avatar */}
              <div className="relative w-fit mx-auto mb-5">
                <div className="w-24 h-24 rounded-full overflow-hidden
                  border-2 border-accent ring-4 ring-accent-tint">
                  <div className="w-full h-full bg-raised flex items-center justify-center">
                    <svg width="40" height="40" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" strokeWidth={1.2} className="text-muted">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </div>
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full
                  bg-accent hover:bg-accent-hover text-white border-2 border-surface
                  flex items-center justify-center transition-all duration-150 shadow-accent">
                  <svg width="11" height="11" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                  </svg>
                </button>
              </div>

              {/* Name + badge */}
              <div className="text-center mb-4">
                <h2 className="text-lg font-bold tracking-tight text-text">
                  {basic.firstName} {basic.lastName}
                </h2>
                <span className="inline-block mt-1.5 text-xs font-bold uppercase
                  tracking-wider bg-accent-tint text-accent px-3 py-1 rounded-full">
                  {formatLabel(basic.maritalStatus)}
                </span>
              </div>

              <div className="h-px bg-border mb-4" />

              {/* Quick info */}
              <div className="flex flex-col gap-3">
                <InfoRow
                  label="Date of Birth"
                  value={formatDate(basic.dateOfBirth)}
                  icon={
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                      />
                    </svg>
                  }
                />
                <InfoRow
                  label="Email Address"
                  value={basic.email}
                  icon={
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                  }
                />
                <InfoRow
                  label="Mobile"
                  value={basic.mobile}
                  icon={
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                      />
                    </svg>
                  }
                />
              </div>

              <div className="h-px bg-border my-4" />

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
                  About Me
                </p>
                <p className="text-sm text-secondary leading-relaxed">{basic.aboutMe}</p>
              </div>
            </div>

            {/* Completion card */}
            <div className="bg-surface border border-border rounded-2xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-wider text-text">
                  Completion
                </p>
                <span className="text-xs font-bold text-accent">78%</span>
              </div>
              <div className="w-full h-1.5 bg-raised rounded-full overflow-hidden mb-3">
                <div className="h-full bg-accent rounded-full" style={{ width: '78%' }} />
              </div>
              <p className="text-xs text-muted">Add family details to reach 100%</p>
            </div>
          </div>

          {/* ── Right Column ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Tabs */}
            <div className="flex gap-1 bg-raised border border-border rounded-xl p-1 w-fit">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold
                    transition-all duration-150
                    ${activeTab === tab.key
                      ? 'bg-surface text-accent border border-border shadow-card'
                      : 'text-secondary hover:text-text'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Basic Details Tab */}
            {activeTab === 'basic' && (
              <SectionCard title="Basic Details" onEdit={() => openModal('basic')}>
                <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                  <DetailField label="First Name"     value={basic.firstName}                  />
                  <DetailField label="Last Name"      value={basic.lastName}                   />
                  <DetailField label="Mobile"         value={basic.mobile}                     />
                  <DetailField label="Gender"         value={formatLabel(basic.gender)}        />
                  <DetailField label="Marital Status" value={formatLabel(basic.maritalStatus)} />
                  <DetailField label="Date of Birth"  value={formatDate(basic.dateOfBirth)}    />
                </div>
                <div className="mt-5 pt-5 border-t border-border">
                  <DetailField label="About Me" value={basic.aboutMe} />
                </div>
              </SectionCard>
            )}

            {/* Personal Details Tab */}
            {activeTab === 'personal' && (
              <SectionCard title="Personal Details" onEdit={() => openModal('personal')}>
                <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                  <DetailField label="Height"          value={personal.height}                        />
                  <DetailField label="Body Type"       value={personal.bodyType}                      />
                  <DetailField label="Weight"          value={personal.weight}                        />
                  <DetailField label="Disability"      value={personal.disability}                    />
                  <DetailField label="Complexion"      value={personal.complexion}                    />
                  <DetailField label="Qualification"   value={personal.qualification}                 />
                  <DetailField label="Blood Group"     value={personal.bloodGroup}                    />
                  <DetailField label="Swastayani"      value={personal.swastayani}                    />
                  <DetailField label="Dikshya"         value={personal.dikshya}                       />
                  <DetailField label="Swastayani Date" value={formatDate(personal.swastayaniDate)}    />
                  <DetailField label="Dikshya Date"    value={formatDate(personal.dikshyaDate)}       />
                </div>
              </SectionCard>
            )}

            {/* Family Details Tab */}
            {activeTab === 'family' && (
              <div className="bg-surface border border-border rounded-2xl
                p-12 shadow-card flex flex-col items-center justify-center
                text-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent-tint
                  flex items-center justify-center">
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" strokeWidth={1.8} className="text-accent">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text mb-1">No family details yet</h3>
                  <p className="text-sm text-secondary">
                    Add your family information to complete your profile
                  </p>
                </div>
                <button
                  onClick={() => openModal('family')}
                  className="mt-1 px-5 py-2.5 rounded-lg text-sm font-semibold
                    bg-accent hover:bg-accent-hover text-white
                    shadow-accent transition-all duration-150">
                  + Add Family Details
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          MODALS — one per tab, all using EditModal
      ════════════════════════════════════════════ */}

      {/* Basic Details Modal */}
      <EditModal
        title="Edit your basic details information."
        isOpen={editModal === 'basic'}
        onClose={closeModal}
        onSave={saveBasic}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="First Name"
            value={basicDraft.firstName}
            onChange={v => setBasicDraft(d => ({ ...d, firstName: v }))}
            placeholder="First name"
          />
          <FormInput
            label="Last Name"
            value={basicDraft.lastName}
            onChange={v => setBasicDraft(d => ({ ...d, lastName: v }))}
            placeholder="Last name"
          />
          <FormInput
            label="Phone Number"
            type="tel"
            value={basicDraft.mobile}
            onChange={v => setBasicDraft(d => ({ ...d, mobile: v }))}
            placeholder="Phone number"
          />
          <FormSelect
            label="Marital Status"
            value={basicDraft.maritalStatus}
            onChange={v => setBasicDraft(d => ({ ...d, maritalStatus: v }))}
            options={[
              { label: 'Never Married',  value: 'NEVER_MARRIED'  },
              { label: 'Married',        value: 'MARRIED'        },
              { label: 'Divorced',       value: 'DIVORCED'       },
              { label: 'Widowed',        value: 'WIDOWED'        },
            ]}
          />
          <FormInput
            label="Date of Birth"
            type="date"
            value={basicDraft.dateOfBirth}
            onChange={v => setBasicDraft(d => ({ ...d, dateOfBirth: v }))}
          />
          <FormSelect
            label="Gender"
            value={basicDraft.gender}
            onChange={v => setBasicDraft(d => ({ ...d, gender: v }))}
            options={[
              { label: 'Male',   value: 'MALE'   },
              { label: 'Female', value: 'FEMALE' },
              { label: 'Other',  value: 'OTHER'  },
            ]}
          />
          <div className="col-span-2">
            <FormInput
              label="Email Address"
              type="email"
              value={basicDraft.email}
              onChange={v => setBasicDraft(d => ({ ...d, email: v }))}
              placeholder="email@example.com"
            />
          </div>
          <div className="col-span-2">
            <FormTextarea
              label="About Me"
              value={basicDraft.aboutMe}
              onChange={v => setBasicDraft(d => ({ ...d, aboutMe: v }))}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>
        </div>
      </EditModal>

      {/* Personal Details Modal */}
      <EditModal
        title="Edit your personal details information."
        isOpen={editModal === 'personal'}
        onClose={closeModal}
        onSave={savePersonal}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Height"
            value={personalDraft.height}
            onChange={v => setPersonalDraft(d => ({ ...d, height: v }))}
            placeholder="e.g. 5ft 10inch"
          />
          <FormSelect
            label="Body Type"
            value={personalDraft.bodyType}
            onChange={v => setPersonalDraft(d => ({ ...d, bodyType: v }))}
            options={[
              { label: 'Athletic', value: 'Athletic' },
              { label: 'Slim',     value: 'Slim'     },
              { label: 'Average',  value: 'Average'  },
              { label: 'Heavy',    value: 'Heavy'    },
            ]}
          />
          <FormInput
            label="Weight"
            value={personalDraft.weight}
            onChange={v => setPersonalDraft(d => ({ ...d, weight: v }))}
            placeholder="e.g. 70 Kg"
          />
          <FormSelect
            label="Disability"
            value={personalDraft.disability}
            onChange={v => setPersonalDraft(d => ({ ...d, disability: v }))}
            options={[
              { label: 'No',  value: 'No'  },
              { label: 'Yes', value: 'Yes' },
            ]}
          />
          <FormSelect
            label="Complexion"
            value={personalDraft.complexion}
            onChange={v => setPersonalDraft(d => ({ ...d, complexion: v }))}
            options={[
              { label: 'Fair',      value: 'Fair'      },
              { label: 'Wheatish',  value: 'Wheatish'  },
              { label: 'Dark',      value: 'Dark'      },
            ]}
          />
          <FormInput
            label="Qualification"
            value={personalDraft.qualification}
            onChange={v => setPersonalDraft(d => ({ ...d, qualification: v }))}
            placeholder="e.g. Bachelor's Degree"
          />
          <FormSelect
            label="Blood Group"
            value={personalDraft.bloodGroup}
            onChange={v => setPersonalDraft(d => ({ ...d, bloodGroup: v }))}
            options={[
              { label: 'A+',  value: 'A+'  },
              { label: 'A-',  value: 'A-'  },
              { label: 'B+',  value: 'B+'  },
              { label: 'B-',  value: 'B-'  },
              { label: 'O+',  value: 'O+'  },
              { label: 'O-',  value: 'O-'  },
              { label: 'AB+', value: 'AB+' },
              { label: 'AB-', value: 'AB-' },
            ]}
          />
          <FormSelect
            label="Swastayani"
            value={personalDraft.swastayani}
            onChange={v => setPersonalDraft(d => ({ ...d, swastayani: v }))}
            options={[
              { label: 'Yes', value: 'Yes' },
              { label: 'No',  value: 'No'  },
            ]}
          />
          <FormInput
            label="Swastayani Date"
            type="date"
            value={personalDraft.swastayaniDate}
            onChange={v => setPersonalDraft(d => ({ ...d, swastayaniDate: v }))}
          />
          <FormSelect
            label="Dikshya"
            value={personalDraft.dikshya}
            onChange={v => setPersonalDraft(d => ({ ...d, dikshya: v }))}
            options={[
              { label: 'Yes', value: 'Yes' },
              { label: 'No',  value: 'No'  },
            ]}
          />
          <FormInput
            label="Dikshya Date"
            type="date"
            value={personalDraft.dikshyaDate}
            onChange={v => setPersonalDraft(d => ({ ...d, dikshyaDate: v }))}
          />
        </div>
      </EditModal>

      {/* Family Details Modal */}
      <EditModal
        title="Add your family details information."
        isOpen={editModal === 'family'}
        onClose={closeModal}
        onSave={closeModal}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Father's Name"       value="" onChange={() => {}} placeholder="Father's full name"   />
          <FormInput label="Mother's Name"       value="" onChange={() => {}} placeholder="Mother's full name"   />
          <FormInput label="Father's Occupation" value="" onChange={() => {}} placeholder="e.g. Business"        />
          <FormInput label="Mother's Occupation" value="" onChange={() => {}} placeholder="e.g. Homemaker"       />
          <FormInput label="No. of Brothers"     value="" onChange={() => {}} placeholder="e.g. 1"               />
          <FormInput label="No. of Sisters"      value="" onChange={() => {}} placeholder="e.g. 2"               />
          <div className="col-span-2">
            <FormInput label="Family Location"   value="" onChange={() => {}} placeholder="City, State"          />
          </div>
        </div>
      </EditModal>

    </div>
  );
};

export default Profile;