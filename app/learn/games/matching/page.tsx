"use client";
import Draggable from "@/app/_components/dragAndDrop/draggable";
import { Droppable } from "@/app/_components/dragAndDrop/droppable";
import { dummyDragdDrop } from "@/game_utils/dragAndDrop/dummyData";
import { DragandDropType, DroppableItemType } from "@/types";
import { DndContext } from "@dnd-kit/core";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [matchedItems, setMatchedItems] = useState(0);
//   const [gameOver, setGameOver] = useState<>({ gameWon: false });
  const [feedback, setFeedback] = useState({ text: "", positive: false });
  const [answerDropBoxes, setAnswerDropBoxes] = useState<
    DroppableItemType[] | null
  >(dummyDragdDrop.droppableItems);

  const [dragAndDropItems, setDragAndDropItems] =
    useState<DragandDropType | null>(dummyDragdDrop);

  const handleCheckMatch = (answer: string, insertedAnswer: string) => {
    if (insertedAnswer === answer) {
      setFeedback({ text: "Correct! Great job.", positive: true });
    } else {
      setFeedback({ text: "Oops! You were close. Try again", positive: false });
    }
    setTimeout(() => {
      setFeedback({ text: "", positive: false });
    }, 2000);
  };

  useEffect(() => {
    if (matchedItems === dragAndDropItems?.length) {
    //   setGameOver(true);
    }
  }, []);

  const AnswerImagesArray: any =
    dragAndDropItems &&
    dragAndDropItems.draggableItems.map((img) => (
      <Draggable imgSrc={img.src} value={img.name} key={img.name} id={img.name}>
        <Image
          src={img.src}
          alt={img.name}
          width={100}
          height={100}
          className="object-fill"
        />
      </Draggable>
    ));
  return (
    <div className="flex flex-col justify-around gap-10 w-full py-10">
      <span>{dragAndDropItems?.instruction}</span>
      {feedback.text && (
        <span
          className={`${
            feedback.positive ? "text-green-600" : "text-rose-600"
          } font-semibold`}
        >
          {feedback.text}
        </span>
      )}
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex w-full gap-10">
          {answerDropBoxes &&
            answerDropBoxes.map((item) => (
              <Droppable key={item.id} className="flex flex-col" id={item.id}>
                <span className="text-sm text-rose-500 font-bold">
                  {item.feedback}
                </span>
                {item.insertedAnswer === item.answer ? (
                  <Image
                    src={item.answerImg}
                    alt={item.answer}
                    width={100}
                    height={100}
                    className="object-fill"
                  />
                ) : (
                  item.label
                )}
              </Droppable>
            ))}
        </div>

        <div className="flex gap-10"> {AnswerImagesArray}</div>
      </DndContext>
    </div>
  );
  function handleDragEnd(event: any) {
    console.log("ITEM DRAGGING: ", event);
    const updateObjectIndex =
      answerDropBoxes &&
      answerDropBoxes.findIndex((obj) => obj.id === event.over.id);

    if (
      updateObjectIndex !== null &&
      updateObjectIndex !== -1 &&
      answerDropBoxes
    ) {
      // Check if object found
      const updatedArray = [
        ...answerDropBoxes.slice(0, updateObjectIndex),
        {
          ...answerDropBoxes[updateObjectIndex],
          insertedAnswer: event.active.data.current.value,
          answerImg: event.active.data.current.imgSrc,
        },
        ...answerDropBoxes.slice(updateObjectIndex + 1),
      ];
      handleCheckMatch(
        answerDropBoxes[updateObjectIndex].answer,
        event.active.data.current.value
      );
      setAnswerDropBoxes(updatedArray);
    }
    // console.log("NEW ARRAY: ", updateObjectIndex);
  }
};

export default Page;
