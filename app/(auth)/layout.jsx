import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-bg-section-soft flex flex-col">

      {/* NAVBAR */}
      <Navbar />

      {/* CENTER CONTENT */}
      <main className="flex-1 flex items-center justify-center px-6 py-6">
        <div className="w-full max-w-md bg-bg-page rounded-2xl shadow-lg border border-border-default p-8">
          {children}
        </div>
      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}
