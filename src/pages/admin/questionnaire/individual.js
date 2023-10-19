import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from '@/helper'

export default function IndividualQuestionnaire() {
    const { localeJson, setLoader } = useContext(LayoutContext);
    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            setLoader(false);
        };
        fetchData();
    }, []);

    

    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <h5 className='page-header1'>個別項目追加表示(個人ごと)</h5>
                        <hr />
                      
                    </div>
                </div>
            </div>
        </>
    );
}
