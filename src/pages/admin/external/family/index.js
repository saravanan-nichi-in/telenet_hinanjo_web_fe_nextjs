import React, { useState, useContext, useEffect, useRef } from 'react';
import { Chart } from 'primereact/chart';
import { useRouter } from 'next/router';
import _ from 'lodash';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from '@/helper'
import { Button } from '@/components';
import { ExternalEvacuationServices } from '@/services/external_evacuation.services';


export default function ExternalEvacuees() {
    const { localeJson, setLoader } = useContext(LayoutContext);
    const router = useRouter();
    const [chartData, setChartData] = useState(null);
    const [chartOptions, setChartOptions] = useState({});
    const [pieChartPlaceCategoryData, setPieChartPlaceCategoryData] = useState(null);
    const [pieChartPlaceCategoryOptions, setPieChartPlaceCategoryOptions] = useState({});
    const [pieChartFoodSupportData, setPieChartFoodSupportData] = useState(null);
    const [pieChartFoodSupportOptions, setPieChartFoodSupportOptions] = useState({});
    const [foodSupportCount, setFoodSupportCount] = useState(0);
    const chartRef = useRef();

    /* Services */
    const { getChartScreenData } = ExternalEvacuationServices;

    const externalEvacueesTallyChartOptions = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: translate(localeJson, 'shelter_place'),
                    align: "end"
                },
                gridLines: {
                    display: false
                },
                offset: true
            },
            y: {
                title: {
                    display: true,
                    text: translate(localeJson, 'people_count'),
                    align: "end"
                },
                ticks: {
                    beginAtZero: true
                },
                gridLines: {
                    display: false
                }
            },
        },
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    title: () => null,
                }
            },
            datalabels: {
                color: 'black',
                anchor: 'end',
                align: 'top',
                offset: 5,
                formatter: function (value, context) {
                    return context.chart.data.labels[context.dataIndex];
                },
            },
            legend: {
                position: "bottom",
                textAlign: "start",
                labels: {
                    usePointStyle: true,
                    pointStyle: "rect",
                },
            },
            beforeLayout: chart => chart.chart.options.scales.xAxes[1].labels = chart.chart.data.datasets.filter(ds => !ds._meta[0].hidden).map(ds => ds.label),
        }
    };

    const externalEvacueesPieChartOptions = {
        plugins: {
            datalabels: {
                color: 'black',
                anchor: 'end',
                align: 'top',
                offset: 5,
                formatter: function (value, context) {
                    return context.chart.data.labels[context.dataIndex];
                },
            },
            legend: {
                position: "bottom",
                labels: {
                    usePointStyle: true
                }
            },
            tooltip: {
                callbacks: {
                    title: () => null,
                    label: function (context) {
                        const dataset = context.dataset;
                        const index = context.dataIndex;
                        const value = dataset.data[index];
                        const total = dataset.data.reduce((acc, val) => acc + val, 0);
                        const percentage = ((value / total) * 100).toFixed(1) + '%';
                        return " " + context.label + ': ' + percentage;
                    },
                },
            },
            subtitle: {
                position: "bottom",
                display: true,
                text: translate(localeJson, 'evacuation_location_aggregation'),
                fontWeight: "light"
            }
        },
        maintainAspectRatio: false
    };

    const externalEvacueesPieChartQuestionOptions = {
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    usePointStyle: true
                },
            },
            tooltip: {
                callbacks: {
                    title: () => null,
                    label: function (context) {
                        const dataset = context.dataset;
                        const index = context.dataIndex;
                        const value = dataset.data[index];
                        const total = dataset.data.reduce((acc, val) => acc + val, 0);
                        const percentage = ((value / total) * 100).toFixed(1) + '%';
                        return " " + context.label + ': ' + percentage;
                    },
                },
            },
            subtitle: {
                position: "bottom",
                display: true,
                text: translate(localeJson, 'food_support_calculation')
            }
        },
        maintainAspectRatio: false
    };

    const onGetExternalEvacueesChartScreenData = () => {
        getChartScreenData({}, getChartScreenViewData);
    }

    const getChartScreenViewData = (response) => {
        console.log(response.aggregations);
        if (response.success && !_.isEmpty(response.aggregations)) {
            let personCountByCenterKeys = response.aggregations.personCountByCenterKeys;
            let personCountByCenter = response.aggregations.personCountByCenter;
            let personCountByFoodRequire = response.aggregations.personCountByFoodRequire;
            let personCountByCategory = response.aggregations.personsCountByCategory;
            setFoodSupportCount(response.aggregations.externalPersonCountOptedFood);
            let personCountCenter = [];
            personCountByCenter.map((item) => {
                let personDataSet = {
                    label: item[0],
                    data: [{ x: 1, y: item[1] }],
                    backgroundColor: 'rgba(31, 119, 180, 1)',
                    borderColor: 'rgb(31, 119, 180)',
                    borderWidth: 1,
                    barPercentage: 0.8,
                    categoryPercentage: 1,
                };
                personCountCenter.push(personDataSet);
            });
            let personCountDataset = {
                datasets: personCountCenter
            };
            setChartData(personCountDataset);
            setChartOptions(externalEvacueesTallyChartOptions);

            let personCountCategory = [
                {
                    "市内": 0,
                },
                {
                    "市外": 0
                },
                {
                    "県外": 0
                },
            ];

            let personCountFoodSupport = [
                {
                    "いいえ": 0,
                },
                {
                    "はい": 0
                }
            ];
            personCountByCategory.map((item, index) => {
                let foundObject = personCountCategory.filter(obj => Object.prototype.hasOwnProperty.call(obj, item[0]));
                if (foundObject) {
                    personCountCategory[index][`${item[0]}`] = item[1];
                }
            });

            personCountByFoodRequire.map((item, index) => {
                let foundObject = personCountFoodSupport.filter(obj => Object.prototype.hasOwnProperty.call(obj, item[0]));
                if (foundObject) {
                    personCountFoodSupport[index][`${item[0]}`] = item[1];
                }
            });
            let getData = [];
            personCountCategory.forEach(obj => {
                for (const key in obj) {
                    getData.push(obj[key])
                }
            });

            console.log(getData);

            let foodData = [];
            personCountFoodSupport.forEach(obj => {
                for (const key in obj) {
                    foodData.push(obj[key])
                }
            });

            console.log(foodData);

            let placeCategoryDataSet = {
                labels: [translate(localeJson, 'city_in'), translate(localeJson, 'city_out'), translate(localeJson, 'pref_out')],
                datasets: [
                    {
                        data: getData,
                        backgroundColor: [
                            'rgba(31, 119, 180, 1)',
                            'rgba(255, 127, 14, 1)',
                            'rgba(44, 160, 44, 1)',
                        ],
                        hoverBackgroundColor: [
                            'rgba(31, 119, 180, 0.6)',
                            'rgba(255, 127, 14, 0.6)',
                            'rgba(44, 160, 44, 0.6)',
                        ]
                    }
                ]
            };
            console.log(placeCategoryDataSet);
            setPieChartPlaceCategoryData(placeCategoryDataSet);
            setPieChartPlaceCategoryOptions(externalEvacueesPieChartOptions);

            let personFoodSupportDataSet = {
                labels: [translate(localeJson, 'no'), translate(localeJson, 'yes')],
                datasets: [
                    {
                        data: foodData,
                        backgroundColor: [
                            'rgba(31, 119, 180, 1)',
                            'rgba(255, 127, 14, 1)',
                            'rgba(44, 160, 44, 1)',
                        ],
                        hoverBackgroundColor: [
                            'rgba(31, 119, 180, 0.6)',
                            'rgba(255, 127, 14, 0.6)',
                            'rgba(44, 160, 44, 0.6)',
                        ]
                    }
                ]
            };
            setPieChartFoodSupportData(personFoodSupportDataSet);
            setPieChartFoodSupportOptions(externalEvacueesPieChartQuestionOptions);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await onGetExternalEvacueesChartScreenData();
            setLoader(false);
        };
        fetchData();
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
                        <h5 className='page-header1'>{translate(localeJson, 'external_evacuees_tally')}</h5>
                        <span>{translate(localeJson, 'external_evacuees_food_support') + ": " + foodSupportCount + translate(localeJson, 'people')}</span>
                    </div>
                    <hr />
                    <div className='flex justify-content-end pt-2'>
                        <Button buttonProps={{
                            text: translate(localeJson, 'external_evacuee_details'),
                            severity: "primary",
                            onClick: () => router.push('/admin/external/family/list'),
                        }} />
                    </div>
                    <div className='mb-2 mt-2'>
                        <Chart type="bar" ref={chartRef} data={chartData} options={chartOptions} style={{ height: '400px' }} />
                    </div>
                    <div className='mt-4 mb-2 flex flex-column sm:flex-row md:flex-row justify-content-around'>
                        <Chart type="pie" data={pieChartPlaceCategoryData} options={pieChartPlaceCategoryOptions} />
                        <Chart type="pie" data={pieChartFoodSupportData} options={pieChartFoodSupportOptions} />
                    </div>
                </div>
            </div>
        </div>
    )
}
