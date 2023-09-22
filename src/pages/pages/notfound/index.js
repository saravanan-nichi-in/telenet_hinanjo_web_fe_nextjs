import React, { useContext } from 'react';
import Image from 'next/image'

import { LayoutContext } from '../../../layout/context/layoutcontext';

const NotFoundPage = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            <div className="card flex flex-column align-items-center justify-content-center">
                <div style={{ padding: '0.3rem' }}>
                    <div className="w-full surface-card py-6 px-6 flex flex-column align-items-center">
                        <Image src={`/layout/images/telnetLogo-${layoutConfig.colorScheme !== 'light' ? 'dark' : 'dark'}.svg`} width={150} height={35} widt={'true'} alt="logo" /><br />
                        <div className="text-red-600 font-bold text-2xl mb-2">404</div>
                        <div className="text-900 font-bold text-2xl mb-2">Not Found</div>
                        <div className="text-600 ">Requested resource is not available</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

NotFoundPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
        </React.Fragment>
    );
};

export default NotFoundPage;
