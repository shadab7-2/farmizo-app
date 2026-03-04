export const metadata = {
  title: "Privacy Policy | Farmizo",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <h1 className="text-4xl font-bold text-text-heading">
        Privacy Policy
      </h1>

      <p className="mt-6 text-text-body">
        At Farmizo, we value your privacy. This policy explains how we
        collect, use, and protect your information.
      </p>

      <section className="mt-10 space-y-6">

        <h2 className="text-xl font-semibold">
          Information We Collect
        </h2>
        <p>
          Personal details, shipping address, contact information,
          and payment data when you place an order.
        </p>

        <h2 className="text-xl font-semibold">
          How We Use Your Information
        </h2>
        <p>
          To process orders, improve services, and provide support.
        </p>

        <h2 className="text-xl font-semibold">
          Data Security
        </h2>
        <p>
          We use industry-standard security practices to protect your data.
        </p>

      </section>
    </>
  );
}
