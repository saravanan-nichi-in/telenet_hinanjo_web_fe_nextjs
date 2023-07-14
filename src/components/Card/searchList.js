"use client";
import Link from "next/link";
import { HiSearch } from "react-icons/hi";
import intl from "../../utils/locales/jp/jp.json";
export default function SearchCard({ onInput, searchResults }) {
  return (
    <>
      <div className="py-2 block pl-4 pr-4 bg-white border border-gray-200 rounded-xl shadow relative min-h-max h-[98%]">
        <h1 className="text-xl mb-2">{intl.components_card_searchlist_companylist}</h1>
        <div className="relative mb-2">
          <input
            type="text"
            className="w-full py-2 pl-10 pr-3 border bg-[white] rounded-lg focus:outline-none placeholder-[#AEA8A8]"
            placeholder={intl.user_sos_company_search_placeholder}
            onInput={(evt) => {
              onInput(evt.target.value);
            }}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <HiSearch className="text-[#AEAEAE] font-bold" />
          </div>
        </div>

        <ul className="mt-2 space-y-0 text-xl">
          {searchResults.map((result,index) => {
            return (
                <li id={`id-${index}`} key={result.companyName}>
                  <Link
                    href={result.link}
                    className="text-[#346595] hover:text-blue-700 text-[14px]"
                  >
                    {result.companyName}
                  </Link>
                </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
