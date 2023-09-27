import React, { useState, useEffect } from 'react';
import { OpenCvProvider } from 'opencv-react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useRouter } from 'next/router';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from '@/redux/store';
import { Providers } from "@/redux/provider";
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import { AuthenticationAuthorizationService } from '@/services';

import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '@/styles/layout/layout.scss';
import '@/styles/components/components.scss';
import '@/styles/pages/pages.scss';

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        authCheck(router.asPath);
        const hideContent = () => setAuthorized(false);
        router.events.on('routeChangeStart', hideContent);
        // on route change complete - run auth check 
        router.events.on('routeChangeComplete', authCheck)
        // Unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeStart', hideContent);
            router.events.off('routeChangeComplete', authCheck);
        }
        // setAuthorized(true);
    }, []);

    function authCheck(url) {
        // Redirect to login page if accessing a private page and not logged in 
        const adminPublicPaths = ['/admin/login', '/admin/forgot-password', '/admin/reset-password'];
        const staffPublicPaths = ['/staff/login', '/staff/forgot-password', '/staff/reset-password'];
        const path = url.split('?')[0];
        console.log(path);
        if (AuthenticationAuthorizationService.adminValue && adminPublicPaths.includes(path)) {
            console.log("1");
            router.push({
                pathname: '/admin/dashboard',
            });
        } else if (AuthenticationAuthorizationService.staffValue && staffPublicPaths.includes(path)) {
            console.log("2");
            router.push({
                // pathname: '/staff/dashboard',
                pathname: '/admin/dashboard',
            });
        } else if (path.startsWith('/admin') && !AuthenticationAuthorizationService.adminValue && !adminPublicPaths.includes(path)) {
            console.log("3",path.startsWith('/admin') && !AuthenticationAuthorizationService.adminValue && !adminPublicPaths.includes(path));
            setAuthorized(false);
            router.push({
                pathname: '/admin/login',
            });
        } else if (path.startsWith('/staff') && !AuthenticationAuthorizationService.staffValue && !staffPublicPaths.includes(path)) {
            console.log("4");
            setAuthorized(false);
            router.push({
                // pathname: '/staff/login',
                pathname: '/admin/login',
                // query: { hinan: 1 }
            });
        } else {
            console.log("5", !adminPublicPaths.includes(path));
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