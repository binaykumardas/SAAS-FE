import { InfoRow } from './ProfileUI';
import type { BasicDetails } from '../../shared/model/profile';

interface ProfileSidebarProps {
  basic:       BasicDetails;
  formatDate:  (d: string) => string;
  formatLabel: (v: string) => string;
}

const ProfileSidebar = ({
  basic, formatDate, formatLabel,
}: ProfileSidebarProps) => (
  <div className="lg:col-span-1 flex flex-col gap-4">

    {/* ── Avatar + info card ── */}
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

      {/* About me */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
          About Me
        </p>
        <p className="text-sm text-secondary leading-relaxed">{basic.aboutMe}</p>
      </div>
    </div>

    {/* ── Completion card ── */}
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
);

export default ProfileSidebar;