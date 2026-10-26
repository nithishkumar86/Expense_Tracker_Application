interface FeatureCardProps {
  title: string;
  description: string;
}

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-blue-900">{title}</h3>
      <p className="mt-2 text-sm text-blue-700/80">{description}</p>
    </div>
  );
}
