import React, { useState, useContext, useEffect } from 'react';
import { Chart } from 'primereact/chart';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from '@/helper'
import { Button } from '@/components';


export default function ExternalEvacuees() {
    const { localeJson } = useContext(LayoutContext);
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [pieChartData, setPieChartData] = useState({});
    const [pieChartOptions, setPieChartOptions] = useState({});
    const [pieChartQuestionData, setPieChartQuestionData] = useState({});
    const [pieChartQuestionOptions, setPieChartQuestionOptions] = useState({});

    useEffect(() => {
        const data = {
            datasets: [{
                label: 'Vacant test',
                data: [{ x: 1, y: 32 }],
                backgroundColor: 'rgba(31, 119, 180, 1)',
                borderColor: 'rgb(31, 119, 180)',
                borderWidth: 1,
                categoryPercentage: 1
            },
            {
                label: 'Starting To get crowded',
                data: [{ x: 2, y: 2 }],
                backgroundColor: 'rgba(255, 127, 14, 1)',
                borderColor: 'rgb(255, 127, 14)',
                borderWidth: 1,
                categoryPercentage: 1
            },
            {
                label: 'Crowded',
                data: [{ x: 3, y: 1 }],
                backgroundColor: 'rgba(44, 160, 44, 1)',
                borderColor: 'rgb(44, 160, 44)',
                borderWidth: 1,
                categoryPercentage: 1
            },
            {
                label: 'Nara',
                data: [{ x: 4, y: 1 }],
                backgroundColor: 'rgba(214, 39, 40, 0.2)',
                borderColor: 'rgb(214, 39, 40)',
                borderWidth: 1,
                categoryPercentage: 1
            }]
        };

        const options = {
            tooltips: {
                callbacks: {
                    title: () => "fgdFGH"
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    },
                    gridLines: {
                        display: false
                    }
                }],
                xAxes: [{
                    display: false,
                    gridLines: {
                        display: false
                    }
                },
                {
                    offset: true,
                    gridLines: {
                        display: false
                    }
                }],
                x: {
                    title: {
                        display: true,
                        text: "避難所",
                        align: "end"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "人数",
                        align: "end"
                    }
                },
            },
            maintainAspectRatio: false,
            plugins: {
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

        const pieChartData = {
            labels: ['市内', '市外', '県外'],
            datasets: [
                {
                    data: [29, 2, 2],
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
        }
        const pieChartOptions = {
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        const dataset = data.datasets[tooltipItem.datasetIndex];
                        const index = tooltipItem.index;
                        const value = dataset.data[index];
                        const total = dataset.data.reduce((acc, val) => acc + val, 0);
                        const percentage = ((value / total) * 100).toFixed(2) + '%';
                        return data.labels[index] + ': ' + percentage;
                    },
                },
            },
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        usePointStyle: true
                    }
                },
                subtitle: {
                    position: "bottom",
                    display: true,
                    text: '(避難している場所ごとの集計)',
                    fontWeight: "light"
                }
            },
            maintainAspectRatio: false
        };
        const pieChartQuestionData = {
            labels: ['はい', 'いいえ'],
            datasets: [
                {
                    data: [35, 2],
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
        }
        const pieChartQuestionOptions = {
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        usePointStyle: true
                    },
                },
                subtitle: {
                    position: "bottom",
                    display: true,
                    text: '(食糧等支援の有無集計)'
                }
            },
            maintainAspectRatio: false
        };
        setChartData(data);
        setChartOptions(options);
        setPieChartData(pieChartData);
        setPieChartOptions(pieChartOptions);
        setPieChartQuestionData(pieChartQuestionData);
        setPieChartQuestionOptions(pieChartQuestionOptions);
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
                        <h5 className='page-header1'>{translate(localeJson, 'external_evacuees_tally')}</h5>
                        <span>{translate(localeJson, 'external_evacuees_food_support') + ": 39人"}</span>
                    </div>
                    <hr />
                    <div className='flex justify-content-end pt-2'>
                        <Button buttonProps={{
                            text: translate(localeJson, "external_evacuee_details"),
                            severity: "primary"
                        }} />
                    </div>
                    <div className='mb-2 mt-2'>
                        <Chart type="bar" data={chartData} options={chartOptions} style={{ height: '400px' }} />
                    </div>
                    <div className='mt-4 mb-2 flex flex-column sm:flex-row md:flex-row justify-content-around'>
                        <Chart type="pie" data={pieChartData} options={pieChartOptions} />
                        <Chart type="pie" data={pieChartQuestionData} options={pieChartQuestionOptions} />
                    </div>
                </div>
            </div>
        </div>
    )
}
