import React from 'react'

import { GoogleMapComponent } from '@/components';

const MainDashboard = () => {
    return (
        <div>
            <GoogleMapComponent
                initialPosition={{ "lat": 51.505, "lng": -0.09 }}
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
