import { BackendCurriculumRequestType } from "@/types";
import { systemInstruction } from "./curriculumPrompt";
import { model } from "../setup";

export type curriculumDataType = {
  courseId: number;
  name: string;
  age: number | string;
  gradeLevel: number | string;
  learningPace: "Fast" | "Slow" | "I don't know";
  schoolLevel: "high school" | "middle school";
  gender: string;
  country: string;
  subject: string;
};

const chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [{ text: systemInstruction }],
    },
  ],
});

const curriculumPrompt = (props: curriculumDataType) => {
  return `${props.name} is a ${props.gender} ${props.age} year old ${props.learningPace} learner from ${props.country} in grade ${props.gradeLevel} and in 
 ${props.schoolLevel}. ${props.name} wants to learn "${props.subject}", generate a personalized curriculum with a course_obj of
 "${props.courseId}" for ${props.name}.
`;
};

export const handleGenerateCurriculum = async (props: curriculumDataType) => {
  const prompt = curriculumPrompt(props);
  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  const responseJson = JSON.parse(response.text());

  return responseJson as BackendCurriculumRequestType[];
};
