import React from "react";
import { FaGithub,  FaLinkedin,  FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="text-center flex flex-col items-center text-xs text-zinc-700 gap-1">
      <div className="flex gap-2 justify-center">
        <div>
          <div className="mb-4">
            Made with <span>🤍 </span>{" "}
          </div>
          <div className="text-blue-500 font-medium inline-flex gap-1 items-center flex-nowrap text-nowrap">
            Contact to us :
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-2 mt-2 text-zinc-400">
      <FaLinkedin />
        <a
          className="hover:text-zinc-950"
          href="https://linktr.ee/streamquery"
          target="_blank"
        >
          LinkedIn
        </a>

        <FaGithub />
        <a
          className="hover:text-zinc-950"
          href="https://linktr.ee/streamquery"
          target="_blank"
        >
          GitHub
        </a>
        <FaTwitter />
        <a
          className="hover:text-zinc-950"
          href="http://twitter.com/himanshubhenwa1"
          target="_blank"
        >
          Twitter
        </a>
      </div>
    </div>
  );
};

export default Footer;
