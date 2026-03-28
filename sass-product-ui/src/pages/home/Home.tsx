import { type JSX } from "react";
import { Link } from "react-router-dom";
import type { Feature, Stat, Step, Testimonial } from "../../shared/model/home";


// ─── Static Data ──────────────────────────────────────────────────────────────

const STATS: Stat[] = [
  { value: "12K+", label: "Developers"        },
  { value: "3.4K+",label: "Connections made"  },
  { value: "80+",  label: "Skills covered"    },
  { value: "98%",  label: "Match satisfaction"},
];

const FEATURES: Feature[] = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Smart matching",
    desc: "Get matched with developers who share your stack, goals, and working style — not just your job title.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: "Rich profiles",
    desc: "Showcase your skills, projects, experience and achievements all in one structured, beautiful profile.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: "Direct messaging",
    desc: "Skip the LinkedIn noise. Reach out to your matches directly and start a real conversation.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: "Verified skills",
    desc: "Your stack speaks for itself. Tag your skills and let your work do the talking.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
    title: "India-focused",
    desc: "Built for the Indian developer community — filter by city, company, or domain.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Instant connect",
    desc: "Send a connect request in one tap. Grow your network without the awkward cold emails.",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:    "Found my co-founder for my SaaS idea within a week. The skill-based matching is genuinely useful — not just vibes.",
    name:     "Aryan Mehta",
    role:     "Full Stack Developer",
    city:     "Mumbai",
    initials: "AM",
    color:    "#2563EB",
    rating:   5,
  },
  {
    quote:    "As a designer, I struggled to find developers who appreciate good UI. Here I found 3 collaborators in my first month.",
    name:     "Sneha Rao",
    role:     "UI/UX Designer",
    city:     "Bangalore",
    initials: "SR",
    color:    "#7C3AED",
    rating:   5,
  },
  {
    quote:    "I open-sourced a library and found 4 contributors through findcoffeemate. Better than posting on Twitter and hoping.",
    name:     "Dev Patel",
    role:     "Backend Engineer",
    city:     "Ahmedabad",
    initials: "DP",
    color:    "#059669",
    rating:   5,
  },
  {
    quote:    "Connected with a Flutter dev in Pune within days. We shipped a side project together in under 3 weeks.",
    name:     "Ritika Singh",
    role:     "Mobile Developer",
    city:     "Delhi",
    initials: "RS",
    color:    "#DC2626",
    rating:   5,
  },
  {
    quote:    "The profile sections are thoughtful — Skills, Projects, Experience all in one place. Recruiters have reached out too!",
    name:     "Preethi Nair",
    role:     "Data Scientist",
    city:     "Chennai",
    initials: "PN",
    color:    "#0891B2",
    rating:   5,
  },
  {
    quote:    "Finally a place that feels built for Indian developers. City filters and mutual connections make it feel like a small town.",
    name:     "Karan Joshi",
    role:     "DevOps Engineer",
    city:     "Pune",
    initials: "KJ",
    color:    "#D97706",
    rating:   5,
  },
];

const STEPS: Step[] = [
  { step: "01", title: "Create your profile",   desc: "Fill in your skills, projects, experience and what you're looking to collaborate on." },
  { step: "02", title: "Discover your mates",   desc: "Browse suggested developers filtered by role, stack, city, or mutual connections."    },
  { step: "03", title: "Connect & collaborate", desc: "Send a request, start a conversation, and build something great together."           },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const StarRating = ({ count }: { count: number }): JSX.Element => {
  return (
    <div className="flex gap-0.5 mb-3">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 text-warning fill-warning" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ─── Section: Hero ────────────────────────────────────────────────────────────

const HeroSection = (): JSX.Element => {
  return (
    <section className="relative overflow-hidden bg-bg pt-20 pb-24 px-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-accent-tint text-accent text-xs font-semibold mb-6 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          India's developer community — now with coffee ☕
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-text leading-tight tracking-tight mb-6">
          Find your next<br />
          <span className="text-accent">coffee</span>mate
        </h1>

        <p className="text-lg text-secondary max-w-xl mx-auto mb-10 leading-relaxed">
          Connect with developers who match your stack, vibe, and ambition.
          Build your network one genuine connection at a time.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            to="/find-connection"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm shadow-accent hover:bg-accent-hover transition-all duration-200 hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Find mates
          </Link>
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-surface text-text font-semibold text-sm hover:bg-raised transition-all duration-200 hover:-translate-y-0.5"
          >
            Build my profile
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="flex items-center justify-center gap-3 mt-10">
          <div className="flex -space-x-2">
            {["#2563EB", "#7C3AED", "#059669", "#DC2626", "#D97706"].map((color, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-bg"
                style={{ backgroundColor: color, zIndex: 5 - i }}
              />
            ))}
          </div>
          <p className="text-sm text-secondary">
            <span className="font-semibold text-text">12,000+</span> developers already connected
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Section: Stats ───────────────────────────────────────────────────────────

const StatsSection = (): JSX.Element => {
  return (
    <section className="bg-surface border-y border-border py-12 px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
        {STATS.map((s: Stat) => (
          <div key={s.label} className="text-center">
            <p className="text-3xl font-bold text-text">{s.value}</p>
            <p className="text-sm text-secondary mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Section: Features ────────────────────────────────────────────────────────

const FeaturesSection = (): JSX.Element => {
  return (
    <section className="bg-bg py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-3">Why findcoffeemate</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text">Everything you need to connect</h2>
          <p className="text-secondary mt-3 max-w-md mx-auto text-sm leading-relaxed">
            Purpose-built for developers who want meaningful professional relationships, not just follower counts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f: Feature) => (
            <div
              key={f.title}
              className="bg-surface border border-border rounded-xl p-5 hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="w-9 h-9 rounded-lg bg-accent-tint text-accent flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white transition-colors duration-200">
                {f.icon}
              </div>
              <h3 className="text-sm font-semibold text-text mb-1.5">{f.title}</h3>
              <p className="text-xs text-secondary leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Testimonials ────────────────────────────────────────────────────

const TestimonialsSection = (): JSX.Element => {
  return (
    <section className="bg-surface border-y border-border py-20 px-6">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-3">From the community</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text">What developers are saying</h2>
          <p className="text-secondary mt-3 max-w-md mx-auto text-sm leading-relaxed">
            Real stories from developers who found their next collaborator here.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t: Testimonial) => (
            <div
              key={t.name}
              className="bg-bg border border-border rounded-xl p-5 flex flex-col gap-4 hover:shadow-card hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Stars */}
              <StarRating count={t.rating} />

              {/* Quote */}
              <p className="text-sm text-secondary leading-relaxed italic flex-1">
                <span
                  className="text-[28px] leading-none align-[-10px] mr-0.5 not-italic font-serif text-accent"
                  aria-hidden="true"
                >
                  "
                </span>
                {t.quote}
              </p>

              {/* Author */}
              <div
                className="flex items-center gap-3 pt-4 border-t border-border"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    background: hexToRgba(t.color, 0.12),
                    border: `2px solid ${hexToRgba(t.color, 0.28)}`,
                    color: t.color,
                  }}
                >
                  {t.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text truncate">{t.name}</p>
                  <p className="text-xs text-muted truncate">{t.role} · {t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: How it works ────────────────────────────────────────────────────

const HowItWorksSection = (): JSX.Element => {
  return (
    <section className="bg-bg py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text">Three steps to your next connection</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
          <div className="hidden sm:block absolute top-6 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-border z-0" />
          {STEPS.map((s: Step) => (
            <div key={s.step} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-accent text-white font-bold text-sm flex items-center justify-center mb-4 shadow-accent">
                {s.step}
              </div>
              <h3 className="text-sm font-semibold text-text mb-2">{s.title}</h3>
              <p className="text-xs text-secondary leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: CTA ─────────────────────────────────────────────────────────────

const CTASection = (): JSX.Element => {
  return (
    <section className="bg-accent py-16 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to find your coffeemate?
        </h2>
        <p className="text-white/80 text-sm mb-8 leading-relaxed">
          Join thousands of Indian developers already building connections, projects, and friendships on findcoffeemate.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-accent font-semibold text-sm hover:bg-accent-tint transition-colors shadow-sm hover:-translate-y-0.5 duration-200"
          >
            Create your profile
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            to="/find-connection"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
          >
            Browse developers
          </Link>
        </div>
      </div>
    </section>
  );
}

const Home = () => {
    return (
        <div className="min-h-screen bg-bg font-sans">
            <HeroSection />
            <StatsSection />
            <FeaturesSection />
            <TestimonialsSection />
            <HowItWorksSection />
            <CTASection />
        </div>
    );
}

export default Home;