import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { LayoutContext } from "@/layout/context/layoutcontext";
import {
  getEnglishDateDisplayFormat,
  getJapaneseDateDisplayYYYYMMDDFormat,
  getValueByKeyRecursively as translate
} from "@/helper";
import { CustomHeader, Doughnut } from "@/components";
import { StaffDashBoardServices } from "@/services";

function EventStaffDashboard() {
  const { locale, localeJson, setLoader } = useContext(LayoutContext);
  // Getting storage data with help of reducers
  const layoutReducer = useSelector((state) => state.layoutReducer);

  const [labelsCheck, setLabelsCheck] = useState(null);
  const [dataCheck, setDataCheck] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [data, setData] = useState(null);

  /* Services */
  const { getEventList } = StaffDashBoardServices;

  useEffect(() => {
    getListDataOnMount();
  }, [locale]);

  const getListDataOnMount = async () => {
    setLoader(true);
    let payload = { event_id: layoutReducer?.user?.place?.id };
    getEventList(payload, fetchData);
  };

  const fetchData = async (res) => {
    try {
      if (res && res.success) {
        const data = res.data.model;
        setLabelsCheck([
          translate(localeJson, 'number_of_attendees_checkIn'),
          translate(localeJson, 'number_of_attendees_checkOut')
        ]);
        setDataCheck([
          data.checkinCount ? data.checkinCount : 0,
          data.checkoutCount ? data.checkoutCount : 0,
        ]);
        setData(data);
      }
    }
    finally {
      setLoader(false);
    }
  };

  return (
    <>
      <div className="grid">
        <div className="col-12">
          <div className="card">
            <h5 className="page-header1" style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
              <CustomHeader
                headerClass={"page-header1 mr-2"}
                header={translate(localeJson, "event_status")}
              />
              <span className="flex  text-xs text-bluegray-400">
                {locale === "ja"
                  ? getJapaneseDateDisplayYYYYMMDDFormat(currentDateTime)
                  : getEnglishDateDisplayFormat(currentDateTime)}
              </span>
            </h5>
            <div className="">
              <div className="grid mb-3">
                <div className="col-12 lg:col-12 ">
                  <div className="text-center p-5 border-round-sm bg-white font-bold" style={{ height: "190px" }}>
                    <label className="page-header2 flex justify-content-center  text-custom-color">
                      {translate(localeJson, "number_of_attendees")}
                    </label>
                    <div>
                      <label className="flex justify-content-center font-bold text-5xl pt-2">
                        {data?.personCount ? data?.personCount + translate(localeJson,"people") : 0 + translate(localeJson,"people")}
                      </label>
                    </div>
                    <div className="flex gap-2 text-xs font-normal justify-content-center pt-2">
                      <label className="">
                        {translate(localeJson, "c_male")}:{data?.male ? data?.male : 0}
                      </label>
                      <label>{translate(localeJson, "c_female")}:{data?.female ? data?.female : 0}</label>
                      <label>{translate(localeJson, "c_others")}:{data?.others ? data?.others : 0}</label>
                    </div>
                  </div>
                </div>
                <div className="col-12 lg:col-6 pl-3 hidden">
                  <div className="text-center p-5 border-round-sm bg-white font-bold  pb-2" style={{ height: "190px" }}>
                    <label className="page-header2 flex justify-content-center text-custom-color">
                      {translate(localeJson, "house_hold_number")}
                    </label>
                    <div>
                      <label className="flex justify-content-center font-bold text-5xl pt-2">
                        {data?.familyCount ? data?.familyCount : 0}{translate(localeJson, "house_hold")}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid mt-3">
                <div className="col-12 lg:col-6 pr-3">
                  <div className="text-center p-5 border-round-sm bg-white font-bold" style={{ maxHeight: "500px", minHeight: "500px" }}>
                    <label className="page-header2 flex justify-content-center text-custom-color">
                      {translate(localeJson, "attendee_status")}
                    </label>
                    <div className="table-container text-center pt-2" >
                      <table className="table" style={{ width: "100%" }}>
                        <tbody>
                          <tr >
                            {labelsCheck?.map((label, index) => (
                              <td style={{ width: "15rem" }} key={index} >{label}</td>
                            ))}
                          </tr>
                          <tr>
                            {dataCheck?.map((value, index) => (
                              <td style={{ width: "15rem" }} key={index}>{value} {translate(localeJson,"people")}</td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="col-12 lg:col-6 pl-3">
                  <div className="text-center p-5 border-round-sm bg-white font-bold" style={{ maxHeight: "500px", minHeight: "500px" }}>
                    <Doughnut
                      type={"pie"}
                      labels={labelsCheck}
                      data={dataCheck}
                      title="Special Cares"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EventStaffDashboard;