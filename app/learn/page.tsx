'use client';
import React, { useEffect } from 'react';
import TopicCard from '../_components/TopicCard';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/redux/store';
import {
  calculateCourseCompletion,
  curriculumCompletionPercentage,
} from '@/helpers/helper';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { getCourses } from '@/api/course';
import Loading from '../loading';
import Link from 'next/link';
import { BsArrowLeft } from 'react-icons/bs';

const Page = ({ params }: { params?: { newCourse: string } }) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const router = useRouter();
  const { courses, isLoading, combinedCourseAndCurriculumObject } = useSelector(
    (store: IRootState) => store.lesson
  );
  const { isLogged, authLoading } = useSelector(
    (store: IRootState) => store.user
  );

  console.log('NEW COURSE: ', params);
  useEffect(() => {
    isLogged ? dispatch(getCourses()) : null;
  }, [dispatch, isLogged]);

  return (
    <div className='relative min-h-screen gradient'>
      <section className='sticky top-0 min-h-[30vh] flex items-center justify-center p-5 gradient'>
        <div className='sticky top-0 min-h-[30vh] flex items-center justify-center p-5'>
          <h1 className=' text-mainTxt text-2xl lg:text-4xl font-bold text-center'>
            Ready to <span className='text-altTxt'>learn?</span>
          </h1>
        </div>
      </section>

      <section className='relative p-6 grid place-content-center bg-white min-h-[70vh]'>
        {!isLogged ? (
          <div className='flex w-full h-44 justify-center items-center mt-10'>
            <p className='max-w-screen-sm mx-auto text-center text-lg'>
              Hi there, you need to create an account so we can personalize
              your experience. please use the login button on the sidebar to
              continue.
            </p>
          </div>
        ) : isLoading || authLoading ? (
          <Loading />
        ) : (
          <div className='h-full w-full relative rounded-t-3xl flex flex-col gap-8 z-10 p-20 bg-white min-h-full'>
            <button
              className='px-5 font-bold py-1 violet-bg absolute text-white top-2 right-8 rounded-md'
              onClick={() => {
                !isLogged
                  ? router.push('/auth/login')
                  : router.push('/new-course');
              }}
            >
              New
            </button>
            {!courses || courses.length === 0 ? (
              <div className='flex flex-col gap-4 items-center'>
                <span>You haven&lsquo;t started learning any topics yet</span>
                <button
                  className='violet-bg text-white px-4 py-2 rounded-md'
                  onClick={() => {
                    !isLogged
                      ? router.push('/auth/login')
                      : router.push('/new-course');
                  }}
                >
                  Start Learning
                </button>
              </div>
            ) : (
              courses.map((course) => (
                <TopicCard
                  key={course.id}
                  subject={course.subject}
                  courseId={course.id}
                  numOfLessons={course.curriculum?.length ?? 0}
                  progressPercentage={calculateCourseCompletion(
                    course.id,
                    combinedCourseAndCurriculumObject
                  )}
                />
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Page;
