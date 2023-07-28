import React, { useEffect } from 'react';
import axios from '@/utils/api';
import { useOpenCv } from 'opencv-react';
import { useRouter } from 'next/router';
import { parse } from 'cookie';
import { checkAuthenticationStatus, loggedIn } from '@/utils/auth';

function Dashboard({ ctx }) {
    // Load opencv on initial render of application
    useOpenCv();

    const router = useRouter();

    useEffect(() => {
        const isLoggedIn = loggedIn('profile');
        if (isLoggedIn) {
            router.push('admin/dashboard');
        } else {
            router.push('auth/login');
        }

        (async () => {
            try {
                console.log("2");
                fetchData();
            } catch (error) {
                // Handle errors, if any
                console.error('Error fetching data:', error);
            }
        })();
    }, []);

    // Function to fetch data from the API
    const fetchData = async () => {
        try {
            const res = await axios.get('posts')
            const posts = await res.data;
            console.log(posts);
            return posts;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <div>
                    </div>
                    <section className='col-12 text-center'>
                        <span className="block text-6xl font-bold mb-1" onClick={() => fetchData()}>Dashboard</span>
                    </section>
                </div>
            </div>
        </div>
    );
}

// export async function getServerSideProps(ctx) {
//     const cookies = parse(ctx.req.headers.cookie || ''); // Parse cookies from the request headers
//     const isLoggedIn = await checkAuthenticationStatus(cookies); // Implement this function to check authentication

//     if (!isLoggedIn) {
//         return {
//             redirect: {
//                 destination: 'auth/login',
//                 permanent: false, // Set this to true if the redirect is permanent
//             },
//         };
//     }

//     return {
//         props: {
//             ctx
//         },
//     };
// }

export default Dashboard;
