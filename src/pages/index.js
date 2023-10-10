import React from 'react'

import { GoogleMapComponent } from '@/components';

const MainDashboard = () => {
    return (
        <div>
            <GoogleMapComponent
            />
        </div>
    )
}

MainDashboard.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
        </React.Fragment>
    );  
};
export default MainDashboard;
