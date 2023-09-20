import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';
import Image from 'next/image'

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            <div>
                © 2023 避難所管理システム
            </div>
            <div className='flex flex-grow sm:justify-center align-items-center'>
                Terms of Use | Privacy Policy
            </div>
        </div>
    );
};

export default AppFooter;
