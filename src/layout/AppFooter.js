import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            <img src={`/layout/images/telnetLogo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'dark'}.svg`} alt="Logo" height="20" />
        </div>
    );
};

export default AppFooter;
