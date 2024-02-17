import React , { useState }  from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const SearchBar = () => {
  const [value , setValue] = useState('');
  const Navigate = useNavigate();
  const handleSumbit = (e) => {
    e.preventDefault();
    if(value) {
      setValue('');
      Navigate(`/search?q=${value}`);
    };
  }
  return (
    <div>
      <form onSubmit={handleSumbit}>
        <label
          className="relative bg-white flex items-center justify-center border ring-8 ring-zinc-300/20 py-2 px-2 rounded-lg gap-2 focus-within:border-zinc-300"
          htmlFor="search-bar"
        >
          <input
            id="search-bar"
            placeholder="Ask me anything ..."
            className="px-2 pr-6 w-full rounded-md flex-1 outline-none bg-white"
            type="text"
            value={value}
            onChange={(e)=>setValue(e.target.value)}
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
