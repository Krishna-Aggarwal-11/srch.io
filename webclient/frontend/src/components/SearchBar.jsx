import React from "react";
import { FaArrowRight } from "react-icons/fa";


const SearchBar = () => {
  return (
    <div>
      <form>
        <label
          className="relative bg-white flex items-center justify-center border ring-8 ring-zinc-300/20 py-2 px-2 rounded-lg gap-2 focus-within:border-zinc-300"
          htmlFor="search-bar"
        >
          <input
            id="search-bar"
            placeholder="Ask me anything ..."
            className="px-2 pr-6 w-full rounded-md flex-1 outline-none bg-white"
          />
          <button
            type="submit"
            className="w-auto py-1 px-2 bg-black border-black text-white fill-white active:scale-95 border overflow-hidden relative rounded-xl"
          >
            <FaArrowRight className="w-5 h-5" />
          </button>
        </label>
      </form>
    </div>
  );
};

export default SearchBar;
