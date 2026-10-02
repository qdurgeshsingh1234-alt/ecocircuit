import { SectionHeading } from '../components/ui';

export default function Dashboard() {
  return (
    <main className="pt-24 section-pad bg-[var(--paper)]">
      <div className="max-w-content mx-auto px-4 md:px-6">
        <SectionHeading eyebrow="Your impact" title="Personal dashboard" subtitle="Phase 5 — Personal Impact Tracker." />
      </div>
    </main>
  );
}
