import { FeatureCard } from "@/components/FeatureCard";

const FEATURES = [
  {
    title: "Track every spending",
    description:
      "Log each expense as it happens so nothing slips through the cracks.",
  },
  {
    title: "Control your budget",
    description:
      "Set spending limits by category and stay on top of your goals.",
  },
  {
    title: "Save more money",
    description: "Spot patterns in your spending and find room to save.",
  },
  {
    title: "Your data stays private",
    description:
      "Every account is isolated, so only you can see or change your data.",
  },
];

export function FeaturesSection() {
  return (
    <section aria-labelledby="features-heading" className="px-6 py-16">
      <h2 id="features-heading" className="sr-only">
        Why expense tracking matters
      </h2>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
}
