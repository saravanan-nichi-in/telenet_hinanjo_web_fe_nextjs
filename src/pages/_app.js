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
import _ from 'lodash';
import { Toaster } from 'react-hot-toast';

/**
 * Import global CSS for entire application
*/
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
    const toastStyle = {
        padding: '10px',
        color: '#2b3d51',
        borderRadius: '5px',
    };

    /**
     * Function to delete the current theme link
     */
    const deleteCurrentTheme = () => {
        const themeLink = document.getElementById('theme-css');
        if (themeLink) {
            themeLink.parentNode.removeChild(themeLink);
        }
    };

    /**
     * Function to load a new theme
     */
    const loadNewTheme = (url) => {
        const path = url.split('?')[0];
        const role = path.startsWith('/admin') ? 'admin' : path.startsWith('/staff') ? 'staff' : path.startsWith('/hq-staff') ? 'hq-staff' : 'default';
        const themeLink = document.getElementById('theme-css');
        const getThemeApplied = themeLink.href.split('/')[4];
        const getURLPresent = url.split('/')[1];
        if (getURLPresent != 'user' && getURLPresent != getThemeApplied) {
            deleteCurrentTheme(); // Delete the current theme first
            const link = document.createElement('link');
            link.id = 'theme-css';
            link.rel = 'stylesheet';
            link.href = `/themes/${role}/theme.css`;
            document.head.appendChild(link); // Append the new theme link to the head
        } else if (getURLPresent == 'user') {
            if (getThemeApplied != 'default') {
                deleteCurrentTheme(); // Delete the current theme first
                const link = document.createElement('link');
                link.id = 'theme-css';
                link.rel = 'stylesheet';
                link.href = `/themes/${role}/theme.css`;
                document.head.appendChild(link); // Append the new theme link to the head
            }
        }
    };

    /**
     * Life cycle to load theme
     */
    useEffect(() => {
        // loadNewTheme(router.asPath); // Load the initial theme on component mount
        router.events.on('routeChangeComplete', (url) => {
            loadNewTheme(url); // Load the initial theme on component mount
        })
    }, [])

    /**
     * Check authorization & authentication
     */
    useEffect(() => {
        authCheck(router.asPath);
        router.events.on('routeChangeComplete', () => {
            setAuthorized(true);
        })
    }, []);

    /**
     * Function will help to redirect specific location
     * @param {*} url 
     */
    function authCheck(url) {
        const adminPublicPaths = [
            '/admin/login',
            '/admin/login/',
            '/admin/forgot-password',
            '/admin/forgot-password/',
            '/admin/reset-password',
            '/admin/reset-password/'
        ];
        const staffPublicPathsWithoutLogin = [
            '/staff/forgot-password',
            '/staff/forgot-password/',
            '/staff/reset-password',
            '/staff/reset-password/'
        ];
        const staffPublicPathsWithLogin = [
            '/staff/login',
            '/staff/login/',
            '/staff/forgot-password',
            '/staff/forgot-password/',
            '/staff/reset-password',
            '/staff/reset-password/'
        ];
        const hqStaffPublicPaths = [
            '/hq-staff/login',
            '/hq-staff/login/',
            '/hq-staff/forgot-password',
            '/hq-staff/forgot-password/',
            '/hq-staff/reset-password',
            '/hq-staff/reset-password/'
        ];
        const path = url.split('?')[0];
        const queryString = url.split('?')[1];
        if (path.startsWith('/admin')) {
            if (_.isNull(AuthenticationAuthorizationService.adminValue)) {
                if (!adminPublicPaths.includes(path)) {
                    router.push({
                        pathname: '/admin/login',
                        query: queryString
                    });
                } else {
                    router.push({
                        pathname: path,
                        query: queryString
                    });
                }
            } else {
                if (adminPublicPaths.includes(path)) {
                    router.push({
                        pathname: '/admin/dashboard',
                    });
                } else {
                    router.push({
                        pathname: path,
                        query: queryString
                    });
                }
            }
        } else if (path.startsWith('/staff')) {
            if (_.isNull(AuthenticationAuthorizationService.staffValue)) {
                if (!staffPublicPathsWithoutLogin.includes(path)) {
                    router.push('/user/list');
                } else {
                    router.push({
                        pathname: path,
                        query: queryString
                    });
                }
            } else {
                if (staffPublicPathsWithLogin.includes(path)) {
                    router.push({
                        pathname: '/user/list',
                    });
                } else {
                    router.push({
                        pathname: path,
                        query: queryString
                    });
                }
            }
        } else if (path.startsWith('/hq-staff')) {
            if (_.isNull(AuthenticationAuthorizationService.hqStaffValue)) {
                if (!hqStaffPublicPaths.includes(path)) {
                    router.push('/hq-staff/login');
                } else {
                    router.push({
                        pathname: path,
                        query: queryString
                    });
                }
            } else {
                if (hqStaffPublicPaths.includes(path)) {
                    router.push({
                        pathname: '/hq-staff/dashboard',
                    });
                } else {
                    router.push({
                        pathname: path,
                        query: queryString
                    });
                }
            }
        } else if (path == '/user' || path == '/user/') {
            router.push('/user/list');
        } else {
            setAuthorized(true);
        }
    }

    return (
        <OpenCvProvider>
            <Providers>
                <PersistGate loading={null} persistor={persistor}>
                    <LayoutProvider>
                        <Toaster
                            reverseOrder={true}
                            toastOptions={{
                                duration: 5000,
                                style: toastStyle
                            }}
                        />
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
                                {/* Development */}
                                {/* <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" /> */}
                                {"Loading..."}
                            </div>
                        )}
                    </LayoutProvider>
                </PersistGate>
            </Providers>
        </OpenCvProvider>
    );
}

export default MyApp;