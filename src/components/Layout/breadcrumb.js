"use client";

import Link from "next/link";

export default function Breadcrumb({links}) {
  return (
    <div className="max-w-fit border border-border-breadcrumb rounded-md ">
      <div className="flex gap-x-4  items-center bg-white rounded-md pr-2 pl-4 md:pl-12 flex-shrink-1 text-xs py-1 overflow-x-auto">
        {links.length > 0 && links.map((link, index) => {
          return links.length - 1 !== index ? (
            <div className="flex min-w-max" key={link.link}>
              <Link
                className="text-app-gray font-bold my-auto pr-8 md:pr-14 py-2"
                href={link.link}
              >
                {link.title}
              </Link>
              <div className="text-app-gray text-3xl py-3">
                <svg
                  width="8"
                  height="13"
                  viewBox="0 0 8 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.5769 7.68109L6.57739 7.68158L7.76227 6.4967L1.83783 0.572266L0.652954 1.75714L5.38548 6.48967L0.716421 11.1587L1.90785 12.3501L6.5769 7.68109Z"
                    fill="#817E78"
                  />
                </svg>
              </div>
            </div>
          ) : (
            <div className="min-w-max" key={link.link}>
              <Link
                className="text-header-blue font-bold bg-header-blue bg-opacity-10 my-auto px-8 md:px-14 rounded py-2"
                href={link.link}
              >
                {link.title}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
