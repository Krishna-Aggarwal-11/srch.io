import React from "react";
import Wrapper from "./Wrapper";
import Skeleton from './Skeleton';
import { FaBookReader } from "react-icons/fa";
import Markdown from "react-markdown"

const Answer = ({ markdown, sources }) => {
  return (
    <Wrapper
      title={
        <>
          <FaBookReader /> Answer
        </>
      }
      content={
        markdown ? (
          <div className="prose prose-sm max-w-full">
            <Markdown >{markdown}</Markdown>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Skeleton className="max-w-sm h-4 bg-zinc-200"></Skeleton>
            <Skeleton className="max-w-lg h-4 bg-zinc-200"></Skeleton>
            <Skeleton className="max-w-2xl h-4 bg-zinc-200"></Skeleton>
            <Skeleton className="max-w-lg h-4 bg-zinc-200"></Skeleton>
            <Skeleton className="max-w-xl h-4 bg-zinc-200"></Skeleton>
          </div>
        )
      }
    ></Wrapper>
  );
};

export default Answer;
