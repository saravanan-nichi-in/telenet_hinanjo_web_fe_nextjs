import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import jpJson from '../../../public/locales/jp/lang.json'
import enJson from '../../../public/locales/en/lang.json'
import { CommonServices } from '@/services';
import { useAppDispatch } from '@/redux/hooks';
import { setLayout } from "@/redux/layout";
import WebFxScan from '../../../public/scan';

const URLS = [
    '/admin/login',
    '/admin/login/',
    '/admin/forgot-password',
    '/admin/forgot-password/',
    '/admin/reset-password',
    '/admin/reset-password/',
    '/staff/login',
    '/staff/login/',
    '/staff/forgot-password',
    '/staff/forgot-password/',
    '/staff/reset-password',
    '/staff/reset-password/',
    '/hq-staff/login',
    '/hq-staff/login/',
    '/hq-staff/forgot-password',
    '/hq-staff/forgot-password/',
    '/hq-staff/reset-password',
    '/hq-staff/reset-password/'
]

export const LayoutContext = React.createContext();

export const LayoutProvider = (props) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [webFxScaner, setWebFxScan] = useState(null);
    const [layoutConfig, setLayoutConfig] = useState({
        ripple: false,
        inputStyle: 'outlined',
        menuMode: window.location.pathname.startsWith('/user') || window.location.pathname.startsWith('/privacy') || URLS.includes(window.location.pathname) ? window.location.pathname.startsWith('/user/map') ? 'static' : 'overlay' : 'static',
        colorScheme: 'light',
        theme: 'default',
        scale: 14
    });
    const [layoutState, setLayoutState] = useState({
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        profileSidebarVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false
    });
    const [localeJson, setLocaleJson] = useState(jpJson);
    const [locale, setLocale] = useState(localStorage.getItem("locale"));
    const [loader, setLoader] = useState(false);

    /* Services */
    const { getSystemSettingDetails } = CommonServices;

    useEffect(() => {
        router.events.on('routeChangeComplete', (url) => {
            updateLayoutConfigState();
        });
    }, []);

    /**
     * Layout config state update
     */
    const updateLayoutConfigState = () => {
        setLayoutConfig(prevState => ({
            ...prevState,
            menuMode: window.location.pathname.startsWith('/user') || URLS.includes(window.location.pathname) ? window.location.pathname.startsWith('/user/map') ? 'static' : 'overlay' : 'static',
        }));
    }

    useEffect(() => {
        if(webFxScaner) return;
        const script = document.createElement('script');
        script.src = '/scan.js';
        script.async = true;
    
        script.onload = async () => {
          try {
            const scan = new WebFxScan();
            await scan.connect({
              ip: '127.0.0.1',
              port: '17778',
              errorCallback: (e) => console.error('Connection error:', e),
              closeCallback: () => console.log('Connection closed'),
            });
            await scan.init();
            setWebFxScan(scan);
          } catch (err) {
            console.error('Failed to initialize scanner:', err);
          }
        };
    
        script.onerror = () => {
          console.error('Failed to load scanner SDK');
        };
    
        document.body.appendChild(script);
    
        return () => {
          document.body.removeChild(script);
        };
      }, []);

    useEffect(() => {
        if (locale && locale == 'en') {
            localStorage.setItem('locale', 'en');
            setLocale("en");
            setLocaleJson(enJson);
        } else {
            localStorage.setItem('locale', 'ja');
            setLocale("ja");
            setLocaleJson(jpJson);
        }

        /* Fetch default API details */

        // Fetch system settings details
        getSystemSettingDetails((response) => {
            const data = response.data.model;
            dispatch(setLayout(data));
        });
    }, [])


    const onMenuToggle = () => {
        if (isOverlay()) {
            setLayoutState((prevLayoutState) => ({ ...prevLayoutState, overlayMenuActive: !prevLayoutState.overlayMenuActive }));
        }

        if (isDesktop()) {
            setLayoutState((prevLayoutState) => ({ ...prevLayoutState, staticMenuDesktopInactive: !prevLayoutState.staticMenuDesktopInactive }));
        } else {
            setLayoutState((prevLayoutState) => ({ ...prevLayoutState, staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive }));
        }
    };

    const showProfileSidebar = () => {
        setLayoutState((prevLayoutState) => ({ ...prevLayoutState, profileSidebarVisible: !prevLayoutState.profileSidebarVisible }));
    };

    const onChangeLocale = (props) => {
        if (locale != props) {
            if (props === "en") {
                setLocale("en");
                setLocaleJson(enJson);
                localStorage.setItem('locale', 'en');
                if (window.location.pathname.startsWith('/user/map')) {
                    window.location.reload();
                }
            } else {
                setLocale("ja");
                setLocaleJson(jpJson);
                localStorage.setItem('locale', 'ja');
                if (window.location.pathname.startsWith('/user/map')) {
                    window.location.reload();
                }
            }
        }
        setTimeout(() => {
            setLoader(false);
        }, 3000);
    }

    const isOverlay = () => {
        return layoutConfig.menuMode === 'overlay';
    };

    const isDesktop = () => {
        return window.innerWidth > 991;
    };

    const value = {
        layoutConfig,
        setLayoutConfig,
        layoutState,
        setLayoutState,
        onMenuToggle,
        showProfileSidebar,
        locale,
        onChangeLocale,
        localeJson,
        loader,
        setLoader,
        webFxScaner
    };

    return <LayoutContext.Provider value={value}>{props.children}</LayoutContext.Provider>;
};
