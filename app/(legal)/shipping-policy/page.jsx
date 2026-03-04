export const metadata = {
  title: "Shipping Policy | Farmizo",
};

export default function ShippingPolicyPage() {
  return (
    <>
      <h1 className="text-4xl font-bold text-text-heading">
        Shipping Policy
      </h1>

      <p className="mt-6">
        Details about shipping coverage and delivery timelines.
      </p>

      <section className="mt-10 space-y-6">

        <h2 className="text-xl font-semibold">
          Delivery Areas
        </h2>
        <p>
          We currently ship across major cities in India.
        </p>

        <h2 className="text-xl font-semibold">
          Timelines
        </h2>
        <p>
          Orders are delivered within 3–7 working days.
        </p>

      </section>
    </>
  );
}
