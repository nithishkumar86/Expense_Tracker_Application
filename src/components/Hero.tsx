import Image from "next/image";

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white px-6 py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-blue-900 sm:text-5xl">
        Welcome To Expense Tracker
      </h1>
      <div className="mx-auto mt-10 max-w-md">
        <Image
          src="/images/tracker.jpg"
          alt="Expense Tracker"
          width={739}
          height={415}
          priority
          className="h-auto w-full rounded-xl shadow-lg"
        />
      </div>
    </section>
  );
}
