import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';
import Image from 'next/image'

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
                        <Image src={`/layout/images/telnetLogo-${layoutConfig.colorScheme !== 'light' ? 'dark' : 'dark'}.svg`} width={150} height={20} alt="logo"/>
        </div>
    );
};

export default AppFooter;
