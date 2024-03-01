import React from 'react'
import Wrapper from './Wrapper';
import PreQuery from './PreQuery.jsx';
import { MdMessage } from "react-icons/md";
const RelatedQuestion = ({relates}) => {
  return (
    <Wrapper
      title={
        <>
          <MdMessage/> Related
        </>
      }
      content={
        <div className="flex gap-2 flex-col">
          {relates !== null ? (
            relates.length > 0 ? (
              relates.map(({ question }) => (
                <PreQuery key={question} query={question}></PreQuery>
              ))
            ) : (
              <div className="text-sm">No related questions.</div>
            )
          ) : (
            <>
             <Skeleton className="w-full h-5 bg-zinc-200/80"></Skeleton>
              <Skeleton className="w-full h-5 bg-zinc-200/80"></Skeleton>
              <Skeleton className="w-full h-5 bg-zinc-200/80"></Skeleton>
            </>
          )}
        </div>
      }
    ></Wrapper>
  )
}

export default RelatedQuestion