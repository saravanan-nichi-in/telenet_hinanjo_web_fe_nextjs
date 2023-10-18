import React, { useState, useContext, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import _ from 'lodash';

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { InputSelectFloatLabel } from '@/components/dropdown';
import { StatisticsServices } from '@/services';

export default function EvacueesStatistics() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const [options, setOptions] = useState(null);
    const [evacueesShelterOptions, setEvacueesShelterOptions] = useState([
        { name: translate(localeJson, 'current_number_of_evacuees'), value: 'NY' },
        { name: translate(localeJson, 'evacuation_center_occupancy_rate'), value: 'RM' },
        { name: translate(localeJson, 'special_care_percentage'), value: 'LDN' },
    ]);
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
            var labels = [];
            // Dataset configuration
            var datasets_first = [{
                type: 'bar',
                label: translate(localeJson, 'male'),
                backgroundColor: 'rgb(31, 119, 180)',
                data: []
            },
            {
                type: 'bar',
                label: translate(localeJson, 'female'),
                backgroundColor: 'rgb(44, 160, 44)',
                data: []
            },
            {
                type: 'bar',
                label: translate(localeJson, 'others_text'),
                backgroundColor: 'rgb(255, 127, 14)',
                data: []
            }];
            var datasets_second = [{
                type: 'bar',
                label: '男',
                backgroundColor: 'rgb(31, 119, 180)',
                data: []
            }];
            var datasets_third = [];
            // Chart options
            const chart_first_options = {
                maintainAspectRatio: false,
                indexAxis: 'y',
                aspectRatio: list_place.length > 10 ? 0.2 : 0.8,
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: function (tooltipItems, data) {
                                if (tooltipItems[0].label.length > 50) {
                                    return tooltipItems[0].label.substring(0, 50) + '...'; // Truncate labels longer than 10 characters
                                }
                                return tooltipItems[0].label;
                            },
                            label: function (context) {
                                const dataset = context.dataset;
                                const index = context.dataIndex;
                                const value = dataset.data[index];
                                return dataset.label + " : " + value + "人";
                            },
                        }
                    },
                    legend: {
                        position: "bottom",
                        align: "center",
                        labels: {
                            usePointStyle: true,
                            pointStyle: "rect",
                            color: '#495057'
                        }
                    }
                },
                scales: {
                    x: {
                        min: 0,
                        stacked: true,
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        stacked: true,
                        grid: {
                            display: false
                        },
                        ticks: {
                            autoSkip: false, // Enable label auto-skipping
                            maxTicksLimit: 5, // Limit the number of displayed labels to 5
                            callback: function (value, index) {
                                if (labels[index].length > 10) {
                                    return labels[index].substring(0, 10) + '...'; // Truncate labels longer than 10 characters
                                }
                                return labels[index];
                            },
                        }
                    }
                }
            };
            const chart_second_options = {
                maintainAspectRatio: false,
                indexAxis: 'y',
                aspectRatio: list_place.length > 10 ? 0.2 : 0.8,
                plugins: {
                    tooltip: {
                        displayColors: false,
                        callbacks: {
                            title: () => null,
                            label: function (context) {
                                const dataset = context.dataset;
                                const index = context.dataIndex;
                                const value = dataset.data[index];
                                const percentage = value + '%';
                                return " " + percentage;
                            },
                        }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        min: 0,
                        stacked: true,
                        ticks: {
                            callback: function (val) {
                                return val + "%";
                            },
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        // type: 'logarithmic', // Use a logarithmic scale
                        stacked: true,
                        grid: {
                            display: false
                        },
                        ticks: {
                            autoSkip: false, // Enable label auto-skipping
                            maxTicksLimit: 5, // Limit the number of displayed labels to 5
                            callback: function (value, index) {
                                if (labels[index].length > 10) {
                                    return labels[index].substring(0, 10) + '...'; // Truncate labels longer than 10 characters
                                }
                                return labels[index];
                            },
                        }
                    }
                }
            }
            const chart_third_options = {
                maintainAspectRatio: false,
                indexAxis: 'y',
                aspectRatio: list_place.length > 10 ? 0.2 : 0.8,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const dataset = context.dataset;
                                const index = context.dataIndex;
                                const value = dataset.data[index];
                                return dataset.label + " : " + value + "人";
                            },
                        }
                    },
                    legend: {
                        position: "bottom",
                        align: "center",
                        labels: {
                            usePointStyle: true,
                            pointStyle: "rect",
                            color: '#495057'
                        }
                    }
                },
                scales: {
                    x: {
                        min: 0,
                        stacked: true,
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        stacked: true,
                        grid: {
                            display: false
                        },
                        ticks: {
                            autoSkip: false, // Enable label auto-skipping
                            maxTicksLimit: 5, // Limit the number of displayed labels to 5
                            callback: function (value, index) {
                                if (labels[index].length > 10) {
                                    return labels[index].substring(0, 10) + '...'; // Truncate labels longer than 10 characters
                                }
                                return labels[index];
                            },
                        }
                    }
                }
            };
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
            list_place.forEach(item => {
                const specialCare = item.specialCare;
                for (const key in specialCare) {
                    const existingEntry = datasets_third.find(entry => entry.key === key);
                    if (existingEntry) {
                        existingEntry.data.push(specialCare[key]);
                    } else {
                        datasets_third.push({ key, label: key, type: 'bar', data: [specialCare[key]] });
                    }
                }
            });
            if (data == evacueesShelterOptions[0].value) {
                datasets_first.map((obj, i) => {
                    switch (obj.label) {
                        case translate(localeJson, 'male'):
                            obj['data'] = count_male_array;
                            break;
                        case translate(localeJson, 'female'):
                            obj['data'] = count_female_array;
                            break;
                        case translate(localeJson, 'others_text'):
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
                await setOptions(chart_first_options);
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
                await setOptions(chart_second_options);
            }
            else {
                let chartData = {
                    labels: labels,
                    datasets: datasets_third,
                }
                await setChartData(chartData);
                await setOptions(chart_third_options);
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
                    <h5 className='page-header1'> {translate(localeJson, 'statistics')}</h5>
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
                    <Chart type="bar" data={chartData} options={options} />
                </div>
            </div>
        </div>
    )
}