import React, { useState, useContext, useEffect } from 'react';
import { Chart } from 'primereact/chart';

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { SelectFloatLabel } from '@/components/dropdown';
import {
    considerationEvacueesCountData, considerationEvacueesCountOptions,
    currentEvacueesCountData, currentEvacueesCountOptions, evacuationCenterCrowdingRateData, evacuationCenterCrowdingRateOptions, evacueesShelterOptions
} from '@/utils/constant';

export default function EvacueesStatistics() {
    const { localeJson } = useContext(LayoutContext);
    const [horizontalOptions, setHorizontalOptions] = useState(null);
    const [data, setData] = useState(evacueesShelterOptions[0].value);
    const [chartData, setChartData] = useState({});


    useEffect(() => {
        if (data == evacueesShelterOptions[0].value) {
            setChartData(currentEvacueesCountData);
            setHorizontalOptions(currentEvacueesCountOptions);
        }
        else if (data == evacueesShelterOptions[1].value) {
            setChartData(evacuationCenterCrowdingRateData);
            setHorizontalOptions(evacuationCenterCrowdingRateOptions);
        }
        else {
            setChartData(considerationEvacueesCountData);
            setHorizontalOptions(considerationEvacueesCountOptions);
        }
    }, [data]);


    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <h5 className='page_header'> {translate(localeJson, 'statistics')}</h5>
                    <hr />
                    <SelectFloatLabel
                        selectFloatLabelProps={{
                            inputId: "statisticsType",
                            value: data,
                            options: evacueesShelterOptions,
                            optionLabel: "name",
                            selectClass: "w-full lg:w-13rem md:w-14rem sm:w-10rem",
                            style: { height: "40px" },
                            onChange: (e) => setData(e.value),
                        }}
                        parentClass="w-20rem lg:w-13rem md:w-14rem sm:w-10rem pt-2 pb-2"
                    />
                    <Chart type="bar" data={chartData} options={horizontalOptions} />
                </div>
            </div>
        </div>
    )
}