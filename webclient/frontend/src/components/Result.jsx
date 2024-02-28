import React , { useState } from 'react'
import Answer from './Answer.jsx'

const Result = () => {
    const [error , setError] = useState(null)
  return (
    <div className="flex flex-col gap-8">
      <Answer></Answer>
      {/* <Sources sources={sources}></Sources>
      <Relates relates={relates}></Relates> */}
      {error && (
        <div className="absolute inset-4 flex items-center justify-center bg-white/40 backdrop-blur-sm">
          <div className="p-4 bg-white shadow-2xl rounded text-blue-500 font-medium flex gap-4">
            <Annoyed></Annoyed>
            {error === 429
              ? "Sorry, you have made too many requests recently, try again later."
              : "Sorry, we might be overloaded, try again later."}
          </div>
        </div>
      )}
    </div>
  )
}

export default Result