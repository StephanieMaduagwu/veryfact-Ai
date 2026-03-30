import React from "react";
import { motion } from "motion/react";
import { 
  ShieldCheck, 
  Cpu, 
  Database, 
  Globe, 
  Zap, 
  CheckCircle2,
  Lock
} from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Cpu className="w-6 h-6 text-emerald-600" />,
      title: "Linguistic Analysis",
      description: "Our AI examines the structure, tone, and complexity of the text to identify common patterns found in misinformation."
    },
    {
      icon: <Database className="w-6 h-6 text-emerald-600" />,
      title: "Fact Cross-Referencing",
      description: "Claims are compared against a vast database of verified facts and reputable news sources to check for inconsistencies."
    },
    {
      icon: <Globe className="w-6 h-6 text-emerald-600" />,
      title: "Source Credibility",
      description: "We analyze the reputation and historical accuracy of the sources mentioned or implied in the content."
    },
    {
      icon: <Zap className="w-6 h-6 text-emerald-600" />,
      title: "Bias Detection",
      description: "The system identifies emotional manipulation, extreme bias, and logical fallacies that often accompany fake news."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-16">
      <section className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold uppercase tracking-widest"
        >
          <ShieldCheck className="w-4 h-4" />
          Our Methodology
        </motion.div>
        <h2 className="text-4xl font-black tracking-tight">How Veryfact AI Works</h2>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          We combine state-of-the-art Large Language Models with rigorous journalistic standards to provide deep insights into content credibility.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
              {step.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
            <p className="text-gray-600 leading-relaxed">{step.description}</p>
          </motion.div>
        ))}
      </div>

      <section className="bg-emerald-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold">Built for Accuracy</h3>
            <p className="text-emerald-100/80 leading-relaxed">
              Veryfact AI doesn't just give a "true" or "false" answer. We provide a nuanced analysis of credibility, identifying where a story might be partially true but misleadingly framed.
            </p>
            <ul className="space-y-3">
              {[
                "Real-time processing",
                "Context-aware analysis",
                "Transparent reasoning",
                "Privacy-first approach"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-emerald-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold">Privacy Guaranteed</div>
                <div className="text-xs text-emerald-200">Your data is never stored permanently</div>
              </div>
            </div>
            <p className="text-sm text-emerald-100/70 italic">
              "Our mission is to restore trust in the digital information ecosystem by providing accessible, AI-powered verification tools for everyone."
            </p>
          </div>
        </div>
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-48 -mt-48" />
      </section>
    </div>
  );
}
