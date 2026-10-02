import { SectionHeading } from '../components/ui';

export default function Admin() {
  return (
    <main className="pt-24 section-pad bg-[var(--paper)]">
      <div className="max-w-content mx-auto px-4 md:px-6">
        <SectionHeading eyebrow="Admin" title="Manage collection requests" subtitle="Phase 6 — Admin Collection Management." />
      </div>
    </main>
  );
}
