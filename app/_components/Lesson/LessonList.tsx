"use client";
import { FaCheckCircle, FaPlayCircle } from "react-icons/fa";
import { getLessonCompletionPercentage } from "@/helpers/helper";
import { SubjectLessonType } from "@/types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";

const LessonList = ({
  sectionTitle,
  lessons,
  courseTitle,
  courseId,
  section_title,
}: {
  sectionTitle: string;
  section_title?: string;
  lessons: SubjectLessonType[];
  lastLessonLearnt?: string;
  courseId: number;
  courseTitle: string;
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen((open) => !open)}
      className="w-full p-6 transition border-2 border-main hover:bg-main/20 rounded-md duration-300 overflow-hidden"
    >
      <div>
        <div className="flex justify-between cursor-pointer">
          <h3 className="font-semibold leading-normal uppercase md:text-lg ">
            {section_title ?? sectionTitle}
          </h3>
          <div className="flex items-center h-full justify-center gap-2">
            <span>{getLessonCompletionPercentage(lessons)}</span>
            <button type="button" title="collapse">
              <IoIosArrowDropdownCircle
                size={30}
                className={`transition duration-300 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* list */}
        <div
          className={`flex flex-col gap-4  transition-all duration-300 ${
            open ? "h-auto mt-4 opacity-100" : "max-h-0 mt-0 opacity-0"
          }`}
        >
          {lessons.map((lesson) => (
            <div
              key={lesson.title}
              className="bg-altTxt rounded-md p-1 py-3 my-2 text-white flex justify-between px-4"
            >
              <span>{lesson.title}</span>
              <div className="flex items-center gap-3">
                <FaPlayCircle
                  onClick={() => {
                    const checkIsComplete =
                      lesson.isLessonCompleted || lesson.isLesson_completed
                        ? "complete"
                        : "notComplete";
                    router.push(
                      // PARAMETER ORDER: courseTitle, lessonToLearn, Subject, currentLessonId, courseId, isLesson_completed
                      `/learn/class?courseTitle=${courseTitle}&lesson=${
                        lesson.title
                      }&subject=${section_title ?? sectionTitle}&lessonId=${
                        lesson.id
                      }&courseId=${courseId}&isComplete=${checkIsComplete}`
                    );
                  }}
                  size={25}
                  className="cursor-pointer"
                />
                {lesson.isLessonCompleted ||
                  (lesson.isLesson_completed && (
                    <FaCheckCircle size={25} color="lightgreen" />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonList;
