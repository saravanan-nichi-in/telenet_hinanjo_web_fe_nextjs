import React, { useContext } from 'react';
import { useRouter } from 'next/router'
import { Divider } from 'primereact/divider';
import { getValueByKeyRecursively as translate } from '@/utils/functions'
import { LayoutContext } from '@/layout/context/layoutcontext';




function StockPileSummary() {

    const { layoutConfig, localeJson } = useContext(LayoutContext);

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <section className='col-12'>
                        {/* Header */}
                        <h5 style={{
                            fontSize: "26px",
                            // borderBottom: "1px solid black",
                        }}>
                            {translate(localeJson, 'stockpile_summary')}
                        </h5>
                        <Divider />



                    </section>
                </div>
            </div>
        </div>
    );
}



export default StockPileSummary;
