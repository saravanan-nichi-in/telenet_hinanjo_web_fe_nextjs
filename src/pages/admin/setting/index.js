import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

import { LayoutContext } from '@/layout/context/layoutcontext';

export default function Setting() {
    const { setLoader } = useContext(LayoutContext);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            setLoader(false);
        };
        fetchData();
    }, []);

    return (
        <>Setting</>
    );
}
