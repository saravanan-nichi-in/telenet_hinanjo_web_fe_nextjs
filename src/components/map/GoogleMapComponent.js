// GoogleMapComponent.jsx
import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";


const GoogleMapComponent = ({
  initialPosition,
  height,
  searchResult,
  popoverContent,
  mapScale
}) => {
  const containerStyle = {
    width: "100%",
    height: height || "100vh",
  };

  const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const [center, setCenter] = useState(initialPosition);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_API_KEY,
  });
  const [selectedMarker, setSelectedMarker] = useState(null);

  const onMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const mapOptions = {
    minZoom: 0, // Set your desired min zoom level
    maxZoom: 25,
    zoom: mapScale||4,
  };

  useEffect(() => {
    setCenter(initialPosition);
  }, [initialPosition]);
  useEffect(() => {
    setCenter(searchResult);
  }, [searchResult]);

  useEffect(() => {
    if (searchResult) {
      setCenter(searchResult);
    }
  }, [searchResult]);

  const onLoad = React.useCallback(
    async function callback(map) {
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);
    },
    [center]
  );

  const onUnmount = React.useCallback(function callback() {
    setCenter(null);
  }, []);


  

  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        onLoad={onLoad}
        onUnmount={onUnmount}
        center={center}
        options={mapOptions}
      >
        {center && (
          <Marker position={center} onClick={() => onMarkerClick(center)} />
        )}
        {selectedMarker && popoverContent && (
            <>
            <InfoWindow
              position={center}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div>{popoverContent}</div>
            </InfoWindow>
            </>
        )}
      </GoogleMap>
    </>
  ) : (
    <></>
  );
};

export default GoogleMapComponent;
