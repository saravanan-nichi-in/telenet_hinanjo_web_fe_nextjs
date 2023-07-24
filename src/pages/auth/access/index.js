import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { Button } from 'primereact/button';
import Image from 'next/image'
import { LayoutContext } from '../../../layout/context/layoutcontext';

const AccessDeniedPage = () => {
    const router = useRouter();
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            <div className=" card flex flex-column align-items-center justify-content-center">
                <div style={{ padding: '0.3rem' }}>

                    <div className="w-full surface-card py-6 px-6 flex flex-column align-items-center" >
                        <Image src={`/layout/images/telnetLogo-${layoutConfig.colorScheme !== 'light' ? 'dark' : 'dark'}.svg`} width={150} height={35} widt={'true'} alt="logo" />
                        <br />
                        <div className="flex justify-content-center align-items-center bg-pink-500 border-circle" style={{ height: '3.2rem', width: '3.2rem' }}>
                            <i className="pi pi-fw pi-exclamation-circle text-2xl text-white"></i>
                        </div>
                        <h1 className="text-900 font-bold text-2    xl mb-2">Access Denied</h1>
                        <div className="text-600 mb-5">You do not have the necessary permisions.</div>
                        <Image src="/layout/images/access/asset-access.svg" alt="Error" className="mb-5" width={150} height={35} />
                        <Button icon="pi pi-arrow-left" label="Go to Dashboard" text onClick={() => router.push('/')} />
                    </div>
                </div>
            </div>
        </div>
    );
};

AccessDeniedPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
        </React.Fragment>
    );
};

export default AccessDeniedPage;
