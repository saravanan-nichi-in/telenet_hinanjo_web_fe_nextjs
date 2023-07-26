'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/router'
import axios from '@/utils/api';
import { useOpenCv } from 'opencv-react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'

function Dashboard({ posts }) {
    const router = useRouter();
    // Load opencv on initial render of application
    useOpenCv();

    const { locale, locales, push } = useRouter();
    const { t: translate } = useTranslation('about')

    useEffect(() => {
        fetchData();
    }, []);

    // Function to fetch data from the API
    const fetchData = async () => {
        try {
            const res = await axios.get('posts')
            const posts = await res.data;
            console.log(posts);
            return posts;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <div>
                    </div>
                    <section className='col-12 text-center'>
                        <span className="block text-6xl font-bold mb-1" onClick={() => fetchData()}>Dashboard</span>
                    </section>
                </div>
            </div>
        </div>
    );
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
            // Will be passed to the page component as props
        },
    }
}

export default Dashboard;
