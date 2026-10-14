"use client";

import { useState, useEffect } from "react";
import { X, Send, Save, AlertCircle, HelpCircle } from "lucide-react";
import { Comment } from "@/types/course";

interface AskQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newComment: Comment) => void;
  courseId: string;
}

const DRAFT_STORAGE_KEY = (id: string) => `itlegend_draft_question_${id}`;

export function AskQuestionModal({
  isOpen,
  onClose,
  onSubmit,
  courseId,
}: AskQuestionModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("سلطان العدوي");
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Load draft from localStorage when opening modal
  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      try {
        const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY(courseId));
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (parsed.title) setTitle(parsed.title);
          if (parsed.content) setContent(parsed.content);
          if (parsed.savedAt) setLastSaved(parsed.savedAt);
        }
      } catch (e) {
        console.error("Error reading question draft:", e);
      }
    }
  }, [isOpen, courseId]);

  // Auto-save draft on every keystroke
  useEffect(() => {
    if (typeof window === "undefined" || !isOpen) return;

    if (title.trim() || content.trim()) {
      const nowStr = new Date().toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const draftPayload = {
        title,
        content,
        savedAt: nowStr,
      };
      localStorage.setItem(
        DRAFT_STORAGE_KEY(courseId),
        JSON.stringify(draftPayload)
      );
      setLastSaved(nowStr);
    }
  }, [title, content, courseId, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const fullContent = title.trim()
      ? `**${title.trim()}**\n\n${content.trim()}`
      : content.trim();

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      authorName: authorName.trim() || "طالب مجهول",
      authorAvatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
      role: "طالب نشط",
      content: fullContent,
      createdAt: "الآن",
      likes: 0,
      replies: [],
    };

    onSubmit(newComment);

    // Clear draft from localStorage
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY(courseId));
    } catch (e) {
      console.error(e);
    }

    setTitle("");
    setContent("");
    setLastSaved(null);
    onClose();
  };

  const handleDiscard = () => {
    if (confirm("هل تريد إفراغ المسودة وإغلاق النافذة؟")) {
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY(courseId));
      } catch (e) {
        console.error(e);
      }
      setTitle("");
      setContent("");
      setLastSaved(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2 text-white">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">طرح سؤال أو استفسار جديد</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Autosave notification bar */}
          <div className="flex items-center justify-between text-xs px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400">
            <div className="flex items-center gap-1.5">
              <Save className="w-3.5 h-3.5 text-emerald-400" />
              <span>ميزة الحفظ التلقائي للمسودة (Auto-Draft)</span>
            </div>
            {lastSaved ? (
              <span className="text-emerald-400 font-medium">
                تم الحفظ في المتصفح ({lastSaved})
              </span>
            ) : (
              <span className="text-slate-500">اكتب وسيتم الحفظ تلقائياً</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              عنوان الاستفسار (مختصر)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: استفسار بخصوص طريقة تطبيق الـ Sticky Video..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              تفاصيل السؤال أو المشكلة البرمجية *
            </label>
            <textarea
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اشرح مشكلتك أو استفسارك بالتفصيل... (حتى لو أغلقت النافذة بالخطأ، سيتم استرجاع النص تلقائياً)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all resize-none"
            />
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>سيظهر سؤالك للمحاضر والطلاب في تبويب الأسئلة والنقاشات.</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleDiscard}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              إلغاء وإفراغ المسودة
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                إغلاق مؤقت
              </button>
              <button
                type="submit"
                disabled={!content.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>نشر السؤال الآن</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
