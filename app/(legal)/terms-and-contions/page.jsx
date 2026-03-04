export const metadata = {
  title: "Terms & Conditions | Farmizo",
};

export default function TermsPage() {
  return (
    <>
      <h1 className="text-4xl font-bold text-text-heading">
        Terms & Conditions
      </h1>

      <p className="mt-6">
        By using Farmizo, you agree to the following terms and conditions.
      </p>

      <section className="mt-10 space-y-6">

        <h2 className="text-xl font-semibold">
          User Responsibilities
        </h2>
        <p>
          You agree to provide accurate information and follow lawful usage.
        </p>

        <h2 className="text-xl font-semibold">
          Orders & Payments
        </h2>
        <p>
          Orders are subject to availability and verification.
        </p>

      </section>
    </>
  );
}
