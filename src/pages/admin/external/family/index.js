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
            datasets: [
                {
                    label: 'Vacant test',
                    data: [32, 1, 1, 1],
                    backgroundColor: [
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgb(255, 159, 64)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)'

                    ],
                    borderWidth: 1,
                }
            ],

        };

        const options = {
            scales: {
                y: {
                    beginAtZero: true,
                    label: "人数"
                },
                x: {
                    label: "避難所"
                }
            },
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true
                    }
                }
            }
        };
        const documentStyle = getComputedStyle(document.documentElement);
        const pieChartData = {
            labels: ['市内', '市外', '県外'],
            datasets: [
                {
                    data: [29, 2, 2],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--green-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400'),
                        documentStyle.getPropertyValue('--yellow-400'),
                        documentStyle.getPropertyValue('--green-400')
                    ]
                }
            ]
        }
        const pieChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true
                    }
                }
            }
        };
        const pieChartQuestionData = {
            labels: ['はい', 'いいえ'],
            datasets: [
                {
                    data: [35, 2],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--green-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400'),
                        documentStyle.getPropertyValue('--yellow-400'),
                        documentStyle.getPropertyValue('--green-400')
                    ]
                }
            ]
        }
        const pieChartQuestionOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true
                    }
                }
            }
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
                        <span>{translate(localeJson, 'external_evacuees_count') + ": 39人"}</span>
                    </div>
                    <hr />
                    <div className='flex justify-content-end pt-2'>
                        <Button buttonProps={{
                            text: translate(localeJson, "external_evacuee_details"),
                            severity: "primary"
                        }} />
                    </div>
                    <div className='mb-2'>
                        <Chart type="bar" data={chartData} options={chartOptions} />
                    </div>

                    <div className='mb-2' style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
                        <Chart type="pie" data={pieChartData} options={pieChartOptions} className="w-full md:w-30rem" />
                        <Chart type="pie" data={pieChartQuestionData} options={pieChartQuestionOptions} className="w-full md:w-30rem" />
                    </div>

                </div>
            </div>
        </div>
    )
}
