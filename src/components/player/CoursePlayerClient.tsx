"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Course, Lesson, CourseMaterial, Comment } from "@/types/course";
import { VideoPlayer } from "./VideoPlayer";
import { PlaylistSidebar } from "./PlaylistSidebar";
import { CourseTabs } from "./CourseTabs";
import { AskQuestionModal } from "./Modals/AskQuestionModal";
import { PdfViewerModal } from "./Modals/PdfViewerModal";
import { ExamModal } from "./Modals/ExamModal";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  BookOpen,
  Share2,
  Bookmark,
  CheckCircle,
  HelpCircle,
  Award,
} from "lucide-react";

interface CoursePlayerClientProps {
  course: Course;
}

export function CoursePlayerClient({ course }: CoursePlayerClientProps) {
  // Flatten all lessons across chapters to easily navigate Prev / Next
  const allLessons = useMemo(() => {
    return course.chapters.flatMap((ch) => ch.lessons);
  }, [course.chapters]);

  // Active Lesson state
  const [activeLesson, setActiveLesson] = useState<Lesson>(() => {
    // Default to first incomplete lesson or simply first lesson
    return allLessons.find((l) => !l.isCompleted) || allLessons[0];
  });

  // Dynamic chapters state to allow real-time completion toggling
  const [chapters, setChapters] = useState(course.chapters);

  // Comments state to allow adding questions/replies
  const [comments, setComments] = useState<Comment[]>(course.comments);

  // Wide / Theater Mode (Figma Requirement)
  const [isWideMode, setIsWideMode] = useState(false);

  // Modals state
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<CourseMaterial | null>(null);

  // Bookmark / Favorite state
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Lesson Navigation: Prev / Next
  const currentIndex = allLessons.findIndex((l) => l.id === activeLesson.id);
  const hasPrevLesson = currentIndex > 0;
  const hasNextLesson = currentIndex < allLessons.length - 1;

  const handlePrevLesson = () => {
    if (hasPrevLesson) {
      setActiveLesson(allLessons[currentIndex - 1]);
    }
  };

  const handleNextLesson = () => {
    if (hasNextLesson) {
      setActiveLesson(allLessons[currentIndex + 1]);
    }
  };

  // Toggle completion of a lesson
  const handleToggleLessonComplete = (lessonId: string) => {
    setChapters((prevChapters) =>
      prevChapters.map((ch) => ({
        ...ch,
        lessons: ch.lessons.map((l) =>
          l.id === lessonId ? { ...l, isCompleted: !l.isCompleted } : l
        ),
      }))
    );

    if (activeLesson.id === lessonId) {
      setActiveLesson((prev) => ({ ...prev, isCompleted: !prev.isCompleted }));
    }
  };

  // Open PDF viewer modal
  const handleOpenPdfModal = (material: CourseMaterial) => {
    setSelectedMaterial(material);
    setIsPdfModalOpen(true);
  };

  // Add new comment from AskQuestionModal
  const handleAddComment = (newComment: Comment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  // Share link handler
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 pb-16">
      {/* Top Breadcrumbs & Utility Bar */}
      <div className="border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-sm sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between text-xs">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-slate-400 overflow-x-auto scrollbar-none">
            <Link href="/" className="hover:text-white flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>الرئيسية</span>
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-600" />
            <Link href="/" className="hover:text-white line-clamp-1">
              الدورات
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-200 font-semibold line-clamp-1 max-w-[150px] sm:max-w-[280px]">
              {course.title}
            </span>
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isBookmarked
                  ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
              title="حفظ في المفضلة"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              title="نسخ الرابط"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{copiedLink ? "تم النسخ!" : "مشاركة"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Player Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {/* Layout Mode: Wide vs Normal */}
        {isWideMode ? (
          /* WIDE / THEATER MODE: Video spans full width, Sidebar placed below */
          <div className="space-y-6">
            <div className="w-full">
              <VideoPlayer
                lesson={activeLesson}
                courseTitle={course.title}
                isWideMode={true}
                onToggleWideMode={() => setIsWideMode(false)}
                onNextLesson={handleNextLesson}
                onPrevLesson={handlePrevLesson}
                hasNextLesson={hasNextLesson}
                hasPrevLesson={hasPrevLesson}
                onToggleComplete={handleToggleLessonComplete}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CourseTabs
                  course={course}
                  comments={comments}
                  onOpenPdfModal={handleOpenPdfModal}
                  onOpenExamModal={() => setIsExamModalOpen(true)}
                  onOpenAskQuestionModal={() => setIsAskModalOpen(true)}
                  onAddComment={handleAddComment}
                />
              </div>
              <div className="lg:col-span-1">
                <PlaylistSidebar
                  chapters={chapters}
                  activeLessonId={activeLesson.id}
                  onSelectLesson={setActiveLesson}
                  onToggleLessonComplete={handleToggleLessonComplete}
                />
              </div>
            </div>
          </div>
        ) : (
          /* NORMAL 2-COLUMN MODE (Figma Standard Desktop Layout) */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left 2 Cols (in RTL, Video & Tabs) */}
            <div className="lg:col-span-2 space-y-4">
              {/* Sticky Video Container on Mobile (< md) */}
              <div className="sticky top-28 z-30 sm:static sm:top-auto sm:z-auto bg-[#070b19] pb-2 sm:pb-0">
                <VideoPlayer
                  lesson={activeLesson}
                  courseTitle={course.title}
                  isWideMode={false}
                  onToggleWideMode={() => setIsWideMode(true)}
                  onNextLesson={handleNextLesson}
                  onPrevLesson={handlePrevLesson}
                  hasNextLesson={hasNextLesson}
                  hasPrevLesson={hasPrevLesson}
                  onToggleComplete={handleToggleLessonComplete}
                />
              </div>

              {/* Tabs Section: Overview, Materials, Exam, Comments, Leaderboard */}
              <CourseTabs
                course={course}
                comments={comments}
                onOpenPdfModal={handleOpenPdfModal}
                onOpenExamModal={() => setIsExamModalOpen(true)}
                onOpenAskQuestionModal={() => setIsAskModalOpen(true)}
                onAddComment={handleAddComment}
              />
            </div>

            {/* Right 1 Col: Curriculum Sidebar */}
            <div className="lg:col-span-1 lg:sticky lg:top-32">
              <PlaylistSidebar
                chapters={chapters}
                activeLessonId={activeLesson.id}
                onSelectLesson={setActiveLesson}
                onToggleLessonComplete={handleToggleLessonComplete}
              />
            </div>
          </div>
        )}
      </div>

      {/* Interactive Modals */}
      <AskQuestionModal
        isOpen={isAskModalOpen}
        onClose={() => setIsAskModalOpen(false)}
        onSubmit={handleAddComment}
        courseId={course.id}
      />

      <PdfViewerModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        material={selectedMaterial}
      />

      <ExamModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        exam={course.exam}
        onExamPassed={() => {
          // If student passed, celebrate and mark in progress
          alert("أحسنت! تم تسجيل اجتيازك للاختبار بنجاح.");
        }}
      />
    </div>
  );
}
