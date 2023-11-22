import { Button } from "@/components";
import { LayoutContext } from "@/layout/context/layoutcontext";
import React, { useContext, useEffect, useState, useRef } from "react";

import { GoogleMapMultiMarkerComponent } from "@/components";
import { getValueByKeyRecursively as translate } from "@/helper";
import { useRouter } from "next/router";
import { MapServices } from "@/services";
const Map = () => {
  const { locale, localeJson, setLoader } = useContext(LayoutContext);
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [currentLongitude, setCurrentLongitude] = useState(0);
  const { getPlaceList } = MapServices;
  const [maps, setMaps] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [result, setResult] = useState();
  const [longitude, setLangitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [selectedIndex, setSelectedIndex] = useState(null); 
  useEffect(() => {
    getLocation();
    getPlaceList(fetchMapData);
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
  const fetchMapData = (res) => {
    setMaps(res.data.model.list);
    const marker = res.data.model.list.map((place) => ({
      position: { lat: parseFloat(place.lat), lng: parseFloat(place.lng) },
      content: place.name,
      address_place: place.address_place,
      altitude: place.altitude,
      center:
        place.active_flg == 1
          ? place.full_status == 1
            ? 100
            : place.percent > 100
            ? 100
            : place.percent
          : 0,
    }));
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
          console.log(error.message);
        }
      );
    } else {
      console.log("Geolocation is not supported by your browser.");
    }
  };
  const router = useRouter();

  return (
    <div className="grid max-h-full flex-1">
      <div className="col-12 flex-1">
        <div className="col-12 lg:flex p-0 h-full max-h-full">
          <div
            className="col-12 lg:col-3 card shadow-4  mb-0 lg:p-0 pr-2" 
          >
            <p className="common_bg p-3 text-white mb-2">{translate(localeJson,"evacuation_location")}</p>
            <ul style={{ maxHeight: windowHeight-201 }} className="overflow-auto">
                
              {markers?.map((place, index) => (
                <li key={place.id}>
                  <p
                    className={
                      result?.lat === place.position.lat &&
                      result?.lng === place.position.lng &&
                      selectedIndex == index
                        ? "flex flex-1 common_bg text-white rounded py-2 px-4 items-center"
                        : "flex flex-1 py-2 px-4  mt-2 mb-2 rounded text-[#817E78] items-center map_hover_bg hover:text-white"
                    }
                    onClick={() => {
                      setResult({
                        lat: place?.position?.lat,
                        lng: place?.position?.lng,
                      });
                      setLangitude(place?.lng);
                      setLatitude(place?.lat);
                      setSelectedIndex(index);
                    }}
                  >
                    <p className="white-space-nowrap overflow-hidden text-overflow-ellipsis">
                      {place.content}
                    </p>
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div
            className="col-12 lg:col-9 lg:p-0 lg:pl-2  info-window selectedMarker  shadow-4 overflow-auto"
            style={{ maxHeight: windowHeight-133 }}
          >
            <GoogleMapMultiMarkerComponent
              markers={markers}
              searchResult={result}
              mapScale={20}
              height={windowHeight-133}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
