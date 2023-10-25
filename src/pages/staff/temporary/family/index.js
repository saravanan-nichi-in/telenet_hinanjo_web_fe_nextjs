import React, { useContext, useEffect } from 'react'

import { LayoutContext } from '@/layout/context/layoutcontext';

function TemporaryFamily() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);

    useEffect(() => {
        const fetchData = async () => {
            setLoader(false);
        };
        fetchData();
    }, [locale]);

    return (
        <div>
            Temporary Family
        </div>
    )
}

export default TemporaryFamily;

