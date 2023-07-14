"use client";

import { useState } from "react";
import TitleUserCard from "../components/titleUserCard";
import { logTable,tableDefaultPageSizeOption } from "@/utils/constant";
import { Pagination, Select } from "antd";
import intl from "@/utils/locales/jp/jp.json";


const TableComponent = ({ tableData }) => {
  const getStatusColor = (level) => {
    switch (level) {
      case "FATAL":
        return "bg-red-500 text-white";
      case "ERROR":
        return "bg-red-400 text-white";
      case "WARN":
        return "bg-yellow-400 text-black";
      case "INFO":
        return "bg-blue-400 text-white";
      case "DEBUG":
        return "bg-gray-400 text-black";
      default:
        return "";
    }
  };
  return (
    <table className="table-auto text-sm">
      <tbody>
        {tableData.map((row, index) => (
          <tr key={index} className="py-4">
            <td className="px-4 py-2">{index + 1}</td>
            <td className="px-4 py-2 text-[#089405] "><div className="w-[80px]">{row.Date}</div></td>
            <td className="px-4 py-2 text-[#089405] "><div className="w-[85px]">{row.Time}</div></td>
            <td className={`py-2`}>
              <div
                className={`${getStatusColor(
                  row.Level
                )} w-16 flex-1 text-center font-semibold p-1`}
              >
                {" "}
                {row.Level}
              </div>
            </td>
            <td className="px-4 py-2 ">
              {row.Class.className} :{" "}
              <span className="text-[#089405]">{row.Class.classId}</span>
            </td>
            <td className="px-4 py-2">{row.Message}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default function ViewLog() {
  let [fromDate, setFromDate] = useState(null);
  let [toDate, setToDate] = useState(null);

  return (
    <>
      <div className="flex justify-center mb-4 mt-2">
        <TitleUserCard title={intl.user_view_logo_screen_label} />
      </div>

      <div className="w-full mx-auto">
        <div className="w-full flex gap-x-4 mb-8 px-2">
          <div className="w-1/2">
            <input
              type="date"
              value={fromDate}
              className={
                "rounded-xl py-2 border border-gray-400 block w-full text-sm px-2 focus:outline-none focus:ring-2 focus:ring-customBlue text-[#8B8B8B] md:text-center"
              }
              onChange={(event)=>{
                setFromDate(()=>event.target.value)
              }}
            />
          </div>
          <div className="w-1/2">
            <input
              type="date"
              value={toDate}
              className={
                "rounded-xl py-2 border border-gray-400 block w-full text-sm  focus:outline-none focus:ring-2 focus:ring-customBlue text-[#8B8B8B] text-center px-2"
              }
              onChange={(event)=>{
                setToDate(()=>event.target.value)
              }}
            />
          </div>
        </div>
        <div className="mb-8 overflow-x-auto">
          <TableComponent tableData={logTable} />
        </div>
        <div class="flex mt-2 float-right">
          <div class="flex-initial">
            <Select
                defaultValue={5}
                style={{ width: 80 }}
                options={tableDefaultPageSizeOption}
            />
          </div>
          <div class="flex-initial pl-2">
            <Pagination
                current={1}
                pageSize={5}
                onChange={()=> {}}
                total={5}
              />
          </div>
        </div>
      </div>
    </>
  );
}
