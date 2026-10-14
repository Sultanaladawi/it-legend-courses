"use client";

import { useState, useEffect } from "react";
import { X, Award, CheckCircle2, XCircle, Clock, AlertTriangle, ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";
import { Exam } from "@/types/course";

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: Exam | null;
  onExamPassed?: () => void;
}

export function ExamModal({ isOpen, onClose, exam, onExamPassed }: ExamModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    if (isOpen && exam) {
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setIsSubmitted(false);
      setScore(0);
      setTimeLeft(exam.durationMinutes * 60);
    }
  }, [isOpen, exam]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || isSubmitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isSubmitted, timeLeft]);

  if (!isOpen || !exam || !exam.questions || exam.questions.length === 0) return null;

  const currentQ = exam.questions[currentQuestionIndex];
  const totalQuestions = exam.questions.length;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }));
  };

  const handleSubmitExam = () => {
    let correctCount = 0;
    exam.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const calculatedScore = Math.round((correctCount / totalQuestions) * 100);
    setScore(calculatedScore);
    setIsSubmitted(true);

    if (calculatedScore >= exam.passingScore && onExamPassed) {
      onExamPassed();
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
    setTimeLeft(exam.durationMinutes * 60);
    setScore(0);
  };

  const isPassed = score >= exam.passingScore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">{exam.title}</h3>
              <span className="text-xs text-slate-400">
                درجة النجاح المطلوبة: {exam.passingScore}% • {totalQuestions} أسئلة
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                  timeLeft < 120
                    ? "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse"
                    : "bg-slate-800 text-slate-200 border-slate-700"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimer(timeLeft)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isSubmitted ? (
            <div>
              {/* Question Progress bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>
                    السؤال <strong className="text-white">{currentQuestionIndex + 1}</strong> من{" "}
                    <strong>{totalQuestions}</strong>
                  </span>
                  <span>
                    تمت الإجابة:{" "}
                    <strong className="text-amber-400">
                      {Object.keys(selectedAnswers).length} / {totalQuestions}
                    </strong>
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mb-6">
                <h4 className="text-base font-bold text-white leading-relaxed">
                  {currentQ.question}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentQ.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-right p-4 rounded-xl text-sm font-medium transition-all flex items-center justify-between border ${
                        isSelected
                          ? "bg-amber-500/15 border-amber-500/60 text-white shadow-md shadow-amber-500/5 ring-1 ring-amber-500/50"
                          : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold border ${
                            isSelected
                              ? "bg-amber-500 text-slate-950 border-amber-400"
                              : "bg-slate-800 text-slate-400 border-slate-700"
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? "border-amber-400 bg-amber-400"
                            : "border-slate-600"
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="text-center py-6">
              <div
                className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                  isPassed
                    ? "bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/40"
                    : "bg-red-500/20 text-red-400 border-2 border-red-500/40"
                }`}
              >
                {isPassed ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
              </div>

              <h3 className="text-2xl font-black text-white mb-2">
                {isPassed ? "مبروك! لقد اجتزت الاختبار بنجاح 🎉" : "للأسف لم تتجاوز الاختبار هذه المرة"}
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                {isPassed
                  ? "تم تسجيل نتيجتك وإضافتها إلى رصيد نقاطك وسجل إنجازاتك في الدورة."
                  : `حصلت على ${score}% بينما درجة النجاح المطلوبة هي ${exam.passingScore}%. يمكنك مراجعة الدروس وإعادة المحاولة.`}
              </p>

              {/* Score pill */}
              <div className="inline-flex items-center gap-6 px-6 py-3 rounded-2xl bg-slate-950 border border-slate-800 mb-8">
                <div>
                  <span className="block text-xs text-slate-500">درجتك النهائية</span>
                  <span
                    className={`text-2xl font-black ${
                      isPassed ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {score}%
                  </span>
                </div>
                <div className="w-px h-8 bg-slate-800" />
                <div>
                  <span className="block text-xs text-slate-500">الإجابات الصحيحة</span>
                  <span className="text-2xl font-black text-white">
                    {
                      exam.questions.filter(
                        (q) => selectedAnswers[q.id] === q.correctAnswer
                      ).length
                    }{" "}
                    / {totalQuestions}
                  </span>
                </div>
              </div>

              {/* Question Review Accordion / List */}
              <div className="text-right space-y-3 mb-6 max-h-60 overflow-y-auto px-2">
                <h4 className="text-xs font-bold text-slate-400 mb-2">مراجعة الإجابات:</h4>
                {exam.questions.map((q, idx) => {
                  const userAnswer = selectedAnswers[q.id];
                  const isCorrect = userAnswer === q.correctAnswer;
                  return (
                    <div
                      key={q.id}
                      className={`p-3 rounded-xl border text-xs ${
                        isCorrect
                          ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-200"
                          : "bg-red-950/20 border-red-800/40 text-red-200"
                      }`}
                    >
                      <div className="font-semibold mb-1">
                        {idx + 1}. {q.question}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        إجابتك: {q.options[userAnswer] || "لم تتم الإجابة"} •{" "}
                        <span className="text-emerald-400 font-bold">
                          الصحيحة: {q.options[q.correctAnswer]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          {!isSubmitted ? (
            <>
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition-colors flex items-center gap-1"
              >
                <ArrowRight className="w-4 h-4" />
                <span>السؤال السابق</span>
              </button>

              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.min(prev + 1, totalQuestions - 1))}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-md shadow-amber-500/20"
                >
                  <span>السؤال التالي</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitExam}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تسليم الاختبار النهائي</span>
                </button>
              )}
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <button
                onClick={handleRetake}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-1.5 border border-slate-700"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة المحاولة</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm transition-colors"
              >
                إغلاق والعودة للدورة
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
