"use client";

import { useState } from "react";
import Image from "next/image";

const STYLES = [
  { value: "cartoon", label: "Cartoon", emoji: "🎨", desc: "Cute & simple" },
  { value: "realistic", label: "Realistic", emoji: "🖼️", desc: "Detailed & natural" },
  { value: "mandala", label: "Mandala", emoji: "🔮", desc: "Geometric patterns" },
  { value: "anime", label: "Anime", emoji: "⭐", desc: "Manga style" },
];

const DIFFICULTIES = [
  { value: "easy", label: "Easy", emoji: "🟢", desc: "Ages 3-6" },
  { value: "medium", label: "Medium", emoji: "🟡", desc: "Ages 6-12" },
  { value: "hard", label: "Hard", emoji: "🔴", desc: "Adults" },
];

const EXAMPLE_PROMPTS = [
  "A friendly dragon playing in a meadow with flowers",
  "A princess castle surrounded by roses",
  "Dinosaurs in a jungle with palm trees",
  "An astronaut floating in space among stars",
  "A cute cat sleeping next to a fireplace",
  "Underwater scene with fish and coral reef",
  "A forest with deer, rabbits, and mushrooms",
  "A superhero flying over a city skyline",
];

export default function ColoringPageGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("cartoon");
  const [difficulty, setDifficulty] = useState("medium");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please describe what you want to color.");
      return;
    }
    setError("");
    setLoading(true);
    setImageUrl(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style, difficulty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setImageUrl(data.imageUrl);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `coloring-page-${Date.now()}.png`;
    a.target = "_blank";
    a.click();
  };

  const handlePrint = () => {
    if (!imageUrl) return;
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(`
        <html><head><title>Coloring Page</title>
        <style>body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;}
        img{max-width:100%;max-height:100vh;}</style>
        </head><body><img src="${imageUrl}" onload="window.print()"/></body></html>
      `);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white border-b border-yellow-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-white font-bold">🎨</div>
          <span className="font-semibold text-gray-900">AI Coloring Page Generator</span>
          <span className="ml-auto text-xs text-gray-400 hidden sm:block">Powered by DALL-E 3</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 text-sm px-3 py-1 rounded-full mb-4">
            🖍️ Instant custom coloring pages
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Generate Any<br />
            <span className="text-yellow-500">Coloring Page</span> with AI
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Type what you want to color, pick a style and age level, and get a printable coloring page in seconds. Free, no signup.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          {/* Style Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    style === s.value
                      ? "border-yellow-400 bg-yellow-50"
                      : "border-gray-100 hover:border-yellow-200"
                  }`}
                >
                  <div className="text-2xl mb-1">{s.emoji}</div>
                  <div className="text-sm font-medium text-gray-800">{s.label}</div>
                  <div className="text-xs text-gray-400">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDifficulty(d.value)}
                  className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                    difficulty === d.value
                      ? "border-yellow-400 bg-yellow-50 text-yellow-700"
                      : "border-gray-100 text-gray-500 hover:border-yellow-200"
                  }`}
                >
                  {d.emoji} {d.label} <span className="text-xs font-normal">({d.desc})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What do you want to color? <span className="text-red-400">*</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A friendly dragon playing in a meadow with flowers and butterflies..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
            />
          </div>

          {/* Example Prompts */}
          <div className="mb-4">
            <div className="text-xs text-gray-400 mb-2">Try these ideas:</div>
            <div className="flex flex-wrap gap-1.5">
              {EXAMPLE_PROMPTS.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(ex)}
                  className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-100 px-2 py-1 rounded-full hover:bg-yellow-100 transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mb-3 bg-red-50 px-3 py-2 rounded-lg">{error}</div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-200 text-white font-bold py-3 rounded-xl transition-colors text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path d="M4 12a8 8 0 018-8v8H4z" fill="currentColor" className="opacity-75" />
                </svg>
                Creating your coloring page (~20 seconds)...
              </span>
            ) : (
              "🎨 Generate Coloring Page"
            )}
          </button>
        </div>

        {/* Result */}
        {imageUrl && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 text-lg">Your Coloring Page is Ready! 🎉</h2>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  🖨️ Print
                </button>
                <button
                  onClick={handleDownload}
                  className="text-sm px-3 py-1.5 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  ⬇️ Download PNG
                </button>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
              <Image
                src={imageUrl}
                alt="AI generated coloring page"
                width={1024}
                height={1024}
                className="w-full h-auto"
                unoptimized
              />
            </div>
            <button
              onClick={handleGenerate}
              className="mt-4 w-full py-2.5 border-2 border-dashed border-yellow-300 text-yellow-600 rounded-xl text-sm hover:bg-yellow-50 transition-colors"
            >
              ✨ Generate Another
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="bg-gray-100 rounded-xl animate-pulse" style={{ aspectRatio: "1/1" }} />
            <p className="text-center text-gray-400 text-sm mt-4">AI is drawing your coloring page... (~20 seconds)</p>
          </div>
        )}

        {/* Theme Suggestions / SEO Content */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Popular Coloring Page Themes</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { emoji: "🦕", name: "Dinosaurs", prompt: "T-Rex and other dinosaurs in prehistoric jungle" },
              { emoji: "🧚", name: "Fairies", prompt: "A fairy sitting on a flower with butterfly wings" },
              { emoji: "🚀", name: "Space", prompt: "Astronaut floating in space with planets and stars" },
              { emoji: "🦁", name: "Animals", prompt: "Lion family in African savanna with acacia trees" },
              { emoji: "👑", name: "Princess", prompt: "Princess in a beautiful castle with roses" },
              { emoji: "🐟", name: "Ocean", prompt: "Colorful fish and coral in underwater sea scene" },
              { emoji: "🌸", name: "Flowers", prompt: "Beautiful garden with roses, sunflowers and butterflies" },
              { emoji: "🦋", name: "Mandala", prompt: "Intricate mandala pattern with geometric shapes" },
            ].map((theme, i) => (
              <button
                key={i}
                onClick={() => { setPrompt(theme.prompt); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:border-yellow-300 hover:shadow-sm transition-all"
              >
                <div className="text-3xl mb-2">{theme.emoji}</div>
                <div className="text-sm font-medium text-gray-700">{theme.name}</div>
              </button>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">FAQ</h2>
          <div className="space-y-3">
            {[
              { q: "How do I print the coloring page?", a: "Click the 'Print' button to open the print dialog, or download as PNG and print from your computer. The pages are optimized for A4/Letter paper." },
              { q: "Are coloring pages free to download?", a: "Yes! All generated coloring pages are completely free to download and print. No account or subscription required." },
              { q: "Can I use these for my classroom or business?", a: "The coloring pages are for personal and educational use. Feel free to print them for home use, classrooms, or personal projects." },
              { q: "How long does it take to generate?", a: "AI image generation typically takes 15-25 seconds. The AI creates a unique coloring page based on your exact description every time." },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-1">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="border-t border-gray-100 mt-16 py-8 text-center text-sm text-gray-400">
        <p>© 2026 AI Coloring Page Generator · Free Custom Printable Coloring Pages</p>
      </footer>
    </main>
  );
}
