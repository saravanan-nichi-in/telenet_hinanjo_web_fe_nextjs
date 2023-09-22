import React, { useState, useContext } from 'react';
import { Chart } from 'primereact/chart';

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { DividerComponent, Select } from '@/components';

const BarChartDemo = () => {
    const { localeJson } = useContext(LayoutContext);
    const options = [
        { label: '現在の避難者数', value: 'NY' },
        { label: '避難所の混雑率', value: 'RM' },
        { label: '要配慮者の避難者数', value: 'LDN' },
    ];
    const [data, setData] = useState(options[0].value);
    const [basicData] = useState({
        labels: ['日本の避難所', '広島市中区東白島町', 'テスト', 'テスト日本大阪', '避難所B	', '<Test>モバイルアプリ1', 'Gose'],
        datasets: [
            {
                type: 'bar',
                label: '男',
                backgroundColor: '#42A5F5',
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                type: 'bar',
                label: '女',
                backgroundColor: '#66BB6A',
                data: [28, 48, 40, 19, 86, 27, 90]
            },
            {
                type: 'bar',
                label: '答えくない',
                backgroundColor: '#FFA726',
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    });
    const getLightTheme = () => {
        let horizontalOptions = {
            maintainAspectRatio: false,
            indexAxis: 'y',
            aspectRatio: 0.8,
            plugins: {
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    min: 0,
                    max: 300,
                    stacked: true,
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {

                    stacked: true,
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };
        return {
            horizontalOptions
        }
    }
    const { horizontalOptions } = getLightTheme();

    return (
        <div>
            <div className="card">
                <h5 className='page_header'> {translate(localeJson, 'statistics')}</h5>
                <DividerComponent />
                <Select selectProps={{
                    selectClass: "custom_dropdown_items",
                    value: data,
                    options: options,
                    onChange: (e) => setData(e.value),
                    placeholder: "Select a City"
                }}
                    parentClass={"custom_select"}
                />
                <Chart type="bar" data={basicData} options={horizontalOptions} />
            </div>
        </div>
    )
}

export default BarChartDemo