"use client";

import Link from "next/link";
import Image from "next/image";
import { Course } from "@/types/course";
import { Clock, BookOpen, Star, PlayCircle, CheckCircle2, ArrowLeft } from "lucide-react";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const isCompleted = course.status === "completed";
  const isInProgress = course.status === "in_progress";

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm">
          <CheckCircle2 className="w-3.5 h-3.5" />
          مكتمل 100%
        </span>
      );
    }
    if (isInProgress) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 backdrop-blur-sm">
          <PlayCircle className="w-3.5 h-3.5" />
          قيد التقدم {course.progressPercentage}%
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800/80 text-slate-300 border border-slate-700/60 backdrop-blur-sm">
        دورة جديدة
      </span>
    );
  };

  const getButtonText = () => {
    if (isCompleted) return "مراجعة الكورس";
    if (isInProgress) return "استكمل الدورة";
    return "ابدأ التعلم الآن";
  };

  return (
    <div className="group relative flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 overflow-hidden">
      {/* Thumbnail Banner */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        {/* Badges Overlay */}
        <div className="absolute top-3 right-3 left-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-950/80 text-slate-200 border border-slate-800/80 backdrop-blur-sm">
            {course.category}
          </span>
          {getStatusBadge()}
        </div>

        {/* Play Icon Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-950/40 backdrop-blur-[2px]">
          <div className="w-14 h-14 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/40 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <PlayCircle className="w-8 h-8 fill-slate-950 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* Title & Subtitle */}
          <Link href={`/courses/${course.id}`} className="block">
            <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug mb-2">
              {course.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {course.subtitle}
          </p>

          {/* Instructor Row */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 text-xs">
            <div className="flex items-center gap-2.5">
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-slate-200">{course.instructor.name}</span>
                <span className="text-[10px] text-slate-400 line-clamp-1">{course.instructor.title}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{course.instructor.rating}</span>
            </div>
          </div>
        </div>

        {/* Progress & Metadata */}
        <div className="pt-4 mt-2">
          {/* Progress Bar (Always visible or conditional) */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-1.5">
              <span>نسبة الإنجاز</span>
              <span className={course.progressPercentage > 0 ? "text-amber-400 font-bold" : "text-slate-500"}>
                {course.progressPercentage}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isCompleted
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                    : "bg-gradient-to-r from-amber-500 to-orange-500"
                }`}
                style={{ width: `${course.progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Details (Duration & Lessons) */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{course.totalDuration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>{course.totalLessons} درس</span>
            </div>
          </div>

          {/* Action Button */}
          <Link
            href={`/courses/${course.id}`}
            className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-md ${
              isCompleted
                ? "bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 hover:shadow-emerald-500/20"
                : isInProgress
                ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold hover:shadow-amber-500/20"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80"
            }`}
          >
            <span>{getButtonText()}</span>
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
