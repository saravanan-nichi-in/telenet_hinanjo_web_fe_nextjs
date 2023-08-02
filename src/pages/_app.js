import React, { useState, useEffect } from 'react';
import { Providers } from "@/redux/provider";
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import { OpenCvProvider } from 'opencv-react';
import { useRouter } from 'next/router';
import { AuthenticationAuthorizationService } from '@/services';
import { ProgressSpinner } from 'primereact/progressspinner';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '@/styles/layout/layout.scss';
import '@/styles/components/components.scss';
import '@/styles/pages/pages.scss';

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        authCheck(router.asPath);
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
        const publicPaths = ['/admin/login', '/staff/login', '/admin/forgot-password', '/staff/forgot-password', '/admin/reset-password', '/staff/reset-password'];
        const path = url.split('?')[0];
        if (path.startsWith('/admin') && !AuthenticationAuthorizationService.adminValue && !publicPaths.includes(path)) {
            setAuthorized(false);
            router.push({
                pathname: '/admin/login',
            });
        } else if (path.startsWith('/staff') && !AuthenticationAuthorizationService.staffValue && !publicPaths.includes(path)) {
            setAuthorized(false);
            router.push({
                pathname: '/staff/login',
            });
        } else {
            setAuthorized(true);
        }
    }

    return (
        <OpenCvProvider>
            <Providers>
                <LayoutProvider>
                    {authorized ? (
                        Component.getLayout ? (
                            <>
                                {Component.getLayout(<Component {...pageProps} />)}
                            </>
                        ) : (
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        )
                    ) : (
                        <div style={{
                            height: '100vh',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                        </div>
                    )}
                </LayoutProvider>
            </Providers>
        </OpenCvProvider>
    )
}

export default MyApp;