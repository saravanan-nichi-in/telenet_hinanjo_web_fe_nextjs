import React, { useContext, useEffect } from 'react'

import { LayoutContext } from '@/layout/context/layoutcontext';

function RegisterCheckIn() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);

    useEffect(() => {
        const fetchData = async () => {
            setLoader(false);
        };
        fetchData();
    }, [locale]);

    return (
        <div>
            Register Check In
        </div>
    )
}

export default RegisterCheckIn;

