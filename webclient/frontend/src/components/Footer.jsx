import React from "react";
import { FaGithub, FaHome, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="text-center flex flex-col items-center text-xs text-zinc-700 gap-1">

      <div className="flex gap-2 justify-center">
        <div>
          <a
            className="text-blue-500 font-medium inline-flex gap-1 items-center flex-nowrap text-nowrap"
            href="mailto:"
          >
            Talk to us
          </a>
        </div>
        <div>if you need a performant and scalable AI cloud!</div>
      </div>

      <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-2 mt-2 text-zinc-400">
      <FaHome/>  <a className="hover:text-zinc-950" href="/">
          Home
        </a>
        <FaTwitter/>
        <a className="hover:text-zinc-950" href="https://twitter.com/leptonai">
          Twitter
        </a>
        <FaGithub/>
        <a className="hover:text-zinc-950" href="https://github.com/">
          GitHub
        </a>
      </div>
    </div>
  );
};

export default Footer;
