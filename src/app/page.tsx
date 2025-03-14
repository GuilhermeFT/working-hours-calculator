import TimeCalculator from "@/src/components/time-calculator"
import Footer from "@/src/components/footer"
import Header from "@/src/components/header"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <Header />
        <TimeCalculator />
        <Footer />
      </div>
    </main>
  )
}
