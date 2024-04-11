import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import _ from "lodash";

import { LayoutContext } from "@/layout/context/layoutcontext";
import {
  getEnglishDateDisplayFormat,
  getJapaneseDateDisplayYYYYMMDDFormat,
  getValueByKeyRecursively as translate
} from "@/helper";
import { StaffDashBoardServices } from "@/services/staff_dashboard.service";
import { staff_dashboard_status_jp, staff_dashboard_status_en } from '@/utils/constant'
import { CustomHeader, Doughnut } from "@/components";

function StaffDashboard() {
  const { locale, localeJson, setLoader } = useContext(LayoutContext);
  // Getting storage data with help of reducers
  const layoutReducer = useSelector((state) => state.layoutReducer);

  const [labelsSpecialCares, setLabelsSpecialCares] = useState(null);
  const [dataSpecialCares, setDataSpecialCares] = useState(null);
  const [labelsTotalCapacityBreakdown, setLabelsTotalCapacityBreakdown] = useState(null);
  const [dataTotalCapacityBreakdown, setDataTotalCapacityBreakdown] = useState(null);
  const [labelsOther, setLabelsOther] = useState(null);
  const [dataOther, setDataOther] = useState(null);
  const [labelsDetailsOther, setLabelsDetailsOther] = useState(null);
  const [dataDetailsOther, setDataDetailsOther] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const formattedDateTime = currentDateTime;

  /* Services */
  const { getList } = StaffDashBoardServices;
  
  useEffect(() => {
    getListDataOnMount();
  }, [locale]);

  const getListDataOnMount = async () => {
    let payload = { place_id: layoutReducer?.user?.place?.id };
    getList(payload, fetchData);
  };

  const fetchData = async (res) => {
    try {
      if (res) {
        let personTotal2 = res?.data.personTotal;
        setLabelsSpecialCares(Object.keys(personTotal2?.specialCares));
        setDataSpecialCares(Object.values(personTotal2?.specialCares));
        setLabelsTotalCapacityBreakdown(Object.keys(personTotal2?.other_stats));
        setDataTotalCapacityBreakdown(Object.values(personTotal2?.other_stats));
        let keysInDataOrder = locale == 'ja' ? staff_dashboard_status_jp : staff_dashboard_status_en;
        let keysInOrder = _.cloneDeep(keysInDataOrder);
        let accommodationStats = personTotal2?.accomidation_stats;
        let maxCapacity = accommodationStats[keysInOrder[0]];
        let totalFamily = accommodationStats[keysInOrder[1]];
        if (totalFamily && maxCapacity) {
          if (maxCapacity < totalFamily) {
            keysInOrder?.splice(1, 2); // Remove elements at index 1 and 2
          } else {
            keysInOrder?.splice(0, 1); // Remove element at index 0
          }
        }
        let valuesInOrder = keysInOrder.map(key => accommodationStats[key]);
        let valuesDataOrder = keysInDataOrder.map(key => accommodationStats[key]);
        setLabelsDetailsOther(keysInDataOrder);
        setDataDetailsOther(Object.values(valuesDataOrder));
        setLabelsOther(keysInOrder);
        setDataOther(Object.values(valuesInOrder));
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
                header={translate(localeJson, "shelter_situation")}
              />
              <span className="flex  text-xs text-bluegray-400">
                {locale === "ja"
                  ? getJapaneseDateDisplayYYYYMMDDFormat(formattedDateTime)
                  : getEnglishDateDisplayFormat(formattedDateTime)}
              </span>
            </h5>
            <div className="">
              <div className="grid mb-3">
                <div className="col-12 lg:col-6 pr-3">
                  <div className="text-center p-5 border-round-sm bg-white font-bold" style={{ height: "190px" }}>
                    <label className="page-header2 flex justify-content-center text-custom-color">
                      {translate(localeJson, "staff_evacuee_count")}
                    </label>
                    <div>
                      <label className="flex justify-content-center font-bold text-5xl pt-2">
                        {dataDetailsOther && dataDetailsOther[1] ? dataDetailsOther[1] + translate(localeJson,"people") : 0 + translate(localeJson,"people")} <span className="font-bold text-6xl pl-1 pr-1"> / </span>{dataDetailsOther && dataDetailsOther[0] ? dataDetailsOther[0] + translate(localeJson,"people") : 0 + translate(localeJson,"people")}
                      </label>
                    </div>
                    <div className="flex gap-2 text-xs font-normal justify-content-center pt-2">
                      <label className="">
                        {translate(localeJson, "c_male")}:{dataTotalCapacityBreakdown && dataTotalCapacityBreakdown[1] ? dataTotalCapacityBreakdown[1] : 0}
                      </label>
                      <label>{translate(localeJson, "c_female")}:{dataTotalCapacityBreakdown && dataTotalCapacityBreakdown[2] ? dataTotalCapacityBreakdown[2] : 0}</label>
                      <label>{translate(localeJson, "c_others")}:{dataTotalCapacityBreakdown && dataTotalCapacityBreakdown[3] ? dataTotalCapacityBreakdown[3] : 0}</label>
                      <label>{translate(localeJson, "c_count_only")}:{dataTotalCapacityBreakdown && dataTotalCapacityBreakdown[4] ? dataTotalCapacityBreakdown[4] : 0}</label>
                    </div>
                  </div>
                </div>
                <div className="col-12 lg:col-6 pl-3">
                  <div className="text-center p-5 border-round-sm bg-white font-bold" style={{ height: "190px" }}>
                    <label className="page-header2 flex justify-content-center text-custom-color">
                      {translate(localeJson, "house_hold_number")}
                    </label>
                    <div>
                      <label className="flex justify-content-center font-bold text-5xl pt-2">
                        {dataTotalCapacityBreakdown && dataTotalCapacityBreakdown[0] ? dataTotalCapacityBreakdown[0] : 0}{translate(localeJson, "house_hold")}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid mt-3">
                <div className="col-12 lg:col-6 pr-3">
                  <div className="text-center p-5 border-round-sm bg-white font-bold" style={{ maxHeight: "500px", minHeight: "500px" }}>
                    <label className="page-header2 flex justify-content-center mb-2 text-custom-color pb-2">
                      {translate(localeJson, "person_consideration")}
                    </label>
                    <ul className="staff-list">
                      {labelsSpecialCares && labelsSpecialCares?.map((label, index) => (
                        <li key={index}>
                          <div className="label">{label}</div>
                          <div className="value">{dataSpecialCares[index]}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="col-12 lg:col-6 pl-3">
                  <div className="text-center p-5 border-round-sm bg-white font-bold" style={{ maxHeight: "500px", minHeight: "500px" }}>
                    <Doughnut
                      type={"pie"}
                      labels={labelsSpecialCares}
                      data={dataSpecialCares}
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

export default StaffDashboard;
