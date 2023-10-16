import React, { useState, useContext, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import _ from 'lodash';

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { InputSelectFloatLabel } from '@/components/dropdown';
import {
    considerationEvacueesCountData, considerationEvacueesCountOptions,
    currentEvacueesCountData, currentEvacueesCountOptions, evacuationCenterCrowdingRateData, evacuationCenterCrowdingRateOptions, evacueesShelterOptions
} from '@/utils/constant';
import { StatisticsServices } from '@/services';

export default function EvacueesStatistics() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const [horizontalOptions, setHorizontalOptions] = useState(null);
    const [data, setData] = useState(evacueesShelterOptions[0].value);
    const [chartData, setChartData] = useState({});

    /* Services */
    const { getList } = StatisticsServices;

    useEffect(() => {
        const fetchData = async () => {
            await GetStatisticsList();
        };
        fetchData();
    }, [data]);

    /**
    * Get statistics list
    */
    const GetStatisticsList = async () => {
        // Get dashboard list
        await getList(GetStatisticsListSuccess);
    }

    /**
     * Function will get data & update statistics list
     * @param {*} response 
     */
    const GetStatisticsListSuccess = async (response) => {
        if (response.success && !_.isEmpty(response.data)) {
            var list_place = response.data.model.list_place;
            var specialCares = response.data.specialCares;
            var labels = [];
            var datasets_first = [{
                type: 'bar',
                label: '男',
                backgroundColor: 'rgb(31, 119, 180)',
                data: []
            },
            {
                type: 'bar',
                label: '女',
                backgroundColor: 'rgb(44, 160, 44)',
                data: []
            },
            {
                type: 'bar',
                label: '答えくない',
                backgroundColor: 'rgb(255, 127, 14)',
                data: []
            }];
            var datasets_second = [{
                type: 'bar',
                label: '男',
                backgroundColor: 'rgb(31, 119, 180)',
                data: []
            }];
            var datasets_third = []
            // Preparing labels
            list_place.map((obj, i) => {
                let preparedObj = locale === "en" && !_.isNull(obj.name_en) ? obj.name_en : obj.name;
                labels.push(preparedObj);
            })
            // Preparing datasets
            var count_male_array = list_place.map((obj, i) => {
                return obj.countMale;
            })
            var count_female_array = list_place.map((obj, i) => {
                return obj.countFemale;
            })
            var count_others_array = list_place.map((obj, i) => {
                return obj.totalPerson - (obj.countFemale + obj.countMale);
            })
            var evacuation_center_crowding_rate_array = list_place.map((obj, i) => {
                return 100 - (((obj.total_place - obj.totalPerson) / obj.total_place) * 100);
            })
            // var number_of_evacuees_requiring_consideration = 
            console.log(labels);
            if (data == evacueesShelterOptions[0].value) {
                datasets_first.map((obj, i) => {
                    switch (obj.label) {
                        case '男':
                            obj['data'] = count_male_array;
                            break;
                        case '女':
                            obj['data'] = count_female_array;
                            break;
                        case '答えくない':
                            obj['data'] = count_others_array;
                            break;
                        default:
                            break;
                    }
                })
                let chartData = {
                    labels: labels,
                    datasets: datasets_first,
                }
                await setChartData(chartData);
                await setHorizontalOptions(currentEvacueesCountOptions);
            }
            else if (data == evacueesShelterOptions[1].value) {
                datasets_second.map((obj, i) => {
                    obj['data'] = evacuation_center_crowding_rate_array;
                })
                let chartData = {
                    labels: labels,
                    datasets: datasets_second,
                }
                await setChartData(chartData);
                await setHorizontalOptions(evacuationCenterCrowdingRateOptions);
            }
            else {
                let chartData = {
                    labels: labels,
                    datasets: datasets_second,
                }
                await setChartData(considerationEvacueesCountData);
                await setHorizontalOptions(considerationEvacueesCountOptions);
            }
            setLoader(false);
        }
    }

    /**
     * Dropdown value change
     * @param {*} e 
     */
    const onDropDownValueChange = (e) => {
        setLoader(true);
        setData(e.target.value);
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <h5 className='page_header'> {translate(localeJson, 'statistics')}</h5>
                    <hr />
                    <InputSelectFloatLabel
                        dropdownFloatLabelProps={{
                            inputId: "statisticsType",
                            value: data,
                            options: evacueesShelterOptions,
                            optionLabel: "name",
                            selectClass: "w-full lg:w-14rem md:w-14rem sm:w-10rem",
                            onChange: (e) => onDropDownValueChange(e)
                        }}
                        parentClass="w-20rem lg:w-14rem md:w-14rem sm:w-10rem pt-2 pb-2"
                    />
                    <Chart type="bar" data={chartData} options={horizontalOptions} />
                </div>
            </div>
        </div>
    )
}