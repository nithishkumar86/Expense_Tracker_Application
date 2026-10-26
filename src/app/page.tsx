import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeaturesSection } from "@/components/FeaturesSection";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturesSection />
      </main>
    </div>
  );
}
