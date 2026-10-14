import Link from "next/link";
import { Globe, Heart, Code2, Sparkles, BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#070b19] text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Platform Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <span className="font-black text-lg text-white tracking-tighter">IT</span>
              </div>
              <span className="font-extrabold text-lg text-white">IT LEGEND PLATFORM</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md mb-6">
              منصة تعليمية متطورة تهدف لبناء وتأهيل مهندسي البرمجيات في العالم العربي وفق أعلى معايير الجودة العالمية
              من خلال تجارب تعليمية تفاعلية ومشاريع حقيقية.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://itlegend.net"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-amber-500/40 hover:bg-slate-800 transition-all"
              >
                <Globe className="w-4 h-4 text-amber-400" />
                <span>الموقع الرسمي</span>
              </a>
              <span className="px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-emerald-400 font-mono">
                v2.0 Turbo
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">مسارات التعلم</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  تطوير واجهات المستخدم (Frontend)
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  الأنظمة وهندسة البرمجيات (.NET & Clean Arch)
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  الأمن السيبراني وحماية التطبيقات
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  إدارة قواعد البيانات والـ Performance Tuning
                </Link>
              </li>
            </ul>
          </div>

          {/* Challenge Note */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">تحدي التوظيف</h4>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Code2 className="w-4 h-4" />
                <span>IT Legend Frontend Challenge</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                تم تنفيذ هذا المشروع لتقييم مهارات الواجهات الأمامية باستخدام Next.js App Router، TypeScript، Tailwind CSS مع مراعاة تفاصيل وتجربة المستخدم التفاعلية.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 IT Legend. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>تم التطوير بكل</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline mx-0.5" />
            <span>بواسطة م. سلطان العدوي</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
