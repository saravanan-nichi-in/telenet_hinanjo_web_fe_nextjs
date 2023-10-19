import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from '@/helper'
import { BaseTemplate } from '@/components/questionarrie';
// import BaseTemplate from '@/components/questionarrie/template/baseTemplate';

export default function MasterQuestionnaire() {
    const { localeJson, setLoader } = useContext(LayoutContext);
    const [questionnaires, setQuestionnaires] = useState([]);

    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            setLoader(false);
        };
        let prepareData = [{
            "title": "ROW1",
            "questiontitle": "selc",
            "questiontitle_en": "",
            "option": ["selection", "rejection"],
            "option_en": [" "]
        }, {
            "title": "ROW2",
            "questiontitle": "selcti",
            "questiontitle_en": "",
            "option": ["selection", "rejection", "failure"],
            "option_en": [" "]
        }]
        setQuestionnaires(prepareData);
        fetchData();
    }, []);

    const handleOnDrag = (event) => {
        setQuestionnaires(event.value);
    }

    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <h5 className='page-header1'>{translate(localeJson, 'questionnaire')}</h5>
                        <hr />
                        <BaseTemplate
                            questionnaires={questionnaires}
                            handleOnDrag={handleOnDrag}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
