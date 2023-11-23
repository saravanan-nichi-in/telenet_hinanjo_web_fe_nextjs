import React, { useContext, useEffect, useState } from "react";

import { LayoutContext } from "@/layout/context/layoutcontext";
import Doughnut from "@/components/chart";
import { getValueByKeyRecursively as translate, generateColors } from "@/helper";
import { StaffDashBoardServices } from "@/services/staff_dashboard.service";
import { useSelector } from "react-redux";
import { staff_dashboard_status_jp, staff_dashboard_status_en } from '@/utils/constant'
import _ from "lodash";

function StaffDashboard() {
  const { locale, localeJson, setLoader } = useContext(LayoutContext);
  const [labelsSpecialCares, setLabelsSpecialCares] = useState(null);
  const [dataSpecialCares, setDataSpecialCares] = useState(null);
  const [labelsTotalCapacityBreakdown, setLabelsTotalCapacityBreakdown] =
    useState(null);
  const [dataTotalCapacityBreakdown, setDataTotalCapacityBreakdown] =
    useState(null);
  const [labelsOther, setLabelsOther] = useState(null);
  const [dataOther, setDataOther] = useState(null);
  const [labelsDetailsOther, setLabelsDetailsOther] = useState(null);
  const [dataDetailsOther, setDataDetailsOther] = useState(null);
  
  const layoutReducer = useSelector((state) => state.layoutReducer);
  useEffect(() => {
      getListDataOnMount();
  }, [locale]);

  const { getList } = StaffDashBoardServices;

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
        console.log(keysInDataOrder)
        let accommodationStats = personTotal2?.accomidation_stats;
        let maxCapacity = accommodationStats[keysInOrder[0]];
        let totalFamily = accommodationStats[keysInOrder[1]];
        if(totalFamily && maxCapacity)
        {
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
            <h5 className="page-header1">
              {translate(localeJson, "staff_page_dashboard")}
            </h5>
            <hr />

            <div className="">
              <h5 className="page-header1 mb-3 col-12 flex justify-content-center">
                {translate(localeJson, "shelter_situation")}
              </h5>
              <h5 className="page-header1 mb-3 col-12">
                {translate(localeJson, "accommodation_status")}
              </h5>
              <div className="lg:flex lg:align-items-center col-12 custom-card shadow-4 mb-3">
              <div className="col-12 lg:col-6">
                {dataDetailsOther && dataDetailsOther[1] > 0 && (
                <Doughnut
                   labels={labelsOther} 
                   data={dataOther}
                  title="Other"
                  bgClr={generateColors(labelsOther?.length)}
                  hvrClr={generateColors(labelsOther?.length)}
                />
                )}
              </div>
              <div className="col-12 lg:col-6">
                <ul className="staff-list">
                  {labelsDetailsOther?.map((label, index) => (
                    <li key={index}>
                      <div className="label">{label}</div>
                      <div className="value">{dataDetailsOther[index]}</div>
                    </li>
                  ))}
                </ul>
              </div>
              </div>
              <div className="lg:flex lg:align-items-center col-12 custom-card shadow-4 mb-3">
              <div className="col-12 lg:col-6">
                <Doughnut
                  labels={labelsTotalCapacityBreakdown?.slice(1)}
                  data={dataTotalCapacityBreakdown?.slice(1)}
                  bgClr={generateColors(labelsTotalCapacityBreakdown?.length-1)}
                  hvrClr={generateColors(labelsTotalCapacityBreakdown?.length-1)}
                  title="Total Capacity Breakdown"
                />
              </div>
              <div className="col-12 lg:col-6">
                <ul className="staff-list">
                  {labelsTotalCapacityBreakdown?.map((label, index) => (
                    <li key={index}>
                      <div className="label">{label}</div>
                      <div className="value">
                        {dataTotalCapacityBreakdown[index]}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              </div>
              <h5 className="page-header1 mb-3 col-12">
                {translate(localeJson, "person_consideration")}
              </h5>
              <div className="lg:flex lg:align-items-center col-12 custom-card shadow-4 mb-3">
              <div className="col-12 lg:col-6">
                <Doughnut
                  labels={labelsSpecialCares}
                  data={dataSpecialCares}
                  bgClr={generateColors(labelsSpecialCares?.length)}
                  hvrClr={generateColors(labelsSpecialCares?.length)}
                  title="Special Cares"
                />
              </div>
              <div className="col-12 lg:col-6">
                <ul className="staff-list">
                  {labelsSpecialCares?.map((label, index) => (
                    <li key={index}>
                      <div className="label">{label}</div>
                      <div className="value">{dataSpecialCares[index]}</div>
                    </li>
                  ))}
                </ul>
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
