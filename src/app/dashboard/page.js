"use client";

import SearchList from "@/components/Card/searchList";
import CardIcon from "@/components/Card/icon";
import GraphCard from "@/components/Card/graphCard";
import ActionButton from "./components/actionButton";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { companySearchResult } from "@/utils/constant";
import DashboardOrganization from "@/components/Icons/dashboardOrganization";
import DashboardConnections from "@/components/Icons/dashboardConnections";
import DashboardActiveConnection from "@/components/Icons/dashboardActiveConnections";
import DashboardDisabledConnections from "@/components/Icons/dashboardDisabledConnections";
import intl from "@/utils/locales/jp/jp.json";


const Dashboard = () => {
  const [searchResults, setSearchResults] = useState([
    {
      companyName: "Company name Pvt Ltd",
      link: "#",
    },
  ]);
  const [isMobile, setIsMobile] = useState(false);

  function searchCompany(evt) {
    setSearchResults(companySearchResult);
  }
  function searchUserInfo() {
    redirect("/user/search-result");
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Change the breakpoint as needed
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <div className="">
        <div className="flex w-full gap-2  justify-center  md:justify-normal flex-wrap mb-2">
          <div className={`w-[calc(47.2%)] md:w-[49.35%] xl:w-[24.35%]`}>
            <CardIcon
              title={intl.dashboard_card_number_of_companies_label}
              value={108}
              borderVarient="border-[#39A1EA]"
            >
              <DashboardOrganization isMobile={isMobile} />
            </CardIcon>
          </div>
          <div className={`w-[calc(47.2%)] md:w-[49.35%] xl:w-[24.35%]`}>
            <CardIcon
              title={intl.dashboard_card_number_of_connections_label}
              value={100}
              borderVarient="border-[#FEB558]"
            >
              <DashboardConnections isMobile={isMobile} />
            </CardIcon>
          </div>
          <div className={`w-[calc(47.2%)] md:w-[49.35%] xl:w-[24.35%]`}>
            <CardIcon
              title={intl.dashboard_card_active_connection_label}
              value={133}
              borderVarient="border-[#29AB91]"
            >
              <DashboardActiveConnection isMobile={isMobile} />
            </CardIcon>
          </div>
          <div className={`w-[calc(47.2%)] md:w-[49.35%] xl:w-[24.35%]`}>
            <CardIcon
              title={intl.dashboard_card_invalid_connection_label}
              value={103}
              borderVarient="border-[#FF7555]"
            >
              <DashboardDisabledConnections isMobile={isMobile} />
            </CardIcon>
          </div>
        </div>
        <div className="md:hidden mb-2">
          <ActionButton title={intl.dashboard_action_btn_search} onClick={() => searchUserInfo} />
        </div>
        <div className="flex flex-col w-full lg:flex-row  lg:gap-x-2 ">
          <div className="mb-2 lg:mb-0 lg:w-1/2">
            <SearchList onInput={searchCompany} searchResults={searchResults} />
          </div>
          <div className="flex flex-col gap-y-2 lg:w-1/2">
            <GraphCard />
            <div className="hidden lg:block">
              <ActionButton title={intl.dashboard_action_btn_search} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
