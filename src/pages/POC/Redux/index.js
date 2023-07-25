'use client'

import React from 'react';
import { Button } from 'primereact/button';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { increment, decrement } from '@/redux/features/counterSlice';
import Styles from './Styles.module.css'

const Redux = () => {
    const count = useAppSelector((state) => state.counterReducer.value);
    const dispatch = useAppDispatch();

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5 className='text-3xl font-bold'>REDUX</h5>
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

export default Redux;
