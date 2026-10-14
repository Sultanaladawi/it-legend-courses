"use client";

import { useState } from "react";
import {
  BookOpen,
  FileText,
  Award,
  MessageSquare,
  Trophy,
  ThumbsUp,
  Download,
  Eye,
  PlusCircle,
  CheckCircle,
  Star,
  Users,
  Flame,
  Send,
} from "lucide-react";
import { Course, CourseMaterial, Comment, LeaderboardUser } from "@/types/course";

interface CourseTabsProps {
  course: Course;
  comments: Comment[];
  onOpenPdfModal: (material: CourseMaterial) => void;
  onOpenExamModal: () => void;
  onOpenAskQuestionModal: () => void;
  onAddComment: (comment: Comment) => void;
}

export function CourseTabs({
  course,
  comments,
  onOpenPdfModal,
  onOpenExamModal,
  onOpenAskQuestionModal,
  onAddComment,
}: CourseTabsProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "materials" | "exam" | "comments" | "leaderboard"
  >("overview");

  // Local likes tracking
  const [likesState, setLikesState] = useState<Record<string, { count: number; userLiked: boolean }>>(() => {
    const initial: Record<string, { count: number; userLiked: boolean }> = {};
    course.comments.forEach((c) => {
      initial[c.id] = { count: c.likes, userLiked: false };
    });
    return initial;
  });

  // Fast inline reply state
  const [quickReplyText, setQuickReplyText] = useState("");

  const handleToggleLike = (commentId: string) => {
    setLikesState((prev) => {
      const current = prev[commentId] || { count: 0, userLiked: false };
      const nextLiked = !current.userLiked;
      return {
        ...prev,
        [commentId]: {
          count: nextLiked ? current.count + 1 : Math.max(current.count - 1, 0),
          userLiked: nextLiked,
        },
      };
    });
  };

  const handlePostQuickComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickReplyText.trim()) return;

    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      authorName: "سلطان العدوي",
      authorAvatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
      role: "طالب نشط",
      content: quickReplyText.trim(),
      createdAt: "الآن",
      likes: 0,
      replies: [],
    };

    onAddComment(newComment);
    setQuickReplyText("");
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden mt-6">
      {/* Tabs Header Navigation */}
      <div className="flex items-center gap-1 p-2 sm:p-3 border-b border-slate-800 bg-slate-950/70 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-amber-500 text-slate-950 shadow-md"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>نظرة عامة</span>
        </button>

        <button
          onClick={() => setActiveTab("materials")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === "materials"
              ? "bg-amber-500 text-slate-950 shadow-md"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>المواد والملحقات ({course.materials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("exam")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === "exam"
              ? "bg-amber-500 text-slate-950 shadow-md"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>الامتحان والتقييم</span>
        </button>

        <button
          onClick={() => setActiveTab("comments")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === "comments"
              ? "bg-amber-500 text-slate-950 shadow-md"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>الأسئلة والنقاشات ({comments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === "leaderboard"
              ? "bg-amber-500 text-slate-950 shadow-md"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>المتصدرون</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-4 sm:p-6">
        {/* 1. OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white mb-2">{course.title}</h2>
              <p className="text-slate-300 text-sm leading-relaxed">{course.description}</p>
            </div>

            {/* Instructor Bio Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-500/40"
                />
                <div>
                  <h4 className="font-bold text-white text-base">{course.instructor.name}</h4>
                  <p className="text-xs text-amber-400 mb-1">{course.instructor.title}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {course.instructor.rating} تقييم المدرب
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {course.instructor.studentsCount.toLocaleString()} طالب
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Features / What You Will Learn */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">تطبيق معايير Figma بدقة</h4>
                  <p className="text-xs text-slate-400">
                    تحويل التصاميم إلى كود نظيف وتفاعلي 100% متوافق مع الموبايل والتابلت والديسكتوب.
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">حفظ المسودات التلقائي</h4>
                  <p className="text-xs text-slate-400">
                    الاستفادة من localStorage للحفاظ على استفسارات الطلاب وحمايتها من الضياع.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. MATERIALS TAB */}
        {activeTab === "materials" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-white">المواد التعليمية والملحقات</h3>
                <p className="text-xs text-slate-400">
                  يمكنك استعراض مستندات الـ PDF مباشرة داخل المنصة أو تحميل الملفات الأصلية.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.materials.map((mat) => (
                <div
                  key={mat.id}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-1">{mat.title}</h4>
                      <span className="text-[11px] text-slate-400">
                        {mat.fileType.toUpperCase()} • {mat.fileSize}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View PDF Modal Button (Figma Requirement) */}
                    <button
                      onClick={() => onOpenPdfModal(mat)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>عرض</span>
                    </button>

                    {/* Direct Download */}
                    <a
                      href={mat.fileUrl}
                      download
                      className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors"
                      title="تحميل الملف"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. EXAM TAB */}
        {activeTab === "exam" && (
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-amber-500/20 text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-white mb-2">{course.exam.title}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              اختبر مستواك ومعلوماتك البرمجية في هذا الكورس. عند اجتياز الاختبار بنسبة نجاح{" "}
              <strong className="text-amber-400 font-bold">{course.exam.passingScore}%</strong> أو أعلى،
              ستحصل على شهادة إتمام معتمدة ونقاط إضافية في لوحة المتصدرين.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="block text-slate-500 text-xs">عدد الأسئلة</span>
                <span className="text-base font-bold text-white">{course.exam.totalQuestions} أسئلة</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="block text-slate-500 text-xs">المدة المقدرة</span>
                <span className="text-base font-bold text-white">{course.exam.durationMinutes} دقيقة</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="block text-slate-500 text-xs">درجة النجاح</span>
                <span className="text-base font-bold text-emerald-400">{course.exam.passingScore}%</span>
              </div>
            </div>

            <button
              onClick={onOpenExamModal}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all hover:scale-105 mx-auto"
            >
              <Award className="w-5 h-5" />
              <span>بدء الاختبار التفاعلي الآن</span>
            </button>
          </div>
        )}

        {/* 4. COMMENTS & Q&A TAB */}
        {activeTab === "comments" && (
          <div className="space-y-6">
            {/* Top Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">الأسئلة والنقاشات الأكاديمية</h3>
                <p className="text-xs text-slate-400">
                  اطرح استفسارك البرمجي وتفاعل مع المدرب وزملائك الطلاب.
                </p>
              </div>

              {/* Ask Question Trigger Button (Figma Requirement with Auto-drafting) */}
              <button
                onClick={onOpenAskQuestionModal}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>اطرح سؤالاً جديداً (حفظ تلقائي)</span>
              </button>
            </div>

            {/* Quick Comment Bar */}
            <form onSubmit={handlePostQuickComment} className="flex gap-2">
              <input
                type="text"
                value={quickReplyText}
                onChange={(e) => setQuickReplyText(e.target.value)}
                placeholder="أضف تعليقاً سريعاً أو استفساراً..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40"
              />
              <button
                type="submit"
                disabled={!quickReplyText.trim()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال</span>
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => {
                const likeInfo = likesState[comment.id] || { count: comment.likes, userLiked: false };

                return (
                  <div
                    key={comment.id}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 transition-all space-y-3"
                  >
                    {/* Author Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={comment.authorAvatar}
                          alt={comment.authorName}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-700"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-white">
                              {comment.authorName}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-amber-400 font-medium">
                              {comment.role}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500">{comment.createdAt}</span>
                        </div>
                      </div>

                      {/* Like button */}
                      <button
                        onClick={() => handleToggleLike(comment.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          likeInfo.userLiked
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                            : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{likeInfo.count}</span>
                      </button>
                    </div>

                    {/* Content */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {comment.content}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. LEADERBOARD TAB */}
        {activeTab === "leaderboard" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span>لوحة شرف الدورة (Top Learners)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  ترتيب الطلاب حسب مجموع النقاط والدروس المكتملة والاختبارات المنجزة.
                </p>
              </div>
            </div>

            {/* Leaderboard Table / Cards */}
            <div className="space-y-2.5">
              {course.leaderboard.map((user) => {
                const isFirst = user.rank === 1;
                const isSecond = user.rank === 2;
                const isThird = user.rank === 3;

                return (
                  <div
                    key={user.rank}
                    className={`p-3.5 sm:p-4 rounded-xl border flex items-center justify-between transition-all ${
                      user.isCurrentUser
                        ? "bg-amber-500/10 border-amber-500/40 shadow-md ring-1 ring-amber-500/30"
                        : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Rank badge */}
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                          isFirst
                            ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                            : isSecond
                            ? "bg-slate-300 text-slate-950"
                            : isThird
                            ? "bg-amber-700 text-white"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {user.rank}
                      </div>

                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700"
                      />

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-white">{user.name}</span>
                          {user.isCurrentUser && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold">
                              أنت
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          أتم {user.completedLessons} درساً
                        </span>
                      </div>
                    </div>

                    {/* Points counter */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 font-mono font-bold text-xs">
                      <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span>{user.points.toLocaleString()} XP</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
