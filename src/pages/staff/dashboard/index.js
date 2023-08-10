import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import Link from 'next/link';
import { round } from 'lodash';
import { LayoutContext } from '@/layout/context/layoutcontext';

export default function Dashboard() {
    const { layoutConfig } = useContext(LayoutContext);
    const [data, setChartData] = useState({});
    const [options, setOptions] = useState({});

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const polarData = {
            datasets: [
                {
                    data: [11, 16, 7, 3],
                    backgroundColor: [documentStyle.getPropertyValue('--indigo-500'), documentStyle.getPropertyValue('--purple-500'), documentStyle.getPropertyValue('--teal-500'), documentStyle.getPropertyValue('--orange-500')],
                    label: 'My dataset'
                }
            ],
            labels: ['Indigo', 'Purple', 'Teal', 'Orange']
        };

        const polarOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        const pieData = {
            labels: ['収容状況', '要配慮者'],
            datasets: [
                {
                    data: [200, 400],
                    backgroundColor: [documentStyle.getPropertyValue('--indigo-500'), documentStyle.getPropertyValue('--teal-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--indigo-400'), documentStyle.getPropertyValue('--teal-400')]
                }
            ]
        };

        const pieOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };

        setOptions({
            polarOptions,
            pieOptions,
        });
        setChartData({
            polarData,
            pieData,
        });
    }, [layoutConfig])

    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-6">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">避難可能人数</span>
                            <div className="text-900 font-medium text-xl">20000	人</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-map-marker text-blue-500 text-xl" />
                        </div>
                    </div>
                    {/* <span className="text-green-500 font-medium">24 new </span>
                    <span className="text-500">since last visit</span> */}
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-6">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">世帯数</span>
                            <div className="text-900 font-medium text-xl">61 世帯</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-map-marker text-orange-500 text-xl" />
                        </div>
                    </div>
                    {/* <span className="text-green-500 font-medium">%52+ </span>
                    <span className="text-500">since last week</span> */}
                </div>
            </div>
            {/* <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Customers</span>
                            <div className="text-900 font-medium text-xl">28441</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-inbox text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">520 </span>
                    <span className="text-500">newly registered</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Comments</span>
                            <div className="text-900 font-medium text-xl">152 Unread</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-comment text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">85 </span>
                    <span className="text-500">responded</span>
                </div>
            </div> */}

            {/* <div className="col-12 lg:col-6 xl:col-6">
                <div className="card">
                    <div className="flex justify-content-between align-items-center mb-5">
                        <h5>収容状況</h5>
                        <div>
                            <Button type="button" icon="pi pi-ellipsis-v" className="p-button-rounded p-button-text p-button-plain" />
                        </div>
                    </div>
                    <ul className="list-none p-0 m-0">
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">現在の避難者数</span>
                                <div className="mt-1 text-600">避難可能人数</div>
                            </div>
                            <div className="mt-2 md:mt-0 flex align-items-center">
                                <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                    <div className="bg-orange-500 h-full" style={{ width: `${round((4077 / 20000) * 100)}%` }} />
                                </div>
                                <span className="text-orange-500 ml-3 font-medium">{`${round((4077 / 20000) * 100)}% 人`}</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">追加受入可能人数</span>
                                <div className="mt-1 text-600">避難可能人数</div>
                            </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                    <div className="bg-cyan-500 h-full" style={{ width: `${round((15923 / 20000) * 100)}%` }} />
                                </div>
                                <span className="text-cyan-500 ml-3 font-medium">{`${round((15923 / 20000) * 100)}% 人`}</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">＜内訳＞</span>
                                <div className="mt-1 text-600">世帯数</div>
                            </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                    <div className="bg-pink-500 h-full" style={{ width: `${round((0 / 61) * 100)}%` }} />
                                </div>
                                <span className="text-pink-500 ml-3 font-medium">{`0${round((0 / 61) * 100)}% 人`}</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">避難者数(うち男性)</span>
                                <div className="mt-1 text-600">世帯数</div>
                            </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                    <div className="bg-green-500 h-full" style={{ width: `${round((42 / 61) * 100)}%` }} />
                                </div>
                                <span className="text-green-500 ml-3 font-medium">{`${round((42 / 61) * 100)}% 人`}</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">避難者数(うち女性)</span>
                                <div className="mt-1 text-600">世帯数</div>
                            </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                    <div className="bg-purple-500 h-full" style={{ width: `${round((26 / 61) * 100)}%` }} />
                                </div>
                                <span className="text-purple-500 ml-3 font-medium">{`${round((26 / 61) * 100)}% 人`}</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">避難者数(うち答えたくない)</span>
                                <div className="mt-1 text-600">世帯数</div>
                            </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                    <div className="bg-teal-500 h-full" style={{ width: `${round((9 / 61) * 100)}%` }} />
                                </div>
                                <span className="text-teal-500 ml-3 font-medium">{`${round((9 / 61) * 100)}% 人`}</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">人数カウントのみ</span>
                                <div className="mt-1 text-600">世帯数</div>
                            </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                    <div className="bg-orange-500 h-full" style={{ width: `${round((4000 / 4000) * 100)}%` }} />
                                </div>
                                <span className="text-teal-500 ml-3 font-medium">{`${round((4000 / 4000) * 100)}% 人`}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-6">
                <div className="card">
                    <div className="flex justify-content-between align-items-center mb-5">
                        <h5>要配慮者</h5>
                        <div>
                            <Button type="button" icon="pi pi-ellipsis-v" className="p-button-rounded p-button-text p-button-plain" />
                        </div>
                    </div>
                    <ul className="list-none p-0 m-0">
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">妊産婦</span>
                                <div className="mt-1 text-600">要配慮者</div>
                            </div>
                            <div className="mt-2 md:mt-0 flex align-items-center">
                                <span className="text-orange-500 ml-3 font-medium">9 人</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">乳幼児</span>
                                <div className="mt-1 text-600">要配慮者</div>
                            </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <span className="text-cyan-500 ml-3 font-medium">21	人</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">障がい者</span>
                                <div className="mt-1 text-600">要配慮者</div>
                            </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <span className="text-pink-500 ml-3 font-medium">19	人</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">要介護者</span>
                                <div className="mt-1 text-600">要配慮者</div>
                            </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <span className="text-green-500 ml-3 font-medium">3	人</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">医療機器利用者</span>
                                <div className="mt-1 text-600">要配慮者</div>
                            </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <span className="text-purple-500 ml-3 font-medium">4 人</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">アレルギー</span>
                                <div className="mt-1 text-600">要配慮者</div>
                            </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <span className="text-teal-500 ml-3 font-medium">3 人</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">外国籍</span>
                                <div className="mt-1 text-600">要配慮者</div>
                            </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <span className="text-teal-500 ml-3 font-medium">6 人</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">新生児</span>
                                <div className="mt-1 text-600">要配慮者</div>
                            </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <span className="text-teal-500 ml-3 font-medium">4 人</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">その他</span>
                                <div className="mt-1 text-600">要配慮者</div>
                            </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <span className="text-teal-500 ml-3 font-medium">23 人</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Dev テスト</span>
                                <div className="mt-1 text-600">要配慮者</div>
                            </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <span className="text-teal-500 ml-3 font-medium">38 人</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">test data</span>
                                <div className="mt-1 text-600">要配慮者</div>
                            </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <span className="text-teal-500 ml-3 font-medium">134 人</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div> */}
            {/* <div className="col-12">
                <div className="card flex flex-column align-items-center">
                    <h5 className="text-left w-full">Polar Area Chart</h5>
                    <Chart type="polarArea" data={data.polarData} options={options.polarOptions}></Chart>
                </div>
            </div> */}
            <div className="col-12">
                <div className="card flex flex-column align-items-center">
                    <h5 className="text-left w-full">避難所の状況</h5>
                    <Chart type="pie" data={data.pieData} options={options.pieOptions}></Chart>
                </div>
            </div>
        </div>
    )
}
