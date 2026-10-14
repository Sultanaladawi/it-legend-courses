export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  isCompleted: boolean;
  isLocked?: boolean;
  order: number;
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface CourseMaterial {
  id: string;
  title: string;
  fileType: "pdf" | "zip" | "doc";
  fileSize: string;
  fileUrl: string;
}

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Exam {
  id: string;
  title: string;
  durationMinutes: number;
  totalQuestions: number;
  passingScore: number;
  questions: ExamQuestion[];
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  role: string;
  content: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  points: number;
  completedLessons: number;
  isCurrentUser?: boolean;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  instructor: {
    name: string;
    title: string;
    avatar: string;
    rating: number;
    studentsCount: number;
  };
  thumbnail: string;
  progressPercentage: number;
  status: "not_started" | "in_progress" | "completed";
  category: string;
  totalDuration: string;
  totalLessons: number;
  description: string;
  chapters: Chapter[];
  materials: CourseMaterial[];
  exam: Exam;
  comments: Comment[];
  leaderboard: LeaderboardUser[];
}
