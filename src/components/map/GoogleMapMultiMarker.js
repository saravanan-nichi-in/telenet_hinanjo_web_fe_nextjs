import React, { useState, useEffect, useContext } from "react";
import { LayoutContext } from "@/layout/context/layoutcontext";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  OverlayView,
} from "@react-google-maps/api";
import { getValueByKeyRecursively as translate } from "@/helper";

const GoogleMapMultiMarkerComponent = ({
  initialPosition,
  height,
  markers,
  searchResult,
  mapScale,
}) => {
  const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const [center, setCenter] = useState(initialPosition);
  const { locale, localeJson, setLoader } = useContext(LayoutContext);
  const [windowHeight, setWindowHeight] = useState(height);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_API_KEY,
    language: locale,
  });

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isMarker, setIsMarker] = useState(false);

  const onMarkerClick = (marker) => {
    setSelectedMarker(marker);
    setIsMarker(true);
  };

  const [mapOptions, setMapOptions] = useState({
    minZoom: 0,
    maxZoom: 25,
    zoom: 4, // Initial zoom level
  });

  useEffect(() => {
    setMapOptions((prevOptions) => ({
      ...prevOptions,
      zoom: mapScale || prevOptions.zoom,
    }));
  }, [searchResult]);

  useEffect(() => {
    setCenter(initialPosition);
  }, [initialPosition]);

  useEffect(() => {
    setWindowHeight(height);
  }, [height]);

  useEffect(() => {
    setCenter(searchResult);
  }, [searchResult]);

  useEffect(() => {
    mapOptions.zoom = 4;
  }, []);

  const containerStyle = {
    width: "100%",
    height: windowHeight,
  };

  const onLoad = React.useCallback(
    function callback(map) {
      if (markers.length > 0) {
        // Fit the map to the bounds of all markers
        const bounds = new window.google.maps.LatLngBounds();
        markers.forEach((marker) => {
          bounds.extend(marker.position);
        });
        map.fitBounds(bounds);
        // Check if the custom control has already been added
        if (!map.customControlAdded) {
          const customControlDiv = document.createElement("div");
          customControlDiv.innerHTML = `
          <div class="legend_view_box" style='position:absolute;left:-196px;top:65px'>
            <div class="legend_main_view">
              <img class="legend_first_view" src=${GreenIcon.url} />
              <div class="legend_second_view">${translate(
                localeJson,
                "empty"
              )}</div>
            </div>
            <div class="legend_main_view">
              <img class="legend_first_view" src=${RedIcon.url} />
              <div class="legend_second_view">${translate(
                localeJson,
                "beginningToCrowd"
              )}</div>
            </div>
            <div class="legend_main_view">
              <img class="legend_first_view" src=${BlueIcon.url} />
              <div class="legend_second_view">${translate(
                localeJson,
                "crowded"
              )}</div>
            </div>
            <div class="legend_main_view">
              <img class="legend_first_view"src=${GrayIcon.url} />
              <div class="legend_second_view">${translate(
                localeJson,
                "closed"
              )}</div>
            </div>
          </div>
        `;
          map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(
            customControlDiv
          );

          // Set a flag to indicate that the custom control has been added
          map.customControlAdded = true;
        }
      }
    },
    [markers]
  );

  const onUnmount = React.useCallback(function callback() {
    setCenter(null);
  }, []);

  const RedIcon = {
    url: "/layout/images/map/map_active_red.png", 
  };
  const GreenIcon = {
    url: "/layout/images/map/map_active_blue.png", 
  };
  const BlueIcon = {
    url: "/layout/images/map/map_active_full.png", 
  };
  const GrayIcon = {
    url: "/layout/images/map/map_inactive_gray.png", 
  };

  return isLoaded ? (
    <>
      {markers.length > 0 && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          onLoad={onLoad}
          onUnmount={onUnmount}
          center={center}
          options={mapOptions}
        >
          {markers.length > 0 && (
            <>
              {markers?.map((marker, index) => (
                <Marker
                  key={index}
                  position={marker.position}
                  onClick={() => onMarkerClick(marker)}
                  icon={
                    marker.center == 100
                      ? GreenIcon
                      : marker.center > 50 && marker.center <= 80
                      ? RedIcon
                      : marker.center > 0
                      ? BlueIcon
                      : GrayIcon
                  }
                >
                  <div>
                    <OverlayView
                      position={marker.position}
                      mapPaneName={OverlayView.MARKER_LAYER}
                    >
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            background: "white",
                            marginTop: "-138px", // Adjust as needed
                            padding: "15px",
                            marginLeft: "-100px",
                            borderRadius: "5px",
                            minWidth: "200px",
                            maxWidth: "200px",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: "100%", // Adjust to position the carrot correctly
                              left: "45%",
                              width: "0",
                              height: "0",
                              borderLeft: "10px solid transparent",
                              borderRight: "10px solid transparent",
                              borderTop: "10px solid white", // Carrot color
                            }}
                          ></div>
                          <div className="white-space-nowrap overflow-hidden text-overflow-ellipsis text-base">
                            {marker.content}
                          </div>
                        </div>
                      </div>
                    </OverlayView>
                  </div>
                </Marker>
              ))}
              {isMarker && (
                <div className="selectedMarker shadow-4">
                  <InfoWindow
                    position={selectedMarker.position}
                    onCloseClick={() => {
                      setIsMarker(false);
                      setSelectedMarker(null);
                    }}
                  >
                    <div>
                      {selectedMarker.center > 0 ? (
                        <div id="content shadow-4 ">
                          <div id="siteNotice"></div>
                          <h1
                            id="firstHeading"
                            className="callout_header text-base"
                            style={{
                              backgroundColor:
                                selectedMarker.center == 100
                                  ? "green"
                                  : selectedMarker.center > 50 &&
                                    selectedMarker.center <= 80
                                  ? "red"
                                  : selectedMarker.center > 0
                                  ? "purple"
                                  : "gray",
                            }}
                          >
                            {selectedMarker.center == 100
                              ? translate(localeJson, "empty")
                              : selectedMarker.center > 50 &&
                                selectedMarker.center <= 80
                              ? translate(localeJson, "beginningToCrowd")
                              : selectedMarker.center > 0
                              ? translate(localeJson, "crowded")
                              : translate(localeJson, "closed")}
                          </h1>
                          <div
                            id="bodyContent text-base"
                            className="text-base mt-2"
                          >
                            <div className="white-space-nowrap overflow-hidden text-overflow-ellipsis text-base mb-1 mt-1">
                              {selectedMarker.content}
                            </div>
                            <div className="text-base mb-1">
                              {selectedMarker.address_place}
                            </div>
                            <div className="text-base mb-1">
                              海抜: {selectedMarker.altitude}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>{translate(localeJson, "close")}</div>
                      )}
                    </div>
                  </InfoWindow>
                </div>
              )}
            </>
          )}
        </GoogleMap>
      )}
    </>
  ) : (
    <></>
  );
};

export default GoogleMapMultiMarkerComponent;
