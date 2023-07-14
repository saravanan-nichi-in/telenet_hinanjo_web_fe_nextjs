"use client";

import { useState } from "react";
import DropdownMedium from "../../../components/Input/dropdownMedium";
import { HiSearch } from "react-icons/hi";
import TitleUserCard from "../components/titleUserCard";
import ActionButton from "../components/actionButton";
import IconAjaxDropdown from "@/components/Input/iconAjaxDropdown";

import intl from "@/utils/locales/jp/jp.json";
export default function UserDetails() {
  const userInfo = {
    btnSettings: "1",
    contactSettings: "1",
  };

  const [userDetailsInfo, setUserDetailsInfo] = useState({
    btnSettings: "1",
    contactSettings: "1",
  });

  const [ajaxDropdownValue, setAjaxDropdownValue] = useState("");

  function reset() {
    setUserDetailsInfo(userInfo);
  }

  function getIconWithClass(cls) {
    return <HiSearch className={cls} />;
  }
  return (
    <>
      <div className="flex justify-center mb-4 mt-2">
        <TitleUserCard title={"SOS"} />
      </div>
      <div className="flex justify-end mb-2 md:pr-4">
        <button className=" text-customBlue font-bold" onClick={() => reset()}>
          {intl.user_band_settings_reset_btn_label}
        </button>
      </div>
      <div className="flex flex-col md:flex-row md:gap-x-4">
        <div className="w-full mb-0 md:w-1/2">
          <div className="mb-4">
            <DropdownMedium
              borderRound={"rounded-xl"}
              padding={"py-3 pr-[120px]"}
              options={[
                { id: 1, value: "1", label:intl.user_sos_volume_btn_increase },
                { id: 2, value: "2", label: "option 02" },
                { id: 3, value: "3", label: "option 03" },
                { id: 4, value: "4", label: "option 04" },
              ]}
              keys={"value"} // From options array
              optionLabel={"label"} // From options array
             border={"border border-gray-400"}
              focus={"focus:outline-none focus:ring-2 focus:ring-customBlue"}
               bg=""
              text={"text-sm"}
              additionalClass={"block w-full px-4"}
              id={"btnSettings"}
              labelColor={"#7B7B7B"}
              label={intl.user_sos_destination_label}
              value={userDetailsInfo.btnSettings}
              onChange={(btnSettings) => {
                setUserDetailsInfo({
                  ...userDetailsInfo,
                  ...{ btnSettings: btnSettings },
                });
              }}
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col md:justify-between">
          <div className="mb-4">
            <div className="mb-4">
              <DropdownMedium
                borderRound={"rounded-xl"}
                padding={"py-3 pr-[120px]"}
                isRequired={true}
                options={[
                  { id: 1, value: "1", label:intl.user_sos_designation_ptt_option1 },
                  { id: 2, value: "2", label: "option 02" },
                  { id: 3, value: "3", label: "option 03" },
                  { id: 4, value: "4", label: "option 04" },
                ]}
                keys={"value"} // From options array
                optionLabel={"label"} // From options array
               border={"border border-gray-400"}
                focus={"focus:outline-none focus:ring-2 focus:ring-customBlue"}
                 bg=""
                text={"text-sm"}
                additionalClass={"block w-full px-4"}
                id={"contactSettings"}
                labelColor={"#7B7B7B"}
                label={intl.user_sos_contact_settings}
                value={userDetailsInfo.contactSettings}
                onChange={(contactSettings) => {
                  setUserDetailsInfo({
                    ...userDetailsInfo,
                    ...{ contactSettings: contactSettings },
                  });
                }}
              />
            </div>
            <div className="mb-0"> 
              <IconAjaxDropdown
                type={"text"}
                icon={() => getIconWithClass(" text-gray-300 text-[18px]")}
                placeholder={intl.user_sos_company_search_placeholder}
                borderRound={"rounded-xl"}
                padding={"p-[10px]"}
                border={"border border-gray-400"}
                additionalClass={`  
                focus:outline-none focus:ring-2 focus:ring-customBlue 
                `}
                options={[{ id: "1", name: "test" }]}
                value={ajaxDropdownValue}
                onChange={setAjaxDropdownValue}
                data={[
                  {
                    id:1,
                    name:"001*123*0001"
                  },
                  {
                    id:2,
                    name:"001*123*0002"
                  },
                  {
                    id:3,
                    name:"001*123*0003"
                  },
                ]}
              />
            </div>
          </div>
          <div className="mb-0">
            <ActionButton title={intl.help_settings_addition_keep} />
          </div>
        </div>
      </div>
    </>
  );
}
