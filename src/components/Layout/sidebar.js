"use client";

import {
  dashboard,
  management,
  user,
  settings,
} from "../../../public/menuIcons.js";
import Link from "next/link";
import Image from "next/image";
import TelnetLogo from "../../../public/telnetLogo.svg";
import { usePathname } from "next/navigation.js";
import MenuSettings from "../Icons/menuSettings.js";
import MenuDashboard from "../Icons/menuDashBoard.js";
import MenuUsers from "../Icons/menuUsers.js";
import MenuOrganization from "../Icons/menuOrganization.js";
import intl from "../../utils/locales/jp/jp.json";
export default function Sidebar({ toggleSidebar }) {
  const currentRoute = usePathname();

  const links = [
    {
      title:intl.layout_sidebar_dashboard_label,
      link: "/dashboard",
      icon: (color) => MenuDashboard(color),
      module: "dashboard"
    },
    {
      title:intl.layout_sidebar_company_label,
      link: "/company/list",
      icon: (color) => MenuOrganization(color),
      module: "company"
    },
    {
      title:intl.layout_sidebar_user_label,
      link: "/user",
      icon: (color) => {
        return MenuUsers(color);
      },
      module: "user"
    },
    {
      title:intl.layout_sidebar_helperSettings_label,
      link: "/help-settings/helpSettingsList",
      icon: (color) => {
        return MenuSettings(color);
      },
      module: "help-settings"
    },
  ];

  return (
    <div className="w-full bg-white drop-shadow-lg flex flex-col md:justify-between h-full md:h-sidebar md:rounded-br-sidebar ">
      <div className="w-full md:hidden py-4 pr-5">
        <svg
          className="text-2xl ml-auto "
          onClick={toggleSidebar}
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="14" cy="14" r="14" fill="#F3F3F3" />
          <path
            d="M19.25 7.25012L20.8246 8.82471L9.27759 20.3717L7.70299 18.7971L19.25 7.25012Z"
            fill="#D2D2D2"
          />
          <path
            d="M7.69922 8.2998L9.27381 6.72521L20.8208 18.2722L19.2462 19.8468L7.69922 8.2998Z"
            fill="#D2D2D2"
          />
        </svg>
      </div>
      <div className="flex flex-col gap-4 pr-5 pl-5 md:pb-4 md:pt-12 ">
        {links.map((linkElm, index) => {
          return (
            <div id={`id-${index}`} className="flex gap-2" key={linkElm.title}>
              <Link
                href={linkElm.link}
                onClick={toggleSidebar}
                className={
                  currentRoute.includes(linkElm.module)
                    ? `flex flex-1 bg-[#dce5ed]  text-[#346595] rounded py-2 px-4 items-center`
                    : "flex flex-1 px-4 py-2 rounded text-[#817E78] items-center"
                }
              >
                {currentRoute === linkElm.link
                  ? linkElm.icon({ color: "#346595" })
                  : linkElm.icon({ color: "#817E78" })}
                <div className="pl-4">{linkElm.title}</div>
              </Link>
            </div>
          );
        })}
      </div>
      <div className="mx-auto pb-12 hidden md:block ">
        <Image src={TelnetLogo} height={17} alt="telnet logo" />
      </div>
    </div>
  );
}
