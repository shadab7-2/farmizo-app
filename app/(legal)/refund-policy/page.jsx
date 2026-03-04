export const metadata = {
  title: "Refund Policy | Farmizo",
};

export default function RefundPolicyPage() {
  return (
    <>
      <h1 className="text-4xl font-bold text-text-heading">
        Refund Policy
      </h1>

      <p className="mt-6">
        Learn about returns, replacements, and refunds at Farmizo.
      </p>

      <section className="mt-10 space-y-6">

        <h2 className="text-xl font-semibold">
          Eligibility
        </h2>
        <p>
          Items must be returned within 7 days in original condition.
        </p>

        <h2 className="text-xl font-semibold">
          Processing Time
        </h2>
        <p>
          Refunds are processed within 5–7 business days.
        </p>

      </section>
    </>
  );
}
