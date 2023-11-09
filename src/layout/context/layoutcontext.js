import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import jpJson from '../../../public/locales/jp/lang.json'
import enJson from '../../../public/locales/en/lang.json'
import { CommonServices } from '@/services';

export const LayoutContext = React.createContext();

export const LayoutProvider = (props) => {
    const router = useRouter();
    const [layoutConfig, setLayoutConfig] = useState({
        ripple: false,
        inputStyle: 'outlined',
        menuMode: window.location.pathname.startsWith('/user') ? 'overlay' : 'static',
        colorScheme: 'light',
        theme: 'lara-light-indigo',
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
        router.events.on('routeChangeComplete', () => {
            updateLayoutConfigState();
        });
    }, []);

    /**
     * Layout config state update
     */
    const updateLayoutConfigState = () => {
        setLayoutConfig(prevState => ({
            ...prevState,
            menuMode: window.location.pathname.startsWith('/user') ? 'overlay' : 'static',
        }));
    }

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
            console.log(response);
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
        if (props === "en") {
            setLocale("en");
            setLocaleJson(enJson);
            localStorage.setItem('locale', 'en');
            handleReload();
        } else {
            setLocale("ja");
            setLocaleJson(jpJson);
            localStorage.setItem('locale', 'ja');
            handleReload();
        }
    }

    const handleReload = () => {
        window.location.reload();
    };

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
    };

    return <LayoutContext.Provider value={value}>{props.children}</LayoutContext.Provider>;
};
