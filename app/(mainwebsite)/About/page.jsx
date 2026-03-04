import Image from "@/components/common/SafeImage";
import Link from "next/link";


export const metadata = {
  title: "About Farmizo – Grow Green, Live Better",
  description:
    "Learn about Farmizo’s mission to deliver fresh plants and agri-products directly from farms and nurseries to your doorstep.",
};

export default function AboutPage() {
  return (
    <main>

      {/* ================= HERO ================= */}
      <section className="bg-bg-section-soft">
        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">

          <div>
            <h1 className="text-5xl font-bold text-text-heading">
              About Farmizo 🌱
            </h1>

            <p className="mt-6 text-lg text-text-body max-w-xl">
              Farmizo is building India’s most trusted platform for plants and
              agri-products — connecting farmers, nurseries, and urban gardeners
              through technology.
            </p>
          </div>

          <div>
            <Image
              src="https://images.pexels.com/photos/6508765/pexels-photo-6508765.jpeg"
              alt="Farmizo nursery and plants"
              width={600}
              height={450}
              className="rounded-2xl shadow-lg object-cover"
            />
          </div>

        </div>
      </section>

      {/* ================= STORY ================= */}
      <section className="bg-bg-page">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">

          <h2 className="text-3xl font-bold text-text-heading">
            Our Story
          </h2>

          <p className="mt-6 text-text-body leading-relaxed">
            We started Farmizo with a simple belief: everyone should have
            access to healthy plants, quality seeds, and sustainable
            farming supplies. By partnering directly with growers, we
            reduce middlemen and ensure freshness, fair pricing, and
            eco-friendly practices.
          </p>

        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="bg-bg-section-muted">
        <div className="max-w-7xl mx-auto px-6 py-24">

          <h2 className="text-3xl font-bold text-text-heading text-center">
            Why Choose Farmizo?
          </h2>

          <div className="mt-16 grid sm:grid-cols-2 md:grid-cols-3 gap-12">

            {[
              {
                title: "Farm Fresh Supply",
                desc: "Direct sourcing from trusted farmers and nurseries.",
              },
              {
                title: "Sustainable Practices",
                desc: "Eco-friendly packaging and organic-first approach.",
              },
              {
                title: "Fast Delivery",
                desc: "Carefully packed and shipped to protect every plant.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-bg-page p-8 rounded-2xl shadow-sm border border-border-default"
              >
                <h3 className="text-xl font-semibold text-text-heading">
                  {item.title}
                </h3>

                <p className="mt-4 text-text-body">
                  {item.desc}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      
<section className="bg-bg-page border-t border-border-default">
  <div className="max-w-5xl mx-auto px-6 py-20 text-center">

    <h2 className="text-3xl font-bold text-text-heading">
      Join the Green Revolution
    </h2>

    <p className="mt-4 text-text-muted">
      Start growing today with Farmizo’s curated plants and agri-essentials.
    </p>

    <div className="mt-8">
      <Link
        href="/products"
        className="inline-block bg-action-primary hover:bg-action-primary-hover text-text-inverse px-8 py-4 rounded-xl font-semibold transition shadow-md"
      >
        Shop Now
      </Link>
    </div>

  </div>
</section>
    </main>
  );
}
