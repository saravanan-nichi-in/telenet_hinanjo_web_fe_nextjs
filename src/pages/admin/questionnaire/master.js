import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from '@/helper'
import { BaseTemplate } from '@/components/questionarrie';
// import BaseTemplate from '@/components/questionarrie/template/baseTemplate';
import { AiOutlineDrag } from 'react-icons/ai';
import { DND, NormalCheckBox } from '@/components';

export default function MasterQuestionnaire() {
    const { localeJson, setLoader } = useContext(LayoutContext);
    const [questionnaires, setQuestionnaires] = useState([{
        "title": "ROW1",
        "questiontitle": "selc",
        "questiontitle_en": "",
        "option": ["selection", "rejection"],
        "option_en": [" "]
    }, {
        "title": "ROW2",
        "questiontitle": "selcti",
        "questiontitle_en": "san",
        "option": ["selection", "rejection"," "],
        "option_en": [" a"]
        }]);

    const router = useRouter();

    const dragProps = {
        onDragEnd(fromIndex, toIndex) {
            const prepareData = [...questionnaires];
            const item = prepareData.splice(fromIndex, 1)[0];
            prepareData.splice(toIndex, 0, item);
            setQuestionnaires(prepareData);

        },
        nodeSelector: 'li',
        handleSelector: 'a'
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoader(false);
        };
        
        fetchData();
    }, []);

    const handleOnDrag = (event) => {
        setQuestionnaires(event.value);
    }
    const map = (
        <ol>
            {questionnaires.map((index) => (
                <li key={index}>
                    {/* <NormalCheckBox checkBoxProps={{
                        checked: true,
                    }} /> */}
                    {/* <div>
                    {item.title}

                    </div> */}
                    <div className='ml-1 mr-1'>
                    <BaseTemplate
                            questionnaires={questionnaires}
                            handleOnDrag={handleOnDrag}
                        />
                    </div>
                    <a className='ml-2'>
                        <AiOutlineDrag />
                    </a>
                </li>

            ))}
        </ol>
    )

    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <h5 className='page-header1'>{translate(localeJson, 'questionnaire')}</h5>
                        <hr />
                        <DND dragProps={dragProps}
                                                    >
                                                        {map}
                                                    </DND>
                    </div>
                </div>
            </div>
        </>
    );
}
