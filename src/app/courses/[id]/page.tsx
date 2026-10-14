import { notFound } from "next/navigation";
import { mockCourses } from "@/data/mockData";
import { CoursePlayerClient } from "@/components/player/CoursePlayerClient";
import type { Metadata } from "next";

interface CoursePageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return mockCourses.map((course) => ({
    id: course.id,
  }));
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { id } = await params;
  const course = mockCourses.find((c) => c.id === id);

  if (!course) {
    return {
      title: "الكورس غير متوفر | IT Legend",
    };
  }

  return {
    title: `${course.title} | IT Legend Player`,
    description: course.subtitle,
  };
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { id } = await params;
  const course = mockCourses.find((c) => c.id === id);

  if (!course) {
    notFound();
  }

  return <CoursePlayerClient course={course} />;
}
