import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Staff() {
    const router = useRouter();

    useEffect(() => {
        router.push({
            pathname: '/staff/dashboard',
            query: { hinan: 1 }
        });
    }, []);

    return (
        <></>
    );
}
