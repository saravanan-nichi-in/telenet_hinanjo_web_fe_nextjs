import React from 'react';
import { Providers } from "@/redux/provider";
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
// import '@/styles/globals.scss'
import '@/styles/layout/layout.scss';
import '@/styles/component/_dragDrop.scss';
import '@/styles/component/_perspective.scss';
import { OpenCvProvider } from 'opencv-react'


export default function MyApp({ Component, pageProps }) {
    if (Component.getLayout) {
        return <LayoutProvider>{Component.getLayout(<Component {...pageProps} />)}</LayoutProvider>;
    } else {
        return (
            <OpenCvProvider
                // openCvPath={props.openCvPath}
            >
                <Providers>
                    <LayoutProvider>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </LayoutProvider>
                </Providers>
            </OpenCvProvider>
        );
    }
}
