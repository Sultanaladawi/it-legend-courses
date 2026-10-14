"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { mockCourses } from "@/data/mockData";
import { CourseCard } from "@/components/CourseCard";
import { Footer } from "@/components/Footer";
import {
  Sparkles,
  Search,
  BookOpen,
  Trophy,
  Flame,
  CheckCircle,
  PlayCircle,
  Compass,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(mockCourses.map((c) => c.category)));
    return ["all", ...cats];
  }, []);

  const filteredCourses = useMemo(() => {
    return mockCourses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || course.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "all" || course.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchQuery, selectedCategory, selectedStatus]);

  const featuredCourse = mockCourses[0];

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Welcome & Stats Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0d1633] to-slate-950 border border-slate-800 p-6 sm:p-10 mb-10 shadow-2xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>تحدي الواجهات البرمجية - منصة IT Legend</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-3">
                مرحباً بك يا سلطان، استكمل رحلتك نحو الاحتراف البرمجي 🚀
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                تصفح دوراتك الحالية، اختبر معلوماتك، وشاهد أحدث شروحات الفيديو التفاعلية المتوافقة مع أرقى معايير تجربة المستخدم.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-sm flex flex-col items-center justify-center text-center">
                <BookOpen className="w-5 h-5 text-amber-400 mb-1" />
                <span className="text-xl font-black text-white">6</span>
                <span className="text-[11px] text-slate-400">دورات متاحة</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-sm flex flex-col items-center justify-center text-center">
                <CheckCircle className="w-5 h-5 text-emerald-400 mb-1" />
                <span className="text-xl font-black text-white">45%</span>
                <span className="text-[11px] text-slate-400">نسبة التقدم</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-sm flex flex-col items-center justify-center text-center">
                <Flame className="w-5 h-5 text-orange-400 mb-1" />
                <span className="text-xl font-black text-white">2,180</span>
                <span className="text-[11px] text-slate-400">نقاط الخبرة</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-sm flex flex-col items-center justify-center text-center">
                <GraduationCap className="w-5 h-5 text-cyan-400 mb-1" />
                <span className="text-xl font-black text-white">المركز 2</span>
                <span className="text-[11px] text-slate-400">المتصدرين</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Course Highlight Banner */}
        {featuredCourse && (
          <section className="mb-12">
            <div className="relative rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
              <div className="max-w-2xl">
                <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500 text-slate-950 mb-2">
                  دورة التحدي الرئيسية (Figma Target)
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
                  {featuredCourse.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {featuredCourse.subtitle}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    المحاضر: {featuredCourse.instructor.name}
                  </span>
                  <span>•</span>
                  <span>{featuredCourse.totalLessons} درس تفاعلي</span>
                  <span>•</span>
                  <span>وضع المسرح والشاشة الكاملة + Sticky Video</span>
                </div>
              </div>

              <div className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href={`/courses/${featuredCourse.id}`}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all hover:scale-105"
                >
                  <PlayCircle className="w-5 h-5 fill-slate-950 text-amber-500" />
                  <span>فتح مشغل الكورس المتطور</span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Filters & Search Toolbar */}
        <section className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن اسم الدورة، الكلمات الدلالية، أو المحاضر..."
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl py-3 pr-10 pl-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  مسح
                </button>
              )}
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800 self-start md:self-auto overflow-x-auto max-w-full">
              {[
                { id: "all", label: "الكل" },
                { id: "in_progress", label: "قيد المتابعة" },
                { id: "completed", label: "مكتملة" },
                { id: "not_started", label: "جديدة" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStatus(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    selectedStatus === tab.id
                      ? "bg-amber-500 text-slate-950 shadow-md"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? "bg-slate-800 text-amber-400 border-amber-500/50 shadow-sm"
                    : "bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300"
                }`}
              >
                {cat === "all" ? "جميع المسارات" : cat}
              </button>
            ))}
          </div>
        </section>

        {/* Courses Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" />
              <span>قائمة الكورسات التدريبية ({filteredCourses.length})</span>
            </h2>
            <span className="text-xs text-slate-400">
              عرض {filteredCourses.length} من أصل {mockCourses.length} دورات
            </span>
          </div>

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">لا توجد دورات مطابقة للبحث</h3>
              <p className="text-xs text-slate-400 mb-4">
                جرب تغيير كلمة البحث أو إعادة تعيين عوامل التصفية
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedStatus("all");
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
              >
                إعادة ضبط عوامل التصفية
              </button>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}
