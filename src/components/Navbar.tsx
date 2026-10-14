"use client";

import Link from "next/link";
import { BookOpen, Trophy, Bell, Search, Flame } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0b132b]/95 backdrop-blur-md text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <span className="font-black text-xl text-white tracking-tighter">IT</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-wide bg-gradient-to-r from-white via-slate-200 to-amber-400 bg-clip-text text-transparent">
                IT LEGEND
              </span>
              <span className="text-[10px] text-amber-400/90 font-medium tracking-wider uppercase">
                Learning Platform
              </span>
            </div>
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg text-sm font-semibold text-white bg-slate-800/60 hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              الكورسات
            </Link>
            <Link
              href="/courses/frontend-masterclass"
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/40 transition-colors"
            >
              مشغل الكورس التجريبي
            </Link>
          </nav>
        </div>

        {/* Search Input */}
        <div className="hidden lg:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث عن دورة، تقنية، أو محاضر..."
              className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl py-2 pr-9 pl-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 transition-all"
            />
          </div>
        </div>

        {/* User Stats & Profile */}
        <div className="flex items-center gap-3">
          {/* Streak & Points Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>2,180 نقطة</span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-2 pl-1 border-r border-slate-800 pr-3">
            <div className="w-9 h-9 rounded-full ring-2 ring-amber-500/50 overflow-hidden bg-slate-800 flex items-center justify-center font-bold text-sm text-white">
              س
            </div>
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-white">سلطان العدوي</span>
              <span className="text-[10px] text-emerald-400 font-medium">طالب نشط</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
