import React from 'react';
import { Providers } from "@/redux/provider";
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import { OpenCvProvider } from 'opencv-react';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '@/styles/layout/layout.scss';
import '@/styles/components/components.scss';
import { appWithTranslation } from 'next-i18next'


function MyApp({ Component, pageProps }) {
    if (Component.getLayout) {
        return (
            <OpenCvProvider
            // openCvPath={props.openCvPath}
            >
                <LayoutProvider>
                    {Component.getLayout(<Component {...pageProps} />)
                    }</LayoutProvider>
            </OpenCvProvider>
        )
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

export default appWithTranslation(MyApp);
