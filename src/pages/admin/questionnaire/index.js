import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

import { LayoutContext } from '@/layout/context/layoutcontext';

export default function Questionnaire() {
    const { setLoader } = useContext(LayoutContext);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            setLoader(false);
        };
        fetchData();
    }, []);

    return (
        <>Questionnaire</>
    );
}
