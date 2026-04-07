import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Upload, 
  Type as TypeIcon, 
  Sparkles, 
  Palette, 
  Copy, 
  Check, 
  Image as ImageIcon, 
  Zap, 
  Info,
  ChevronRight,
  RefreshCw,
  Download,
  Layout
} from "lucide-react";
import { analyzeThumbnail, generateThumbnailConcept, generateThumbnailImage, ThumbnailAnalysis } from "./lib/gemini";

const STYLES = [
  { id: "gaming", name: "Gaming", icon: "🎮" },
  { id: "tech", name: "Tech", icon: "💻" },
  { id: "vlog", name: "Vlog", icon: "🤳" },
  { id: "news", name: "News", icon: "📰" },
  { id: "music", name: "Music", icon: "🎵" },
  { id: "motivational", name: "Motivational", icon: "🔥" },
  { id: "educational", name: "Educational", icon: "📚" },
  { id: "dark", name: "Dark Cinematic", icon: "🎬" },
];

const SAMPLE_PROMPTS = [
  "How I made $10,000 in 30 days",
  "The secret to perfect coffee",
  "Minecraft but everything is lava",
  "Why AI will change everything",
];

export default function App() {
  const [mode, setMode] = useState<"prompt" | "upload">("prompt");
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("gaming");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<ThumbnailAnalysis | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<{ data: string; mimeType: string } | null>(null);
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = (event.target?.result as string).split(",")[1];
        setUploadedImage({ data: base64, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResult(null);
    setGeneratedImageUrl(null);

    try {
      let analysis: ThumbnailAnalysis;
      if (mode === "upload" && uploadedImage) {
        analysis = await analyzeThumbnail(uploadedImage.data, uploadedImage.mimeType);
      } else {
        analysis = await generateThumbnailConcept(prompt || "Viral Video", selectedStyle);
      }
      
      setResult(analysis);
      const imageUrl = await generateThumbnailImage(analysis.imagePrompt);
      setGeneratedImageUrl(imageUrl);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="app min-h-screen font-sans">
      {/* Header */}
      <header className="header flex items-center justify-between px-6 md:px-10 h-[70px] border-b border-white/10 sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="logo font-display text-2xl tracking-[3px] accent-gradient bg-clip-text text-transparent">
          THUMBCRAFT AI
        </div>
        <div className="badge font-mono text-[10px] text-[#f5c518] border border-[#f5c518] px-3 py-1 rounded-full tracking-[2px] uppercase">
          Beta Access
        </div>
      </header>

      {/* Hero */}
      <section className="hero text-center py-12 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hero-label font-mono text-[11px] text-[#ff3c5f] tracking-[4px] uppercase mb-4"
        >
          AI-Powered Visual Strategy
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="hero-title font-display text-5xl md:text-8xl tracking-[4px] leading-[0.95] mb-6"
        >
          CRAFT <span className="accent-gradient bg-clip-text text-transparent">VIRAL</span> THUMBNAILS
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="hero-sub text-[#6b6b8a] text-lg max-w-xl mx-auto font-light"
        >
          Transform your ideas into high-click-through-rate visual concepts using advanced AI analysis and generation.
        </motion.p>
      </section>

      {/* Main Content */}
      <main className="main-grid max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
        
        {/* Left Panel: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] accent-gradient" />
            
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-4 h-4 text-[#ff3c5f]" />
              <h2 className="font-mono text-[11px] text-[#ff3c5f] tracking-[3px] uppercase">Configuration</h2>
            </div>

            {/* Mode Switcher */}
            <div className="flex bg-[#111118] p-1.5 rounded-2xl mb-8">
              <button 
                onClick={() => setMode("prompt")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${mode === "prompt" ? "bg-[#16161f] text-white shadow-lg border border-white/5" : "text-[#6b6b8a] hover:text-white"}`}
              >
                <TypeIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Text Prompt</span>
              </button>
              <button 
                onClick={() => setMode("upload")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${mode === "upload" ? "bg-[#16161f] text-white shadow-lg border border-white/5" : "text-[#6b6b8a] hover:text-white"}`}
              >
                <Upload className="w-4 h-4" />
                <span className="text-sm font-medium">Upload Style</span>
              </button>
            </div>

            {/* Prompt Input */}
            {mode === "prompt" ? (
              <div className="space-y-4 mb-8">
                <label className="block text-xs font-mono text-[#6b6b8a] uppercase tracking-wider">Video Topic or Idea</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. 10 Mistakes every new coder makes..."
                  className="w-full bg-[#111118] border border-white/5 rounded-2xl p-4 text-white placeholder:text-[#3a3a4a] focus:outline-none focus:border-[#ff3c5f]/50 transition-all min-h-[120px] resize-none"
                />
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_PROMPTS.map(p => (
                    <button 
                      key={p}
                      onClick={() => setPrompt(p)}
                      className="text-[10px] bg-[#111118] text-[#6b6b8a] px-3 py-1.5 rounded-lg hover:text-white hover:border-white/20 border border-transparent transition-all"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                <label className="block text-xs font-mono text-[#6b6b8a] uppercase tracking-wider">Reference Thumbnail</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video bg-[#111118] border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#ff3c5f]/30 transition-all group overflow-hidden relative"
                >
                  {uploadedImage ? (
                    <img src={`data:${uploadedImage.mimeType};base64,${uploadedImage.data}`} className="w-full h-full object-cover" alt="Upload" />
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-[#16161f] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <ImageIcon className="w-6 h-6 text-[#6b6b8a]" />
                      </div>
                      <p className="text-sm text-[#6b6b8a]">Click to upload or drag & drop</p>
                      <p className="text-[10px] text-[#3a3a4a] mt-1">JPG, PNG up to 5MB</p>
                    </>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>
              </div>
            )}

            {/* Style Selection */}
            <div className="space-y-4 mb-10">
              <label className="block text-xs font-mono text-[#6b6b8a] uppercase tracking-wider">Visual Style</label>
              <div className="grid grid-cols-2 gap-3">
                {STYLES.map(s => (
                  <button 
                    key={s.id}
                    onClick={() => setSelectedStyle(s.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedStyle === s.id ? "bg-[#ff3c5f]/10 border-[#ff3c5f]/30 text-white" : "bg-[#111118] border-white/5 text-[#6b6b8a] hover:border-white/10"}`}
                  >
                    <span className="text-lg">{s.icon}</span>
                    <span className="text-xs font-medium">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || (mode === "prompt" && !prompt) || (mode === "upload" && !uploadedImage)}
              className="w-full accent-gradient p-[1px] rounded-2xl group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="bg-[#0a0a0f] group-hover:bg-transparent transition-all rounded-[15px] py-4 flex items-center justify-center gap-3">
                {isGenerating ? (
                  <RefreshCw className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <Sparkles className="w-5 h-5 text-white" />
                )}
                <span className="font-bold tracking-wider text-white">
                  {isGenerating ? "CRAFTING MAGIC..." : "GENERATE CONCEPT"}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Right Panel: Results */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!result && !isGenerating ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 glass-panel rounded-3xl border-dashed"
              >
                <div className="w-20 h-20 rounded-full bg-[#111118] flex items-center justify-center mb-6">
                  <Layout className="w-10 h-10 text-[#3a3a4a]" />
                </div>
                <h3 className="text-xl font-medium mb-2">Ready to Craft?</h3>
                <p className="text-[#6b6b8a] max-w-xs">Configure your thumbnail on the left and click generate to see the AI magic.</p>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Preview Card */}
                <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl">
                  <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ImageIcon className="w-4 h-4 text-[#7c3aed]" />
                      <h3 className="font-mono text-[11px] text-[#7c3aed] tracking-[3px] uppercase">Live Preview</h3>
                    </div>
                    {generatedImageUrl && (
                      <button className="text-[#6b6b8a] hover:text-white transition-all">
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="relative aspect-video bg-[#0a0a0f] flex items-center justify-center overflow-hidden">
                    {isGenerating ? (
                      <div className="flex flex-col items-center gap-4">
                        <RefreshCw className="w-8 h-8 animate-spin text-[#ff3c5f]" />
                        <p className="text-xs font-mono text-[#6b6b8a] animate-pulse">Rendering visual elements...</p>
                      </div>
                    ) : (
                      <>
                        {generatedImageUrl && (
                          <motion.img 
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            src={generatedImageUrl} 
                            className="w-full h-full object-cover" 
                            alt="Preview" 
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                          <motion.input 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            value={result?.title || ""}
                            onChange={(e) => setResult(prev => prev ? { ...prev, title: e.target.value } : null)}
                            className="bg-transparent border-none outline-none font-display text-4xl md:text-6xl text-white leading-tight glow-text uppercase italic w-full"
                            placeholder="ENTER TITLE"
                          />
                          <motion.input 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            value={result?.subtitle || ""}
                            onChange={(e) => setResult(prev => prev ? { ...prev, subtitle: e.target.value } : null)}
                            className="bg-transparent border-none outline-none text-[#f5c518] font-mono text-sm tracking-widest mt-2 w-full"
                            placeholder="ENTER SUBTITLE"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Color Palette */}
                  <div className="glass-panel rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Palette className="w-4 h-4 text-[#f5c518]" />
                      <h3 className="font-mono text-[11px] text-[#f5c518] tracking-[3px] uppercase">Color Palette</h3>
                    </div>
                    <div className="flex gap-2">
                      {result?.colors.map((c, i) => (
                        <div key={i} className="flex-1 group relative">
                          <div 
                            className="h-12 rounded-xl border border-white/10 shadow-lg transition-transform group-hover:scale-105" 
                            style={{ backgroundColor: c }} 
                          />
                          <div className="absolute -bottom-6 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-mono text-[#6b6b8a]">{c}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Design Tips */}
                  <div className="glass-panel rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Info className="w-4 h-4 text-[#7c3aed]" />
                      <h3 className="font-mono text-[11px] text-[#7c3aed] tracking-[3px] uppercase">Design Strategy</h3>
                    </div>
                    <ul className="space-y-3">
                      {result?.designTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-3 text-xs text-[#6b6b8a] leading-relaxed">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] mt-1 shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* AI Prompt Card */}
                <div className="glass-panel rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-[#ff3c5f]" />
                      <h3 className="font-mono text-[11px] text-[#ff3c5f] tracking-[3px] uppercase">Master Prompt</h3>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(result?.imagePrompt || "")}
                      className="flex items-center gap-2 text-[10px] font-mono text-[#6b6b8a] hover:text-white transition-all bg-[#111118] px-3 py-1.5 rounded-lg border border-white/5"
                    >
                      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                      {copied ? "COPIED" : "COPY PROMPT"}
                    </button>
                  </div>
                  <div className="bg-[#111118] rounded-2xl p-4 border border-white/5">
                    <p className="text-sm text-[#6b6b8a] font-light leading-relaxed italic">
                      {result?.imagePrompt}
                    </p>
                  </div>
                </div>

                {/* Analysis Chips */}
                <div className="flex flex-wrap gap-2">
                  <div className="bg-[#111118] border border-white/5 px-4 py-2 rounded-full flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#6b6b8a] uppercase tracking-wider">Mood:</span>
                    <span className="text-xs text-white font-medium">{result?.mood}</span>
                  </div>
                  {result?.elements.map((el, i) => (
                    <div key={i} className="bg-[#111118] border border-white/5 px-4 py-2 rounded-full flex items-center gap-2">
                      <ChevronRight className="w-3 h-3 text-[#ff3c5f]" />
                      <span className="text-xs text-white font-medium">{el}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-10 border-t border-white/5">
        <p className="text-[10px] font-mono text-[#3a3a4a] tracking-[4px] uppercase">
          Powered by Gemini AI & ThumbCraft Engine
        </p>
      </footer>
    </div>
  );
}
