"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Maximize2,
  RotateCcw,
  SkipForward,
  SkipBack,
  CheckCircle,
  Settings,
} from "lucide-react";
import { Lesson } from "@/types/course";

interface VideoPlayerProps {
  lesson: Lesson;
  courseTitle: string;
  isWideMode: boolean;
  onToggleWideMode: () => void;
  onNextLesson?: () => void;
  onPrevLesson?: () => void;
  hasNextLesson: boolean;
  hasPrevLesson: boolean;
  onToggleComplete: (lessonId: string) => void;
}

export function VideoPlayer({
  lesson,
  courseTitle,
  isWideMode,
  onToggleWideMode,
  onNextLesson,
  onPrevLesson,
  hasNextLesson,
  hasPrevLesson,
  onToggleComplete,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset video when lesson changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(true);
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked by browser policy until user interaction
        setIsPlaying(false);
      });
    }
  }, [lesson.id, lesson.videoUrl]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleSpeedSelect = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setShowSpeedMenu(false);
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3500);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative w-full bg-black group select-none overflow-hidden transition-all duration-300 ${
        isWideMode ? "aspect-video md:aspect-[21/9]" : "aspect-video"
      } rounded-2xl shadow-2xl border border-slate-800`}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={lesson.videoUrl}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          onToggleComplete(lesson.id);
        }}
        playsInline
      />

      {/* Center Big Play Button (when paused) */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] cursor-pointer"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/50 transform hover:scale-110 transition-transform">
            <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-slate-950 ml-1" />
          </div>
        </div>
      )}

      {/* Top Banner on Hover: Current Lesson Title */}
      <div
        className={`absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <h2 className="text-xs sm:text-sm font-bold text-white drop-shadow truncate max-w-md">
            {lesson.title}
          </h2>
        </div>

        <button
          onClick={() => onToggleComplete(lesson.id)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
            lesson.isCompleted
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
              : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700"
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>{lesson.isCompleted ? "مكتمل" : "تحديد كمكتمل"}</span>
        </button>
      </div>

      {/* Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col gap-2 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Progress Bar Timeline */}
        <div className="relative w-full flex items-center group/scrubber cursor-pointer">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:h-2 transition-all"
          />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between text-white text-xs sm:text-sm">
          {/* Left / Player buttons (in RTL, left is visually start/end depending on flow) */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
            </button>

            {/* Skip Previous Lesson */}
            <button
              disabled={!hasPrevLesson}
              onClick={onPrevLesson}
              className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
              title="الدرس السابق"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Skip Next Lesson */}
            <button
              disabled={!hasNextLesson}
              onClick={onNextLesson}
              className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
              title="الدرس التالي"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-1.5 group/vol">
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-red-400" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-14 sm:w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400 hidden sm:block"
              />
            </div>

            {/* Time Stamp */}
            <span className="font-mono text-[11px] sm:text-xs text-slate-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right / Secondary actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Playback speed selector */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors font-mono"
              >
                {playbackRate}x
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-full mb-2 left-0 sm:right-0 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-1 z-50 text-xs flex flex-col min-w-[70px]">
                  {[0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleSpeedSelect(rate)}
                      className={`px-3 py-1.5 text-right hover:bg-slate-800 transition-colors ${
                        playbackRate === rate ? "text-amber-400 font-bold" : "text-slate-300"
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theater / Wide Mode Toggle (Figma Requirement) */}
            <button
              onClick={onToggleWideMode}
              className={`hidden md:flex p-1.5 rounded-lg hover:bg-white/10 transition-colors ${
                isWideMode ? "text-amber-400" : "text-slate-300"
              }`}
              title={isWideMode ? "الوضع الافتراضي" : "وضع المسرح (عرض واسع)"}
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title={isFullscreen ? "إنهاء ملء الشاشة" : "ملء الشاشة"}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
