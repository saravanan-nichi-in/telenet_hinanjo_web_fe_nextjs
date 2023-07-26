import React from 'react';
import { Button } from 'primereact/button';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { increment, decrement } from '@/redux/features/counterSlice';
import Styles from './Styles.module.css'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Redux = () => {
    const count = useAppSelector((state) => state.counterReducer.value);
    const dispatch = useAppDispatch();

    const { locale, locales, push } = useRouter();
    const { t: translate } = useTranslation('common')

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5 className='text-3xl font-bold'>REDUX</h5>
                    <div>{translate('h1')}</div>
                    <hr />
                    <div className="flex flex-wrap gap-2">
                        <Button label="Increment" className={Styles.button} onClick={() => dispatch(increment())} />
                        <span className='flex align-items-center'>{count && count}</span>
                        <Button label="Decrement" className={Styles.button} onClick={() => dispatch(decrement())} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
            // Will be passed to the page component as props
        },
    }
}

export default Redux;
