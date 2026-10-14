"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Play,
  CheckCircle2,
  Circle,
  Lock,
  Clock,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Chapter, Lesson } from "@/types/course";

interface PlaylistSidebarProps {
  chapters: Chapter[];
  activeLessonId: string;
  onSelectLesson: (lesson: Lesson) => void;
  onToggleLessonComplete: (lessonId: string) => void;
}

export function PlaylistSidebar({
  chapters,
  activeLessonId,
  onSelectLesson,
  onToggleLessonComplete,
}: PlaylistSidebarProps) {
  // By default, open all chapters or the one containing active lesson
  const [openChapterIds, setOpenChapterIds] = useState<string[]>(() =>
    chapters.map((c) => c.id)
  );

  const toggleChapter = (chapterId: string) => {
    setOpenChapterIds((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const totalLessons = chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
  const completedLessons = chapters.reduce(
    (acc, ch) => acc + ch.lessons.filter((l) => l.isCompleted).length,
    0
  );
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <aside className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col shadow-xl overflow-hidden">
      {/* Sidebar Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-white text-base">محتوى الكورس</h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
            {completedLessons} / {totalLessons} مكتمل
          </span>
        </div>

        {/* Course Progress */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
            <span>نسبة إتمام المسار</span>
            <span className="text-amber-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Chapters & Lessons Accordion List */}
      <div className="flex-1 overflow-y-auto max-h-[580px] p-2 space-y-2">
        {chapters.map((chapter, chIdx) => {
          const isOpen = openChapterIds.includes(chapter.id);
          const chCompleted = chapter.lessons.filter((l) => l.isCompleted).length;

          return (
            <div
              key={chapter.id}
              className="rounded-xl border border-slate-800/80 bg-slate-950/40 overflow-hidden transition-all"
            >
              {/* Chapter Header Toggle */}
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full p-3.5 text-right flex items-center justify-between hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex-1 pr-1">
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
                    <span>الفصل {chIdx + 1}</span>
                    <span>•</span>
                    <span className="text-slate-400">
                      {chCompleted} / {chapter.lessons.length} دروس
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">
                    {chapter.title}
                  </h4>
                </div>

                <div className="p-1 rounded-lg text-slate-400 hover:text-white">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Lessons List inside Chapter */}
              {isOpen && (
                <div className="border-t border-slate-800/60 divide-y divide-slate-800/40 bg-slate-900/30">
                  {chapter.lessons.map((lesson) => {
                    const isActive = lesson.id === activeLessonId;
                    const isLocked = lesson.isLocked;

                    return (
                      <div
                        key={lesson.id}
                        className={`group relative flex items-center justify-between p-3 transition-all ${
                          isActive
                            ? "bg-amber-500/15 border-r-4 border-amber-400 text-white"
                            : "hover:bg-slate-800/40 text-slate-300"
                        } ${isLocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        {/* Completion Checkbox Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isLocked) onToggleLessonComplete(lesson.id);
                          }}
                          className="shrink-0 p-1 text-slate-500 hover:text-amber-400 transition-colors ml-2"
                          title={lesson.isCompleted ? "إلغاء التحديد" : "تحديد كمكتمل"}
                        >
                          {lesson.isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600 hover:text-amber-400" />
                          )}
                        </button>

                        {/* Lesson Title & Click to Play */}
                        <div
                          onClick={() => {
                            if (!isLocked) onSelectLesson(lesson);
                          }}
                          className="flex-1 pr-1 text-right flex flex-col"
                        >
                          <div className="flex items-center gap-2">
                            {isActive && (
                              <div className="flex items-center gap-0.5">
                                <span className="w-1 h-3 bg-amber-400 rounded-full animate-bounce" />
                                <span className="w-1 h-4 bg-amber-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                                <span className="w-1 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                              </div>
                            )}
                            <span
                              className={`text-xs font-semibold line-clamp-1 ${
                                isActive ? "text-amber-300 font-bold" : "text-slate-200"
                              }`}
                            >
                              {lesson.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3" />
                              {lesson.duration}
                            </span>
                          </div>
                        </div>

                        {/* Status Icon */}
                        <div className="shrink-0 pl-1">
                          {isLocked ? (
                            <Lock className="w-4 h-4 text-slate-600" />
                          ) : isActive ? (
                            <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/30">
                              <Play className="w-3 h-3 fill-slate-950 mr-0.5" />
                            </span>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
