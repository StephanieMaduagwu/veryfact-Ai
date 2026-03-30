import React from "react";
import { motion } from "motion/react";
import { 
  Code, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink,
  Server,
  Key
} from "lucide-react";
import { useState } from "react";

export default function APIDocs() {
  const [copied, setCopied] = useState(false);

  const codeExample = `fetch('https://api.veryfact.ai/v1/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    content: "The moon is made of green cheese..."
  })
})
.then(response => response.json())
.then(data => console.log(data));`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold uppercase tracking-widest">
          <Code className="w-4 h-4" />
          Developer API
        </div>
        <h2 className="text-4xl font-black tracking-tight">Integrate Veryfact AI</h2>
        <p className="text-xl text-gray-500 max-w-2xl">
          Build credibility checks directly into your own applications, CMS, or browser extensions using our robust REST API.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                <Terminal className="w-4 h-4" />
                POST /v1/analyze
              </div>
              <button 
                onClick={handleCopy}
                className="text-gray-400 hover:text-emerald-600 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="p-6 bg-[#1e1e1e] overflow-x-auto">
              <pre className="text-sm text-emerald-400 font-mono leading-relaxed">
                <code>{codeExample}</code>
              </pre>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Endpoint Details</h3>
            <div className="space-y-4">
              <div className="p-6 bg-white border border-gray-200 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">POST</span>
                  <code className="text-sm font-bold">/v1/analyze</code>
                </div>
                <p className="text-sm text-gray-600 mb-4">Analyzes a text block or URL for credibility and bias.</p>
                <div className="space-y-2">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Parameters</div>
                  <div className="grid grid-cols-3 gap-4 text-sm border-t border-gray-100 pt-2">
                    <div className="font-mono font-bold">content</div>
                    <div className="text-gray-400 italic">string</div>
                    <div className="text-gray-600">The text to analyze (max 10k chars)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-6 shadow-sm">
            <h3 className="font-bold flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-500" />
              Authentication
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              All API requests require an API key passed in the <code className="bg-gray-100 px-1 rounded">Authorization</code> header as a Bearer token.
            </p>
            <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-blue-200">
              Generate API Key
            </button>
          </div>

          <div className="bg-gray-900 rounded-3xl p-6 text-white space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-400" />
              Rate Limits
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Free Tier</span>
                <span className="font-bold">100 req/day</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Pro Tier</span>
                <span className="font-bold">10,000 req/day</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Enterprise</span>
                <span className="font-bold text-emerald-400">Unlimited</span>
              </div>
            </div>
            <div className="pt-4 border-t border-white/10">
              <a href="#" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
                View full pricing <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
