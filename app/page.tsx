import BarcodeScanner from "@/components/BarcodeScanner";

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">No lookup · No brands · Text prompt only</p>
        <h1>Barcode Character Generator</h1>
        <p>
          Scan any barcode and turn its digits into a repeatable character seed for a safe, original anime-inspired female character prompt.
        </p>
      </section>
      <BarcodeScanner />
    </main>
  );
}
