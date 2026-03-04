export default function LegalLayout({ children }) {
  return (
    <main className="bg-bg-page">
      <div className="max-w-4xl mx-auto px-6 py-24">
        {children}
      </div>
    </main>
  );
}
