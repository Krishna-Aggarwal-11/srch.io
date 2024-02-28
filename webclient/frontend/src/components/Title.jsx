import React from 'react'
import { FcRefresh } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
const Title = ({query}) => {
    const Navigate = useNavigate(); 
    const handleRewrite = () => {
        Navigate(`/search?q=${query}`);
    }
  return (
    <div className="flex items-center pb-4 mb-6 border-b gap-4">
      <div
        className="flex-1 text-lg sm:text-xl text-black text-ellipsis overflow-hidden whitespace-nowrap"
        title={query}
      >
        {query}
      </div>
      <div className="flex-none">
        <button
          type="button"
          className="rounded flex gap-2 items-center bg-transparent px-2 py-1 text-xs font-semibold text-blue-500 hover:bg-zinc-100"
          onClick={handleRewrite}
        >
          <FcRefresh>  </FcRefresh>Rewrite
        </button>
      </div>
    </div>
  )
}

export default Title