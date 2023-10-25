import React, { useContext, useEffect } from 'react'

import { LayoutContext } from '@/layout/context/layoutcontext';

function ExternalFamilyList() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);

    useEffect(() => {
        const fetchData = async () => {
            setLoader(false);
        };
        fetchData();
    }, [locale]);

    return (
        <div>
            External Family List
        </div>
    )
}

export default ExternalFamilyList;

