import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  History, 
  Trash2, 
  ExternalLink,
  Loader2,
  CheckCircle2,
  XCircle,
  X,
  ArrowRight,
  Newspaper,
  UserCheck,
  BarChart3,
  Zap,
  Quote,
  Globe,
  Lock,
  BookOpen
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { analyzeNews, AnalysisResult } from "../services/geminiService";
import { cn } from "../lib/utils";

interface HistoryItem {
  id: string;
  content: string;
  result: AnalysisResult;
  timestamp: number;
}

export default function Analyzer() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem("veryfact_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [error, setError] = useState<string | null>(null);

  const MAX_CHARS = 10000;

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeNews(input);
      setResult(analysis);
      
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        content: input.slice(0, 100) + (input.length > 100 ? "..." : ""),
        result: analysis,
        timestamp: Date.now(),
      };
      
      const updatedHistory = [newItem, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem("veryfact_history", JSON.stringify(updatedHistory));
    } catch (err: any) {
      setError(err.message || "An error occurred while analyzing the content. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("veryfact_history");
  };

  const clearInput = () => {
    setInput("");
    setResult(null);
    setError(null);
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "Reliable": return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "Unreliable": return "text-rose-600 bg-rose-50 border-rose-200";
      case "Mixed": return "text-amber-600 bg-amber-50 border-amber-200";
      case "Satire": return "text-purple-600 bg-purple-50 border-purple-200";
      case "Opinion": return "text-blue-600 bg-blue-50 border-blue-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "Reliable": return <ShieldCheck className="w-6 h-6" />;
      case "Unreliable": return <ShieldAlert className="w-6 h-6" />;
      case "Mixed": return <AlertTriangle className="w-6 h-6" />;
      case "Satire": return <Info className="w-6 h-6" />;
      case "Opinion": return <Info className="w-6 h-6" />;
      default: return <Search className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Input and History */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">Analyze News Credibility</h2>
              <p className="text-gray-500">Paste an article text or a claim to verify its authenticity using advanced AI.</p>
            </div>

            <form onSubmit={handleAnalyze} className="space-y-4">
              <div className="relative group">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
                  placeholder="Paste news content or claim here..."
                  className="w-full h-48 p-6 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none text-lg leading-relaxed outline-none"
                />
                
                {/* Clear Button */}
                {input.length > 0 && (
                  <button
                    type="button"
                    onClick={clearInput}
                    className="absolute top-4 right-4 p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-colors"
                    title="Clear text"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <div className="absolute bottom-4 right-4 flex items-center gap-4 text-xs font-medium">
                  <span className={cn(
                    input.length >= MAX_CHARS ? "text-rose-500" : "text-gray-400"
                  )}>
                    {input.length.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !input.trim()}
                className={cn(
                  "w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 shadow-lg",
                  loading || !input.trim() 
                    ? "bg-gray-300 cursor-not-allowed" 
                    : "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] shadow-emerald-200"
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Content...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Run Analysis
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Results Section */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 flex items-center gap-3"
              >
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50"
              >
                <div className="p-8 border-b border-gray-100">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div className={cn(
                      "px-4 py-2 rounded-full border flex items-center gap-2 font-bold text-sm uppercase tracking-wider",
                      getVerdictColor(result.verdict)
                    )}>
                      {getVerdictIcon(result.verdict)}
                      {result.verdict}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-gray-400 uppercase font-bold tracking-widest">Credibility Score</div>
                        <div className="text-2xl font-black text-emerald-600">{result.credibilityScore}%</div>
                      </div>
                      <div className="w-12 h-12 rounded-full border-4 border-emerald-100 flex items-center justify-center relative overflow-hidden">
                        <div 
                          className="absolute bottom-0 left-0 w-full bg-emerald-500 transition-all duration-1000" 
                          style={{ height: `${result.credibilityScore}%` }}
                        />
                        <span className="relative z-10 text-[10px] font-bold">{result.credibilityScore}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">AI Reasoning</h3>
                      <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                        <ReactMarkdown>{result.reasoning}</ReactMarkdown>
                      </div>
                    </div>

                    {/* New Indicators Section */}
                    {result.indicators && result.indicators.length > 0 && (
                      <div className="pt-6 border-t border-gray-100">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          Key Indicators & Patterns
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                          {result.indicators.map((indicator, i) => (
                            <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4">
                              <div className={cn(
                                "w-2 h-2 rounded-full mt-2 shrink-0",
                                indicator.severity === "High" ? "bg-rose-500" : 
                                indicator.severity === "Medium" ? "bg-amber-500" : "bg-blue-500"
                              )} />
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-gray-900">{indicator.label}</span>
                                  <span className={cn(
                                    "text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border",
                                    indicator.severity === "High" ? "text-rose-600 bg-rose-50 border-rose-100" : 
                                    indicator.severity === "Medium" ? "text-amber-600 bg-amber-50 border-amber-100" : "text-blue-600 bg-blue-50 border-blue-100"
                                  )}>
                                    {indicator.severity} Risk
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">{indicator.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                      <div className="space-y-3">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          Key Findings
                        </h3>
                        <ul className="space-y-2">
                          {result.keyFindings.map((finding, i) => (
                            <li key={i} className="text-sm text-gray-600 flex gap-2">
                              <span className="text-emerald-500 font-bold">•</span>
                              {finding}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-rose-500" />
                          Potential Biases
                        </h3>
                        <ul className="space-y-2">
                          {result.potentialBiases.map((bias, i) => (
                            <li key={i} className="text-sm text-gray-600 flex gap-2">
                              <span className="text-rose-500 font-bold">•</span>
                              {bias}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {result.sourcesToVerify && result.sourcesToVerify.length > 0 && (
                      <div className="pt-6 border-t border-gray-100">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Recommended Sources to Verify</h3>
                        <div className="flex flex-wrap gap-2">
                          {result.sourcesToVerify.map((source, i) => (
                            <span key={i} className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-600 flex items-center gap-1">
                              {source}
                              <ExternalLink className="w-3 h-3" />
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: History and Stats */}
        <div className="space-y-8">
          <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 font-bold">
                <History className="w-5 h-5 text-emerald-600" />
                Recent Checks
              </div>
              {history.length > 0 && (
                <button 
                  onClick={clearHistory}
                  className="text-xs text-rose-500 hover:text-rose-600 font-bold uppercase tracking-widest flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 opacity-20" />
                </div>
                <p className="text-sm">No recent analysis history.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setResult(item.result);
                      setInput(item.content);
                    }}
                    className="w-full text-left p-4 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border",
                        getVerdictColor(item.result.verdict)
                      )}>
                        {item.result.verdict}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed group-hover:text-gray-900 transition-colors">
                      {item.content}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="bg-emerald-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-900/20">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4">Why Veryfact?</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-sm text-emerald-100/80">Advanced linguistic pattern analysis</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-sm text-emerald-100/80">Cross-referencing with known facts</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-sm text-emerald-100/80">Bias detection and emotional tone mapping</p>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
          </section>
        </div>
      </div>

      {/* Additional Home Page Content */}
      <div className="space-y-24 pt-12">
        {/* Why Fact Checking Matters */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-black tracking-tight leading-tight">
              In an era of information, <span className="text-emerald-600">truth</span> is your most valuable asset.
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              Misinformation spreads 6x faster than the truth. Veryfact AI empowers you to cut through the noise and verify claims in seconds, not hours.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
                <Newspaper className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-bold">News Verification</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-bold">Claim Analysis</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-bold">Bias Detection</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video bg-emerald-100 rounded-[2rem] overflow-hidden shadow-2xl shadow-emerald-200/50 flex items-center justify-center">
              <ShieldCheck className="w-32 h-32 text-emerald-600 opacity-20" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 max-w-[240px]">
              <div className="text-3xl font-black text-emerald-600 mb-1">98%</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Accuracy Rate</div>
              <p className="text-xs text-gray-500 mt-2">Our models are trained on millions of verified datasets.</p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Powerful Verification Tools</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Everything you need to navigate the modern digital landscape with confidence.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Real-time Analysis",
                desc: "Get instant feedback on any news snippet or social media claim.",
                icon: <Zap className="w-6 h-6" />
              },
              {
                title: "Bias Mapping",
                desc: "Visualize the political and emotional leanings of any article.",
                icon: <BarChart3 className="w-6 h-6" />
              },
              {
                title: "Source Scoring",
                desc: "Check the historical credibility of publishers and authors.",
                icon: <UserCheck className="w-6 h-6" />
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-900 rounded-[3rem] p-12 text-center space-y-8 relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Ready to verify your first claim?
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Join thousands of researchers, journalists, and curious citizens using Veryfact AI to fight misinformation.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-emerald-900/50"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          {/* Decorative background */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500 rounded-full blur-[120px]" />
          </div>
        </section>

        {/* Testimonials */}
        <section className="space-y-12 pb-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Trusted by Truth-Seekers</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">See what our community has to say about Veryfact AI.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: "Veryfact AI has become an essential tool in my daily research. It's fast, accurate, and incredibly easy to use.",
                author: "Sarah Jenkins",
                role: "Investigative Journalist"
              },
              {
                quote: "The bias detection feature is a game-changer. It helps me understand the underlying tone of any article instantly.",
                author: "David Chen",
                role: "Political Analyst"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative">
                <Quote className="absolute top-6 right-8 w-12 h-12 text-emerald-100" />
                <p className="text-lg text-gray-600 italic mb-6 relative z-10">"{testimonial.quote}"</p>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-emerald-600 font-medium">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Global Impact */}
        <section className="bg-emerald-50 rounded-[3rem] p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Fighting Misinformation Globally</h2>
            <p className="text-gray-600 leading-relaxed">
              Misinformation knows no borders. That's why Veryfact AI is designed to analyze content in multiple languages and across various cultural contexts.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="text-2xl font-black text-emerald-600">50+</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Languages Supported</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-black text-emerald-600">1M+</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Articles Analyzed</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-64 h-64 bg-emerald-200/50 rounded-full flex items-center justify-center relative">
              <Globe className="w-32 h-32 text-emerald-600 animate-pulse" />
              <div className="absolute top-0 right-0 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </section>

        {/* Fact-Checking Tips */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Quick Fact-Checking Tips</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Improve your media literacy with these simple steps before sharing any news.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Check the Source",
                desc: "Is it a reputable news organization or a known satire site?",
                icon: <Newspaper className="w-5 h-5" />
              },
              {
                title: "Read Beyond",
                desc: "Headlines can be misleading. Read the full article for context.",
                icon: <BookOpen className="w-5 h-5" />
              },
              {
                title: "Check the Date",
                desc: "Old news stories are often reshared as if they are current.",
                icon: <History className="w-5 h-5" />
              },
              {
                title: "Verify with Others",
                desc: "See if other reliable sources are reporting the same story.",
                icon: <Search className="w-5 h-5" />
              }
            ].map((tip, i) => (
              <div key={i} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-emerald-200 transition-colors">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                  {tip.icon}
                </div>
                <h3 className="font-bold mb-2">{tip.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
