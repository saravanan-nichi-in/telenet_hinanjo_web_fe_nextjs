import React, { useContext, useEffect, useState } from "react";

import { LayoutContext } from "@/layout/context/layoutcontext";
import Doughnut from "@/components/chart";
import { getValueByKeyRecursively as translate,generateColors } from "@/helper";
import { StaffDashBoardServices } from "@/services/staff_dashboard.service";
import { useSelector } from "react-redux";
import {staff_dashboard_status_jp,staff_dashboard_status_en} from '@/utils/constant'

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
  const layoutReducer = useSelector((state) => state.layoutReducer);
  useEffect(() => {
    const fetchData = async () => {
      getListDataOnMount();
    };
    fetchData();
  }, [locale]);

  const { getList } = StaffDashBoardServices;

  const getListDataOnMount = () => {
    let payload = { place_id: layoutReducer?.user?.place?.id };
    getList(payload, fetchData);
  };

  const fetchData = (res) => {
    try{
    if (res) {
      let personTotal2 = res?.data.personTotal;
      setLabelsSpecialCares(Object.keys(personTotal2?.specialCares));
      setDataSpecialCares(Object.values(personTotal2?.specialCares));
      setLabelsTotalCapacityBreakdown(Object.keys(personTotal2?.other_stats));
      setDataTotalCapacityBreakdown(Object.values(personTotal2?.other_stats));
      let keysInOrder = locale=='ja'?staff_dashboard_status_jp:staff_dashboard_status_en;
      let accommodationStats = personTotal2?.accomidation_stats;
      let valuesInOrder = keysInOrder.map(key => accommodationStats[key]);
      setLabelsOther(keysInOrder);
      setDataOther(Object.values(valuesInOrder));
    }
  }
  finally{
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

            <div className="grid col-12">
              <h5 className="page-header1 mb-3 col-12 flex justify-content-center">
                {translate(localeJson, "shelter_situation")}
              </h5>
              <h5 className="page-header1 mb-3 col-12">
                {translate(localeJson, "accommodation_status")}
              </h5>
              <div className="card col-12 lg:col-6">
                <Doughnut
                  labels={labelsOther}
                  data={dataOther}
                  title="Other"
                  bgClr={generateColors(labelsOther?.length)}
                  hvrClr={generateColors(labelsOther?.length)}
                />
              </div>
              <div className="col-12 lg:col-6">
                <ul className="staff-list">
                  {labelsOther?.map((label, index) => (
                    <li key={index}>
                      <div className="label">{label}</div>
                      <div className="value">{dataOther[index]}</div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card col-12 lg:col-6">
                <Doughnut
                  labels={labelsTotalCapacityBreakdown}
                  data={dataTotalCapacityBreakdown}
                  bgClr={generateColors(labelsTotalCapacityBreakdown?.length)}
                  hvrClr={generateColors(labelsTotalCapacityBreakdown?.length)}
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
              <h5 className="page-header1 mb-3 col-12">
                {translate(localeJson, "person_consideration")}
              </h5>
              <div className="card col-12 lg:col-6">
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
    </>
  );
}

export default StaffDashboard;
