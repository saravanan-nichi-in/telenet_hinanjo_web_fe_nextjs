import React, { useContext, useEffect, useState } from "react";

import { GoogleMapComponent, GoogleMapMultiMarkerComponent } from "@/components";
import { MapServices } from "@/services";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setPlaceDetails } from "@/redux/layout";
import { LayoutContext } from "@/layout/context/layoutcontext";

const Map = () => {
  const { loader } = useContext(LayoutContext);
  const dispatch = useAppDispatch();
  const layoutReducer = useAppSelector((state) => state.layoutReducer);
  const settings_data = useAppSelector((state) => state?.layoutReducer?.layout);
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [currentLongitude, setCurrentLongitude] = useState(0);
  const [maps, setMaps] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [result, setResult] = useState();
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [position, setPosition] = useState();

  const payload = {
    "filters": {
      "sort_by": "refugee_name",
      "order_by": "asc"
    },
    "search": "",
    "map": true
  };

  const { getPlaceList } = MapServices;

  useEffect(() => {
    getLocation();
    getPlaceList(fetchMapData, payload);
    // Listen for window resize events and update windowHeight
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const lat = Number(Number(settings_data?.latitude).toFixed(6));
    const lng = Number(Number(settings_data?.longitude).toFixed(6));

  let pos = {
    lat: lat,
    lng: lng,
  };
    setPosition(pos);
  },[]);

  useEffect(() => {
    setResult(layoutReducer?.position)
  }, [layoutReducer?.position]);

  const fetchMapData = (res) => {
    setMaps(res.data.model.list);
    const marker = res.data.model.list.map((place) => ({
      position: { lat: parseFloat(place.lat), lng: parseFloat(place.lng) },
      content: place.name,
      address_place: place.address_place,
      altitude: place.altitude,
      active_flg: place.active_flg,
      center:
        place.active_flg == 1
          ? place.full_status == 1
            ? 100
            : place.percent > 100
              ? 100
              : place.percent
          : 0,
    }));
   dispatch(setPlaceDetails(marker))
    setMarkers(marker);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLatitude(latitude);
          setCurrentLongitude(longitude);
        },
        (error) => {
          console.error(error.message);
        }
      );
    } else {
      console.warn("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="grid max-h-full flex-1">
      <div className="w-full flex-1">
        <div className="w-full lg:flex p-0 h-full max-h-full">
          <div
            className="w-full h-full info-window selectedMarker overflow-auto"
          >
            {!loader && (
              layoutReducer?.places.length>0?
              <GoogleMapMultiMarkerComponent
                markers={layoutReducer?.places}
                searchResult={result}
                mapScale={settings_data?.map_scale}
                height={"100%"}
                initialPosition={position}
              />
              :
              <GoogleMapComponent
        initialPosition={{
          lat: position?.lat,
          lng: position?.lng,
        }}
      />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;