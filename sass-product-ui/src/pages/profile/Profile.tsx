import { useState } from 'react';
import EditModal from '../../components/EditModal';
import type { Achievement, BasicDetails, Collaboration, Education, Experience, Project, Skill } from '../../shared/model/profile';


// ── Tab type ──────────────────────────────────────────────────
type TabKey =
  | 'basic'
  | 'skills'
  | 'projects'
  | 'collaborate'
  | 'experience'
  | 'education'
  | 'achievements';

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
  label, type = 'text', value, onChange, placeholder,
}: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-text">{label}</label>
    <input
      type={type} value={value}
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
  label, value, onChange, options,
}: {
  label: string; value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-text">{label}</label>
    <select
      value={value} onChange={e => onChange(e.target.value)}
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
  label, value, onChange, placeholder, rows = 3,
}: {
  label: string; value: string;
  onChange: (v: string) => void;
  placeholder?: string; rows?: number;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-text">{label}</label>
    <textarea
      value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} rows={rows}
      className="auth-input w-full px-3.5 py-2.5 rounded-lg text-sm
        bg-raised border border-border text-text
        placeholder:text-muted transition-all duration-150 resize-none"
    />
  </div>
);

// ── Reusable: Section Card ────────────────────────────────────
const SectionCard = ({
  title, onEdit, children,
}: {
  title: string; onEdit: () => void; children: React.ReactNode;
}) => (
  <div className="bg-surface border border-border rounded-2xl p-6 shadow-card">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-sm font-bold tracking-tight text-text uppercase">{title}</h2>
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
const InfoRow = ({ icon, label, value }: {
  icon: React.ReactNode; label: string; value: string;
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

// ── Reusable: Skill chip ──────────────────────────────────────
const SkillChip = ({ name, level }: { name: string; level: string }) => {
  const levelColor: Record<string, string> = {
    Expert:       'bg-accent-tint text-accent border-accent-tint',
    Intermediate: 'bg-raised text-secondary border-border',
    Beginner:     'bg-raised text-muted border-border',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold
      px-2.5 py-1 rounded-lg border ${levelColor[level] ?? levelColor.Beginner}`}>
      {name}
      <span className="text-[10px] font-normal opacity-70">{level[0]}</span>
    </span>
  );
};

// ── Reusable: Simple tag ──────────────────────────────────────
const Tag = ({ label }: { label: string }) => (
  <span className="text-xs font-medium px-2.5 py-1 rounded-lg
    bg-raised border border-border text-secondary">
    {label}
  </span>
);

// ── Reusable: Status badge ────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    Live:          'bg-success/10 text-success border-success/20',
    'In Progress': 'bg-warning/10 text-warning border-warning/20',
    Archived:      'bg-raised text-muted border-border',
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider
      px-2 py-0.5 rounded border ${map[status] ?? map.Archived}`}>
      {status}
    </span>
  );
};

// ── Reusable: Empty state ─────────────────────────────────────
const EmptyState = ({
  icon, title, description, actionLabel, onAction,
}: {
  icon: string; title: string; description: string;
  actionLabel: string; onAction: () => void;
}) => (
  <div className="bg-surface border border-border rounded-2xl p-12 shadow-card
    flex flex-col items-center justify-center text-center gap-4">
    <div className="w-12 h-12 rounded-xl bg-accent-tint flex items-center
      justify-center text-2xl">
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-bold text-text mb-1">{title}</h3>
      <p className="text-sm text-secondary">{description}</p>
    </div>
    <button
      onClick={onAction}
      className="mt-1 px-5 py-2.5 rounded-lg text-sm font-semibold
        bg-accent hover:bg-accent-hover text-white
        shadow-accent transition-all duration-150">
      {actionLabel}
    </button>
  </div>
);

// ── Reusable: Section header with add button ──────────────────
const ListHeader = ({ title, onAdd }: { title: string; onAdd: () => void }) => (
  <div className="flex items-center justify-between">
    <h2 className="text-sm font-bold uppercase tracking-tight text-text">{title}</h2>
    <button
      onClick={onAdd}
      className="text-xs font-semibold text-accent bg-accent-tint
        hover:bg-accent hover:text-white px-3 py-1.5 rounded-lg
        transition-all duration-150">
      + Add
    </button>
  </div>
);

// ── Main Component ────────────────────────────────────────────
const Profile = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('basic');
  const [editModal, setEditModal] = useState<TabKey | null>(null);

  // ── Basic state (unchanged) ───────────────────────────────
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

  // ── Skills state ──────────────────────────────────────────
  const [skills] = useState<Skill[]>([
    { id: '1', name: 'TypeScript', level: 'Expert',       category: 'Language' },
    { id: '2', name: 'React',      level: 'Expert',       category: 'Frontend' },
    { id: '3', name: 'Node.js',    level: 'Intermediate', category: 'Backend'  },
    { id: '4', name: 'PostgreSQL', level: 'Intermediate', category: 'Database' },
    { id: '5', name: 'Docker',     level: 'Beginner',     category: 'DevOps'   },
    { id: '6', name: 'Python',     level: 'Intermediate', category: 'Language' },
  ]);

  // ── Projects state ────────────────────────────────────────
  const [projects] = useState<Project[]>([
    {
      id:          '1',
      name:        'DevConnect',
      description: 'A platform for developers to find collaborators and build projects together.',
      techStack:   ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      role:        'Lead',
      status:      'In Progress',
      githubUrl:   'github.com/binaydas/devconnect',
      liveUrl:     '',
      lookingFor:  ['Backend Dev', 'Designer'],
    },
  ]);

  // ── Experience state ──────────────────────────────────────
  const [experiences] = useState<Experience[]>([
    {
      id:          '1',
      company:     'TechCorp',
      role:        'Frontend Developer',
      type:        'Full-time',
      startDate:   'Jan 2023',
      endDate:     '',
      description: 'Built scalable React applications and led the migration to TypeScript.',
    },
  ]);

  // ── Education state ───────────────────────────────────────
  const [educations] = useState<Education[]>([
    {
      id:          '1',
      institution: 'KIIT University',
      degree:      'B.Tech Computer Science',
      startYear:   '2020',
      endYear:     '2024',
      type:        'Degree',
      link:        '',
    },
  ]);

  // ── Collaboration state ───────────────────────────────────
  const [collaboration, setCollaboration] = useState<Collaboration>({
    projectTypes: ['SaaS', 'Open Source'],
    lookingFor:   ['Co-founder', 'Designer', 'Backend Dev'],
    availability: 'Part-time',
    workStyle:    'Remote',
    timezone:     'IST (UTC+5:30)',
    pitch:        'I want to build developer tools that make collaboration easier. Looking for a designer or backend developer to partner with.',
  });
  const [collaborationDraft, setCollaborationDraft] = useState<Collaboration>(collaboration);

  // ── Achievements state ────────────────────────────────────
  const [achievements] = useState<Achievement[]>([
    {
      id:          '1',
      title:       'HackIndia 2023 — 2nd Place',
      type:        'Hackathon',
      description: 'Built an AI-powered code review tool in 24 hours.',
      date:        '2023-08-15',
      link:        '',
    },
  ]);

  // ── Modal handlers ────────────────────────────────────────
  const openModal = (tab: TabKey) => {
    if (tab === 'basic')       setBasicDraft({ ...basic });
    if (tab === 'collaborate') setCollaborationDraft({ ...collaboration });
    setEditModal(tab);
  };

  const closeModal = () => setEditModal(null);

  const saveBasic       = () => { setBasic(basicDraft);             closeModal(); };
  const saveCollaborate = () => { setCollaboration(collaborationDraft); closeModal(); };

  // ── Tabs ──────────────────────────────────────────────────
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'basic',        label: 'Basic'        },
    { key: 'skills',       label: 'Skills'       },
    { key: 'projects',     label: 'Projects'     },
    { key: 'collaborate',  label: 'Collaborate'  },
    { key: 'experience',   label: 'Experience'   },
    { key: 'education',    label: 'Education'    },
    { key: 'achievements', label: 'Achievements' },
  ];

  // ── Helpers ───────────────────────────────────────────────
  const formatDate = (d: string) => {
    if (!d) return '—';
    const date = new Date(d);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const formatLabel = (val: string) =>
    val.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const skillsByCategory = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

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

          {/* ── Left Column (unchanged) ── */}
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
                  label="Date of Birth" value={formatDate(basic.dateOfBirth)}
                  icon={<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>}
                />
                <InfoRow
                  label="Email Address" value={basic.email}
                  icon={<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>}
                />
                <InfoRow
                  label="Mobile" value={basic.mobile}
                  icon={<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>}
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
                <p className="text-xs font-bold uppercase tracking-wider text-text">Completion</p>
                <span className="text-xs font-bold text-accent">78%</span>
              </div>
              <div className="w-full h-1.5 bg-raised rounded-full overflow-hidden mb-3">
                <div className="h-full bg-accent rounded-full" style={{ width: '78%' }} />
              </div>
              <p className="text-xs text-muted">Add more details to reach 100%</p>
            </div>
          </div>

          {/* ── Right Column ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Tabs — scrollable on mobile */}
            <div className="overflow-x-auto pb-1">
              <div className="flex gap-1 bg-raised border border-border rounded-xl p-1 w-fit">
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap
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
            </div>

            {/* ── Basic Details Tab (unchanged) ── */}
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

            {/* ── Skills Tab ── */}
            {activeTab === 'skills' && (
              <SectionCard title="Skills & Technologies" onEdit={() => openModal('skills')}>
                <div className="flex flex-col gap-5">
                  {Object.entries(skillsByCategory).map(([category, catSkills]) => (
                    <div key={category}>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
                        {category}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {catSkills.map(s => (
                          <SkillChip key={s.id} name={s.name} level={s.level} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border flex items-center gap-4">
                  <span className="text-xs text-muted">Legend:</span>
                  <span className="text-xs text-secondary">
                    <span className="font-bold text-accent">E</span> = Expert
                  </span>
                  <span className="text-xs text-secondary">
                    <span className="font-bold">I</span> = Intermediate
                  </span>
                  <span className="text-xs text-secondary">
                    <span className="font-bold">B</span> = Beginner
                  </span>
                </div>
              </SectionCard>
            )}

            {/* ── Projects Tab ── */}
            {activeTab === 'projects' && (
              projects.length === 0
                ? <EmptyState
                    icon="🚀"
                    title="No projects yet"
                    description="Add projects you've built to showcase your work"
                    actionLabel="+ Add Project"
                    onAction={() => openModal('projects')}
                  />
                : <div className="flex flex-col gap-4">
                    <ListHeader title="Projects" onAdd={() => openModal('projects')} />
                    {projects.map(p => (
                      <div key={p.id}
                        className="bg-surface border border-border rounded-2xl p-5 shadow-card">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h3 className="text-sm font-bold text-text">{p.name}</h3>
                            <p className="text-xs text-secondary mt-0.5">{p.description}</p>
                          </div>
                          <StatusBadge status={p.status} />
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {p.techStack.map(t => <Tag key={t} label={t} />)}
                        </div>
                        <div className="flex items-center gap-4 pt-3 border-t border-border">
                          <span className="text-xs text-muted">
                            Role: <span className="text-text font-semibold">{p.role}</span>
                          </span>
                          {p.lookingFor.length > 0 && (
                            <span className="text-xs text-muted">
                              Looking for:{' '}
                              <span className="text-accent font-semibold">
                                {p.lookingFor.join(', ')}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
            )}

            {/* ── Collaborate Tab ── */}
            {activeTab === 'collaborate' && (
              <SectionCard title="Looking to Collaborate" onEdit={() => openModal('collaborate')}>
                <div className="flex flex-col gap-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
                      My Pitch
                    </p>
                    <p className="text-sm text-secondary leading-relaxed">
                      {collaboration.pitch}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                        Project Types
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {collaboration.projectTypes.map(t => <Tag key={t} label={t} />)}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                        Looking For
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {collaboration.lookingFor.map(t => (
                          <span key={t} className="text-xs font-semibold px-2.5 py-1
                            rounded-lg bg-accent-tint text-accent border border-accent-tint">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <DetailField label="Availability" value={collaboration.availability} />
                    <DetailField label="Work Style"   value={collaboration.workStyle}    />
                    <DetailField label="Time Zone"    value={collaboration.timezone}     />
                  </div>
                </div>
              </SectionCard>
            )}

            {/* ── Experience Tab ── */}
            {activeTab === 'experience' && (
              experiences.length === 0
                ? <EmptyState
                    icon="💼"
                    title="No experience added"
                    description="Add your work history, internships or freelance projects"
                    actionLabel="+ Add Experience"
                    onAction={() => openModal('experience')}
                  />
                : <div className="flex flex-col gap-4">
                    <ListHeader title="Experience" onAdd={() => openModal('experience')} />
                    {experiences.map(exp => (
                      <div key={exp.id}
                        className="bg-surface border border-border rounded-2xl p-5 shadow-card">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h3 className="text-sm font-bold text-text">{exp.role}</h3>
                            <p className="text-xs text-accent font-semibold mt-0.5">{exp.company}</p>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider
                            px-2 py-0.5 rounded border bg-raised border-border text-muted">
                            {exp.type}
                          </span>
                        </div>
                        <p className="text-xs text-muted mb-2">
                          {exp.startDate} — {exp.endDate || 'Present'}
                        </p>
                        <p className="text-sm text-secondary leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
            )}

            {/* ── Education Tab ── */}
            {activeTab === 'education' && (
              educations.length === 0
                ? <EmptyState
                    icon="🎓"
                    title="No education added"
                    description="Add your degrees, bootcamps or certifications"
                    actionLabel="+ Add Education"
                    onAction={() => openModal('education')}
                  />
                : <div className="flex flex-col gap-4">
                    <ListHeader title="Education" onAdd={() => openModal('education')} />
                    {educations.map(edu => (
                      <div key={edu.id}
                        className="bg-surface border border-border rounded-2xl p-5 shadow-card">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h3 className="text-sm font-bold text-text">{edu.degree}</h3>
                            <p className="text-xs text-accent font-semibold mt-0.5">
                              {edu.institution}
                            </p>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider
                            px-2 py-0.5 rounded border bg-raised border-border text-muted">
                            {edu.type}
                          </span>
                        </div>
                        <p className="text-xs text-muted">
                          {edu.startYear} — {edu.endYear}
                        </p>
                      </div>
                    ))}
                  </div>
            )}

            {/* ── Achievements Tab ── */}
            {activeTab === 'achievements' && (
              achievements.length === 0
                ? <EmptyState
                    icon="🏆"
                    title="No achievements yet"
                    description="Add hackathons, open source contributions, articles or awards"
                    actionLabel="+ Add Achievement"
                    onAction={() => openModal('achievements')}
                  />
                : <div className="flex flex-col gap-4">
                    <ListHeader title="Achievements" onAdd={() => openModal('achievements')} />
                    {achievements.map(a => (
                      <div key={a.id}
                        className="bg-surface border border-border rounded-2xl p-5 shadow-card">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="text-sm font-bold text-text">{a.title}</h3>
                          <span className="text-[10px] font-bold uppercase tracking-wider
                            px-2 py-0.5 rounded border bg-accent-tint border-accent-tint text-accent">
                            {a.type}
                          </span>
                        </div>
                        <p className="text-xs text-muted mb-2">{formatDate(a.date)}</p>
                        <p className="text-sm text-secondary leading-relaxed">{a.description}</p>
                      </div>
                    ))}
                  </div>
            )}

          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          MODALS
      ════════════════════════════════════════════ */}

      {/* Basic Details Modal (unchanged) */}
      <EditModal
        title="Edit your basic details information."
        isOpen={editModal === 'basic'}
        onClose={closeModal}
        onSave={saveBasic}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="First Name" value={basicDraft.firstName}
            onChange={v => setBasicDraft(d => ({ ...d, firstName: v }))} placeholder="First name" />
          <FormInput label="Last Name" value={basicDraft.lastName}
            onChange={v => setBasicDraft(d => ({ ...d, lastName: v }))} placeholder="Last name" />
          <FormInput label="Phone Number" type="tel" value={basicDraft.mobile}
            onChange={v => setBasicDraft(d => ({ ...d, mobile: v }))} placeholder="Phone number" />
          <FormSelect label="Marital Status" value={basicDraft.maritalStatus}
            onChange={v => setBasicDraft(d => ({ ...d, maritalStatus: v }))}
            options={[
              { label: 'Never Married', value: 'NEVER_MARRIED' },
              { label: 'Married',       value: 'MARRIED'       },
              { label: 'Divorced',      value: 'DIVORCED'      },
              { label: 'Widowed',       value: 'WIDOWED'       },
            ]}
          />
          <FormInput label="Date of Birth" type="date" value={basicDraft.dateOfBirth}
            onChange={v => setBasicDraft(d => ({ ...d, dateOfBirth: v }))} />
          <FormSelect label="Gender" value={basicDraft.gender}
            onChange={v => setBasicDraft(d => ({ ...d, gender: v }))}
            options={[
              { label: 'Male',   value: 'MALE'   },
              { label: 'Female', value: 'FEMALE' },
              { label: 'Other',  value: 'OTHER'  },
            ]}
          />
          <div className="col-span-2">
            <FormInput label="Email Address" type="email" value={basicDraft.email}
              onChange={v => setBasicDraft(d => ({ ...d, email: v }))} placeholder="email@example.com" />
          </div>
          <div className="col-span-2">
            <FormTextarea label="About Me" value={basicDraft.aboutMe}
              onChange={v => setBasicDraft(d => ({ ...d, aboutMe: v }))}
              placeholder="Tell us about yourself..." rows={3} />
          </div>
        </div>
      </EditModal>

      {/* Collaborate Modal */}
      <EditModal
        title="Edit your collaboration preferences."
        isOpen={editModal === 'collaborate'}
        onClose={closeModal}
        onSave={saveCollaborate}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <FormTextarea label="My Pitch" value={collaborationDraft.pitch}
              onChange={v => setCollaborationDraft(d => ({ ...d, pitch: v }))}
              placeholder="What do you want to build? Who are you looking for?" rows={3} />
          </div>
          <FormInput
            label="Project Types (comma separated)"
            value={collaborationDraft.projectTypes.join(', ')}
            onChange={v => setCollaborationDraft(d => ({
              ...d, projectTypes: v.split(',').map(s => s.trim()).filter(Boolean),
            }))}
            placeholder="SaaS, Open Source, Mobile"
          />
          <FormInput
            label="Looking For (comma separated)"
            value={collaborationDraft.lookingFor.join(', ')}
            onChange={v => setCollaborationDraft(d => ({
              ...d, lookingFor: v.split(',').map(s => s.trim()).filter(Boolean),
            }))}
            placeholder="Co-founder, Designer, Backend Dev"
          />
          <FormSelect label="Availability" value={collaborationDraft.availability}
            onChange={v => setCollaborationDraft(d => ({ ...d, availability: v }))}
            options={[
              { label: 'Full-time', value: 'Full-time' },
              { label: 'Part-time', value: 'Part-time' },
              { label: 'Weekends',  value: 'Weekends'  },
              { label: 'Flexible',  value: 'Flexible'  },
            ]}
          />
          <FormSelect label="Work Style" value={collaborationDraft.workStyle}
            onChange={v => setCollaborationDraft(d => ({ ...d, workStyle: v }))}
            options={[
              { label: 'Remote',    value: 'Remote'    },
              { label: 'Hybrid',    value: 'Hybrid'    },
              { label: 'In-person', value: 'In-person' },
            ]}
          />
          <FormInput label="Time Zone" value={collaborationDraft.timezone}
            onChange={v => setCollaborationDraft(d => ({ ...d, timezone: v }))}
            placeholder="e.g. IST (UTC+5:30)" />
        </div>
      </EditModal>

      {/* Skills / Projects / Experience / Education / Achievements — coming soon */}
      {(['skills', 'projects', 'experience', 'education', 'achievements'] as const).map(key => (
        <EditModal
          key={key}
          title={`Add ${key.charAt(0).toUpperCase() + key.slice(1)}`}
          isOpen={editModal === key}
          onClose={closeModal}
          onSave={closeModal}
        >
          <p className="text-sm text-secondary py-6 text-center">
            Full {key} form — connect your API and build the form here.
          </p>
        </EditModal>
      ))}

    </div>
  );
};

export default Profile;