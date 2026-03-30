/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Link } from "react-router-dom";
import { ShieldCheck, Menu, X, Search, BookOpen, Code } from "lucide-react";
import Analyzer from "./components/Analyzer";
import HowItWorks from "./components/HowItWorks";
import APIDocs from "./components/APIDocs";
import { cn } from "./lib/utils";
import { AnimatePresence, motion } from "motion/react";

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Analyzer", path: "/", icon: <Search className="w-5 h-5" /> },
    { label: "How it works", path: "/how-it-works", icon: <BookOpen className="w-5 h-5" /> },
    { label: "API", path: "/api", icon: <Code className="w-5 h-5" /> },
  ];

  return (
    <Router>
      <div className="min-h-screen bg-[#f5f5f5] text-[#1a1a1a] font-sans selection:bg-emerald-100 pb-20 md:pb-0">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">Veryfact <span className="text-emerald-600">AI</span></h1>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
              {navItems.map((item) => (
                <NavLink 
                  key={item.path}
                  to={item.path} 
                  className={({ isActive }) => cn(
                    "hover:text-emerald-600 transition-colors relative py-1",
                    isActive && "text-emerald-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-emerald-600 after:rounded-full"
                  )}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Mobile Menu Toggle (Optional now with bottom nav, but keeping for extra links if needed) */}
            <button 
              className="md:hidden p-2 text-gray-500 hover:text-emerald-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Nav Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-white border-b border-gray-200 overflow-hidden"
              >
                <nav className="flex flex-col p-4 space-y-2">
                  {navItems.map((item) => (
                    <NavLink 
                      key={item.path}
                      to={item.path} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) => cn(
                        "p-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-3",
                        isActive ? "bg-emerald-50 text-emerald-600" : "text-gray-500 hover:bg-gray-50"
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 z-50 flex items-center justify-around shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          {navItems.map((item) => (
            <NavLink 
              key={item.path}
              to={item.path} 
              className={({ isActive }) => cn(
                "flex flex-col items-center gap-1 transition-colors",
                isActive ? "text-emerald-600" : "text-gray-400"
              )}
            >
              {item.icon}
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <main className="max-w-5xl mx-auto px-4 py-12">
          <Routes>
            <Route path="/" element={<Analyzer />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/api" element={<APIDocs />} />
          </Routes>
        </main>

        <footer className="max-w-5xl mx-auto px-4 py-12 border-t border-gray-200 mt-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-sm text-gray-400 font-medium">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>&copy; 2026 Veryfact AI. All rights reserved.</span>
              </div>
              <p className="text-xs text-gray-400/80 max-w-md">
                Developed by <span className="font-bold text-gray-500">AMADI TEMPLE MADUBOCHI</span> as a school project from <span className="italic text-gray-400">Ignatius Ajuru University of Education</span>.
              </p>
            </div>
            <div className="flex items-center gap-8">
              <a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a>
              <a 
                href="https://wa.me/2348124424085" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-emerald-600 transition-colors font-bold text-emerald-600/80"
              >
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
