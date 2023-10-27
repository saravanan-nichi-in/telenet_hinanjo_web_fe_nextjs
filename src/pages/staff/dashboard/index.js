import React, { useContext, useEffect,useState } from 'react'

import { LayoutContext } from '@/layout/context/layoutcontext';
import DonutChartDemo from '@/components/chart';
import { getValueByKeyRecursively as translate } from '@/helper'
import {StaffDashBoardServices} from '@/services/staff_dashboard.service'
import { BiAlignRight } from "react-icons/bi";

function StaffDashboard() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const [selectedInfo, setSelectedInfo] = useState(false);
    const [selectedInfoTotalCapacity, setSelectedInfoTotalCapacity] = useState(false);
    const [selectedInfoSpecialCares, setSelectedInfoSpecialCares] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            getListDataOnMount()
        };
        fetchData();
    }, [locale]);

    const {getList} = StaffDashBoardServices;

    const getListDataOnMount = ()=> {
      let payload = {"place_id":parseInt(1)}
      getList(payload,fetchData)
    }

    const fetchData = (res)=> {
      if(res)
      {
        console.log(res)
      }
      setLoader(false)
    }

    const personTotal= {
        "Capacity": 4,
        "Male": 2,
        "Female": 1,
        "Total family": 4,
        "Others": 1,
        "Total capacity": 4,
        "Number of people count only": 0,
        "Blank": 96,
        "Maximum capacity": 100,
        "specialCares": {
            "Pregnant woman": 3,
            "Infant": 0,
            "Persons with disabilities": 4,
            "Nursing care recipient": 4,
            "Medical device users": 0,
            "Allergies": 0,
            "Foreign nationality": 0,
            "Newborn baby": 0,
            "Other": 0
        }
    }

    const labelsSpecialCares = Object.keys(personTotal.specialCares);
    const dataSpecialCares = Object.values(personTotal.specialCares);

    const labelsTotalCapacityBreakdown = ["Male", "Female", "Others", "Number of people count only"];
    const dataTotalCapacityBreakdown = [
        personTotal.Male,
        personTotal.Female,
        personTotal.Others,
        personTotal['Number of people count only']
    ];

    const labelsOther = [
        "Total family",
        "Blank",
        "Maximum capacity"
    ];
    const dataOther = [
        personTotal['Total family'],
        personTotal.Blank,
        personTotal['Maximum capacity']
    ];

    const handleIconClick = () => {
        setSelectedInfo(!selectedInfo);
      };
      const handleIconClickTotalCapacity = () => {
        setSelectedInfoTotalCapacity(!selectedInfoTotalCapacity);
      };
    
      const handleIconClickSpecialCares = () => {
        setSelectedInfoSpecialCares(!selectedInfoSpecialCares);
      };
      return (
        <>
          <div className='grid'>
            <div className='col-12'>
              <div className='card'>
                <h5 className='page-header1'>{translate(localeJson, 'staff_page_dashboard')}</h5>
                <hr />
                
                <div className='grid col-12'>
                  <div className='card col-12 lg:col-6'>
                    <div className="icon text-right" onClick={handleIconClick}>
                    <BiAlignRight size={20} />
                    </div>
                    {selectedInfo ? (
                      <ul className="staff-list">
                        {labelsOther.map((label, index) => (
                          <li key={index}>
                            <div className="label">{label}</div>
                            <div className="value">{dataOther[index]}</div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <DonutChartDemo labels={labelsOther} data={dataOther} title="Other" style={{ width: '400px', height: '400px' }} />
                    )}
                  </div>
                  <div className='card col-12 lg:col-6'>
                  <div className="icon text-right" onClick={handleIconClickTotalCapacity}>
                  <BiAlignRight size={20} />
                    </div>
                    {selectedInfoTotalCapacity ? (
                        <ul className="staff-list">
                        {labelsTotalCapacityBreakdown.map((label, index) => (
                          <li key={index}>
                            <div className="label">{label}</div>
                            <div className="value">{dataTotalCapacityBreakdown[index]}</div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <DonutChartDemo labels={labelsTotalCapacityBreakdown} data={dataTotalCapacityBreakdown} title="Total Capacity Breakdown" style={{ width: '400px', height: '400px' }} />
                    )}
                  </div>
                  <div className='card col-12 lg:col-6'>
                  <div className="icon text-right" onClick={handleIconClickSpecialCares}>
                  <BiAlignRight size={20} />
                    </div>
                    {selectedInfoSpecialCares ? (
                        <ul className="staff-list">
                        {labelsSpecialCares.map((label, index) => (
                          <li key={index}>
                            <div className="label">{label}</div>
                            <div className="value">{dataSpecialCares[index]}</div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <DonutChartDemo labels={labelsSpecialCares} data={dataSpecialCares} title="Special Cares" style={{ width: '400px', height: '400px' }} />
                    )}
                   
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }

export default StaffDashboard;

