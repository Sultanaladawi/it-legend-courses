"use client";

import { useState } from "react";
import { X, Download, ZoomIn, ZoomOut, RotateCw, FileText, ChevronRight, ChevronLeft, ExternalLink } from "lucide-react";
import { CourseMaterial } from "@/types/course";

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: CourseMaterial | null;
}

export function PdfViewerModal({ isOpen, onClose, material }: PdfViewerModalProps) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  if (!isOpen || !material) return null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 15, 160));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 15, 70));
  const handleResetZoom = () => setZoomLevel(100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Control Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white line-clamp-1">
                {material.title}
              </h3>
              <span className="text-[11px] text-slate-400">
                حجم الملف: {material.fileSize} • صيغة PDF تفاعلية
              </span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs text-slate-300">
              <button
                onClick={handleZoomOut}
                className="p-1 hover:text-white hover:bg-slate-800 rounded"
                title="تصغير"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="px-2 py-0.5 hover:text-white hover:bg-slate-800 rounded font-mono"
              >
                {zoomLevel}%
              </button>
              <button
                onClick={handleZoomIn}
                className="p-1 hover:text-white hover:bg-slate-800 rounded"
                title="تكبير"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="p-0.5 disabled:opacity-40 hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="font-medium">
                صفحة {currentPage} من {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="p-0.5 disabled:opacity-40 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Download Button */}
            <a
              href={material.fileUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">تحميل المستند</span>
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Content Simulation / Viewer */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 bg-[#0b101f] flex justify-center items-start">
          <div
            className="w-full max-w-2xl bg-white text-slate-900 rounded-xl shadow-2xl p-8 sm:p-12 transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
          >
            {/* Simulated Document Header */}
            <div className="border-b-2 border-slate-800 pb-4 mb-6 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-600 font-extrabold">
                  IT Legend Official Material
                </span>
                <h1 className="text-xl font-black text-slate-900 mt-1">{material.title}</h1>
              </div>
              <div className="text-right text-xs text-slate-500">
                <p>تاريخ النشر: أكتوبر 2026</p>
                <p>م. علي شاهين</p>
              </div>
            </div>

            {/* Simulated Content Based on Page */}
            {currentPage === 1 && (
              <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                <h2 className="text-base font-bold text-slate-900">1. ملخص المعمارية وهيكلة المشروع</h2>
                <p>
                  يركز هذا الدليل الفني على أفضل الممارسات المتبعة في منصات التعليم الرقمية التفاعلية الحديثة. تم بناء الكود وفق معايير <strong>Next.js 16 App Router</strong> مع دعم كامل للـ Server Components والـ Client Components لفصل طبقة العرض عن العمليات التفاعلية.
                </p>
                <div className="p-4 rounded-lg bg-slate-100 border-r-4 border-amber-500 font-mono text-xs text-slate-800">
                  📁 src/<br />
                  &nbsp;&nbsp;📁 app/courses/[id]/<br />
                  &nbsp;&nbsp;📁 components/player/ &nbsp;&nbsp;# مشغل الفيديو، التبويبات، القائمة الجانبية<br />
                  &nbsp;&nbsp;📁 types/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# تعريفات TypeScript الصارمة<br />
                  &nbsp;&nbsp;📁 data/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# بيانات المحاكاة الغنية (Mock Data)
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-4">المبادئ التوجيهية للواجهات:</h3>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600">
                  <li>استجابة كاملة (Mobile First) دون ظهور أي أشرطة تمرير أفقية (Zero Horizontal Scroll).</li>
                  <li>تثبيت الفيديو (Sticky Video) على شاشات الهواتف عند التمرير نحو الأسفل لضمان استمرارية المشاهدة.</li>
                  <li>حفظ مسودات استفسارات الطلاب محلياً (localStorage) لحمايتها من الضياع عند إغلاق النافذة أو انقطاع الاتصال.</li>
                </ul>
              </div>
            )}

            {currentPage === 2 && (
              <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                <h2 className="text-base font-bold text-slate-900">2. أبعاد وتناسق التصميم (Figma Token Specs)</h2>
                <p>
                  تم استخراج جميع قيم المسافات والألوان من ملف Figma الرسمي لضمان تطابق تام بالبكسل (Pixel-Faithful Design):
                </p>
                <table className="w-full text-xs text-right border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-300 p-2">العنصر</th>
                      <th className="border border-slate-300 p-2">القيمة في Tailwind</th>
                      <th className="border border-slate-300 p-2">الاستخدام</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-2 font-mono">Background</td>
                      <td className="border border-slate-300 p-2 font-mono">bg-[#070b19]</td>
                      <td className="border border-slate-300 p-2">الخلفية الداكنة العميقة للمنصة</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-mono">Primary Accent</td>
                      <td className="border border-slate-300 p-2 font-mono">amber-500 / amber-400</td>
                      <td className="border border-slate-300 p-2">أزرار الإجراء، النقاط، والروابط النشطة</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-mono">Surface Card</td>
                      <td className="border border-slate-300 p-2 font-mono">bg-slate-900</td>
                      <td className="border border-slate-300 p-2">بطاقات الكورسات، القوائم، والنوافذ المنبثقة</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-mono">Border Glow</td>
                      <td className="border border-slate-300 p-2 font-mono">border-slate-800</td>
                      <td className="border border-slate-300 p-2">الفواصل والحدود الدقيقة بين المكونات</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {currentPage >= 3 && (
              <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                <h2 className="text-base font-bold text-slate-900">
                  {currentPage === 3 ? "3. كود مشغل الفيديو والتحكم بالصوت والأبعاد" : currentPage === 4 ? "4. معايير إدارة الحالة والأداء (Performance Metrics)" : "5. خلاصة التحدي وروابط التسليم"}
                </h2>
                <p>
                  يحتوي هذا القسم على الملاحظات الإضافية والاختبارات الميدانية لضمان أعلى مؤشرات أداء (Core Web Vitals) مع سرعة تحميل فائقة ودعم كامل للشاشات المختلفة.
                </p>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                  💡 ملاحظة هامة: يمكنك دائماً تنزيل النسخة الأصلية الكاملة بصيغة PDF بالضغط على زر "تحميل المستند" في الشريط العلوي.
                </div>
              </div>
            )}

            {/* Simulated Document Footer */}
            <div className="mt-12 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
              <span>IT Legend Hiring Assessment • Confidential</span>
              <span>الصفحة {currentPage} من {totalPages}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
