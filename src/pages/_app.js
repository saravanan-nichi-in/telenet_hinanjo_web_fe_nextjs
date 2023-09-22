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
import 'primeflex/primeflex.css'; // Import PrimeFlex CSS
import '@/styles/layout/layout.scss';
import '@/styles/components/components.scss';
import '@/styles/pages/pages.scss';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from '@/redux/store'; // Your Redux store

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // authCheck(router.asPath);
        // const hideContent = () => setAuthorized(false);
        // router.events.on('routeChangeStart', hideContent);
        // // on route change complete - run auth check 
        // router.events.on('routeChangeComplete', authCheck)
        // // Unsubscribe from events in useEffect return function
        // return () => {
        //     router.events.off('routeChangeStart', hideContent);
        //     router.events.off('routeChangeComplete', authCheck);
        // }
        setAuthorized(true);
    }, []);

    function authCheck(url) {
        // Redirect to login page if accessing a private page and not logged in 
        const adminPublicPaths = ['/admin/login', '/admin/forgot-password', '/admin/reset-password'];
        const staffPublicPaths = ['/staff/login', '/staff/forgot-password', '/staff/reset-password'];
        const path = url.split('?')[0];
        if (AuthenticationAuthorizationService.adminValue && adminPublicPaths.includes(path)) {
            router.push({
                pathname: '/admin/dashboard',
            });
        } else if (AuthenticationAuthorizationService.staffValue && staffPublicPaths.includes(path)) {
            router.push({
                pathname: '/staff/dashboard',
            });
        } else if (path.startsWith('/admin') && !AuthenticationAuthorizationService.adminValue && !adminPublicPaths.includes(path)) {
            setAuthorized(false);
            router.push({
                pathname: '/admin/login',
            });
        } else if (path.startsWith('/staff') && !AuthenticationAuthorizationService.staffValue && !staffPublicPaths.includes(path)) {
            setAuthorized(false);
            router.push({
                pathname: '/staff/login',
                query: { hinan: 1 }
            });
        } else {
            setAuthorized(true);
        }
    }

    return (
        <OpenCvProvider>
            <Providers>
                <PersistGate loading={null} persistor={persistor}>
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
                </PersistGate>
            </Providers>
        </OpenCvProvider>
    )
}

export default MyApp;