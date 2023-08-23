import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'

const containerStyle = {
    width: '100%',
    height: '100vh',
};

const GoogleMapComponent = ({ initialPosition }) => {
    const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    const [center, setCenter] = useState(initialPosition);
    const [currentLocation, setCurrentLocation] = useState('');

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_API_KEY
    })

    const [map, setMap] = React.useState(null)

    const onLoad = React.useCallback(function callback(map) {
        getLocation();
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);

        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const current = {
                        lat: latitude,
                        lng: longitude
                    }
                    setCurrentLocation(current);
                },
                (error) => {
                    console.log(error.message);
                }
            );
        } else {
            console.log('Geolocation is not supported by your browser.');
        }
    };

    const updatePosition = () => {
        setCenter(currentLocation);
    };

    return isLoaded ? (
        <>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                { /* Child components, such as markers, info windows, etc. */}
                <></>
            </GoogleMap>
            {/* <button onClick={updatePosition}>Update Map</button> */}
        </>
    ) : <></>
};
export default GoogleMapComponent