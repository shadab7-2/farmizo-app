export const metadata = {
  title: "Disclaimer | Farmizo",
};

export default function DisclaimerPage() {
  return (
    <>
      <h1 className="text-4xl font-bold text-text-heading">
        Disclaimer
      </h1>

      <p className="mt-6">
        Information provided on Farmizo is for general guidance only.
      </p>

      <section className="mt-10 space-y-6">

        <h2 className="text-xl font-semibold">
          Product Usage
        </h2>
        <p>
          Results may vary depending on soil and climate conditions.
        </p>

        <h2 className="text-xl font-semibold">
          External Links
        </h2>
        <p>
          We are not responsible for third-party content.
        </p>

      </section>
    </>
  );
}
