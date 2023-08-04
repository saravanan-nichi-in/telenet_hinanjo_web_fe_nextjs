import React, { useState, useEffect } from 'react';
import jpJson from '../../../public/locales/jp/lang.json'
import enJson from '../../../public/locales/en/lang.json'

export const LayoutContext = React.createContext();

export const LayoutProvider = (props) => {
    const [layoutConfig, setLayoutConfig] = useState({
        ripple: false,
        inputStyle: 'outlined',
        menuMode: 'static',
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


    useEffect(() => {
        localStorage.setItem('locale', 'ja');
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
            setLocaleJson(enJson);
            localStorage.setItem('locale', 'en');
        } else {
            setLocaleJson(jpJson);
            localStorage.setItem('locale', 'ja');
        }
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
        onChangeLocale,
        localeJson
    };

    return <LayoutContext.Provider value={value}>{props.children}</LayoutContext.Provider>;
};
