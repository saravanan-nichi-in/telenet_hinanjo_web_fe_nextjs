import React, { useState, useEffect } from 'react';
import { Providers } from "@/redux/provider";
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import { OpenCvProvider } from 'opencv-react';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '@/styles/layout/layout.scss';
import '@/styles/components/components.scss';
import { useRouter } from 'next/router';
import axios from '@/utils/api';
import { AuthenticationAuthorizationService } from '@/services';

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // on initial load - run auth check 
        authCheck(router.asPath);

        // on route change start - hide page content by setting authorized to false  
        const hideContent = () => setAuthorized(false);
        router.events.on('routeChangeStart', hideContent);

        // on route change complete - run auth check 
        router.events.on('routeChangeComplete', authCheck)

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeStart', hideContent);
            router.events.off('routeChangeComplete', authCheck);
        }
    }, []);

    function authCheck(url) {
        // redirect to login page if accessing a private page and not logged in 
        setUser(AuthenticationAuthorizationService.userValue);
        const publicPaths = ['/auth/login', '/auth/register'];
        const path = url.split('?')[0];
        if (!AuthenticationAuthorizationService.userValue && !publicPaths.includes(path)) {
            setAuthorized(false);
            router.push({
                pathname: '/auth/login',
            });
        } else {
            setAuthorized(true);
        }
    }

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

    if (Component.getLayout) {
        return (
            <OpenCvProvider>
                <Providers>
                    <LayoutProvider>
                        {authorized && (
                            <>
                                {Component.getLayout(<Component {...pageProps} />)}
                            </>
                        )}
                    </LayoutProvider>
                </Providers>
            </OpenCvProvider>
        )
    } else {
        return (
            authorized && (
                <OpenCvProvider>
                    <Providers>
                        <LayoutProvider>
                            {authorized && (
                                <Layout>
                                    <Component {...pageProps} />
                                </Layout>
                            )}
                        </LayoutProvider>
                    </Providers>
                </OpenCvProvider>
            )
        );
    }
}

export default MyApp;
