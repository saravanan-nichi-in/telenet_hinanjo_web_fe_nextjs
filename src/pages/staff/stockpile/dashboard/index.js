import React, { useContext, useEffect } from 'react'

import { LayoutContext } from '@/layout/context/layoutcontext';

function StockpileDashboard() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);

    useEffect(() => {
        const fetchData = async () => {
            setLoader(false);
        };
        fetchData();
    }, [locale]);

    return (
        <div>
            Stockpile Dashboard
        </div>
    )
}

export default StockpileDashboard;

