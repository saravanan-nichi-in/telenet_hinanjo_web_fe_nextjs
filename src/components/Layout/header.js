"use client";

import Image from "next/image";
import Logo from "../../../public/ptalk-logo.svg";
import { RxCaretDown } from "react-icons/rx";
import Link from "next/link";
import HeaderTabSearch from "../../components/Icons/headerTabSearch";
import HeaderTabOptions from "../Icons/headerTabOptions";
import HeaderTabMenu from "../Icons/headerTabMenu";
import useToggle from "../../utils/hooks/useToggle";

export default function Header({ toggleSidebar, setSearchPanelOnMobile }) {
  /**
   * Toggle hook
   * @param {boolean} initialValue
   * @returns {boolean}
   */

  const [on, toggle] = useToggle(false);

  return (
    <div className="w-full bg-header-blue">
      <div className="flex justify-between items-center px-5 lg:hidden">
        <span className="lg:hidden" onClick={toggleSidebar}>
          <HeaderTabMenu data-testid="menu-icon" />
        </span>
        <Image
          src={Logo}
          alt="Ptalk logo"
          style={{ width: "100px", paddingTop: "5px", paddingBottom: "5px" }}
        />
        <div className="flex gap-5 lg:hidden">
          <span onClick={() => setSearchPanelOnMobile()}>
            <HeaderTabSearch />
          </span>
          <span onClick={() => toggle(!on)} data-testid="options-icon">
            <HeaderTabOptions />
          </span>
          {on && (
            <>
              <div
                id="dropdownDelay"
                className="z-10 absolute right-5 top-16 divide-y divide-gray-100 rounded-xl shadow bg-[#0C4278] text-white "
                style={{
                  width: "155px",
                }}
                data-testid="options-dropdown"
              >
                <ul
                  className="py-2 pl-2 font-bold text-base"
                  aria-labelledby="dropdownDelayButton"
                  data-testid="dropdown-menu-first"
                >
                  <li>
                    <Link href="/" className="block px-4 py-2">
                      Password
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="block px-4 py-2 ">
                      Logout
                    </Link>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="hidden lg:flex py-1 items-center justify-between ">
        <Image src={Logo} alt="Ptalk" style={{ marginLeft: "55px", width: "110px" }} />
        <div>
          <div className="flex items-center gap-4 pr-4">
            <div
              className="bg-zinc-300	 w-10 h-10 rounded-full p-5"
              data-testid="user-avatar"
            ></div>
            <div className="flex flex-col gap-0">
              <h3 className="text-[16px] text-white font-semibold tracking-widest">
                Rahul Dravid
              </h3>
              <span className="text-sm text-[#BDBDBD] font-medium">Admin</span>
            </div>
            <div
              className={`${on ? "bg-[#0C4278] rounded-lg p-2" : "p-2"}`}
              data-testid="user-menu"
            >
              <span className="sr-only">Open main menu</span>
              <RxCaretDown
                className="text-white text-2xl font-bold"
                onClick={() => toggle(!on)}
                data-testid="toggle-button"
              />
            </div>
            {on && (
              <>
                <div
                  id="dropdownDelay"
                  className="z-10 absolute right-5  divide-y divide-gray-100 rounded-xl shadow bg-[#0C4278] text-white"
                  style={{
                    width: "155px",
                    top: "4.5rem",
                  }}
                  data-testid="user-menu-dropdown"
                >
                  <ul
                    className="py-2  pl-2 font-bold text-base"
                    aria-labelledby="dropdownDelayButton"
                  >
                    <li>
                      <a href="#" className="block px-4 py-2">
                        Password
                      </a>
                    </li>
                    <li>
                      <a href="#" className="block px-4 py-2 ">
                        Logout
                      </a>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
