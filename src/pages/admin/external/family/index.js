import React, { useState, useContext, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { useRouter } from 'next/router'

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from '@/helper'
import { Button } from '@/components';
import {
    externalEvacueesPieChartData, externalEvacueesPieChartOptions,
    externalEvacueesPieChartQuestionData, externalEvacueesPieChartQuestionOptions,
    externalEvacueesTallyChartData, externalEvacueesTallyChartOptions
} from '@/utils/constant';


export default function ExternalEvacuees() {
    const { localeJson, setLoader } = useContext(LayoutContext);
    const router = useRouter();
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [pieChartData, setPieChartData] = useState({});
    const [pieChartOptions, setPieChartOptions] = useState({});
    const [pieChartQuestionData, setPieChartQuestionData] = useState({});
    const [pieChartQuestionOptions, setPieChartQuestionOptions] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            await setChartData(externalEvacueesTallyChartData);
            await setChartOptions(externalEvacueesTallyChartOptions);
            await setPieChartData(externalEvacueesPieChartData);
            await setPieChartOptions(externalEvacueesPieChartOptions);
            await setPieChartQuestionData(externalEvacueesPieChartQuestionData);
            await setPieChartQuestionOptions(externalEvacueesPieChartQuestionOptions);
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
                        <span>{translate(localeJson, 'external_evacuees_food_support') + ": 39人"}</span>
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
