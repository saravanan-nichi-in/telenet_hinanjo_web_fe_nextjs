"use client";
import React, { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { Button, DividerComponent, GoogleMapComponent } from "@/components";
import { AdminPlaceDetailService } from "@/helper/adminPlaceDetailService";
import { PlaceServices } from "@/services";
export default function StaffManagementEditPage() {
  const { locale, localeJson } = useContext(LayoutContext);
  const [admin, setAdmins] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  /* Services */
  const { details } = PlaceServices;

  const [placeName, setPlaceName] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address2, setAddress] = useState("");
  const [defaultZipCode, setDefaultZipCode] = useState("");
  const [addressDefault, setAddressDefault] = useState("");
  const [capacity, setCapacity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [url, setUrl] = useState("");
  const [registerUrl, setRegisterUrl] = useState("");
  const [altitude, setAltitude] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      await onGetPlaceDetailsOnMounting();
      setLoader(false);
    };
    fetchData();
  }, [locale]);


  /**
   * Get place list on mounting
   */
  const onGetPlaceDetailsOnMounting = async () => {
    // Get places list
    details(id, fetchData);
  };

  function fetchData(response) {
    setLoader(true)
    const model = response.data.model;
    setPlaceName(model.name);
    setZipCode(model.zip_code);
    setAddress(model.address);
    setDefaultZipCode(model.zip_code_default);
    setAddressDefault(model.address_default);
    setCapacity(`${model.total_place}人`);
    setPhoneNumber(model.tel);
    setCoordinates(`${model.map.latitude} / ${model.map.longitude}`);
    setUrl("https://example.com");
    setRegisterUrl("https://example.com/register");
    setAltitude(`${model.altitude}m`);
    setStatus(model.active_flg === 1 ? "有効" : "無効");
    setLoader(false)
  }

  useEffect(() => {
    AdminPlaceDetailService.getAdminsPlaceDetailMedium().then((data) =>
      setAdmins(data)
    );
  }, []);


  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <section className="col-12">
            {/* Header */}
            <h5 className="page_header">
              {translate(localeJson, "edit_shelter")}
            </h5>
            <DividerComponent />
            <div>
              <div
                className="col-12 lg:flex p-0"
                style={{ justifyContent: "start", flexWrap: "wrap" }}
              >
                <div
                  className="col-12 lg:col-7 p-0 pr-2"
                  style={{ overflowX: "auto" }}
                >
                  <ul className="custom-list">
                    <li>
                      <div className="label">
                        {translate(localeJson, "evacuation_location")}
                      </div>
                      <div className="value">{placeName}</div>
                    </li>
                    <li>
                      <div className="label">
                        {translate(localeJson, "postal_code")}
                      </div>
                      <div className="value">{zipCode}</div>
                    </li>
                    <li>
                      <div className="label">
                        {translate(localeJson, "address")}
                      </div>
                      <div className="value">{address2}</div>
                    </li>
                    <li>
                      <div className="label">
                        {translate(localeJson, "initial_postal_code")}
                      </div>
                      <div className="value">{defaultZipCode}</div>
                    </li>
                    <li>
                      <div className="label">
                        {translate(localeJson, "initial_address")}
                      </div>
                      <div className="value">{addressDefault}</div>
                    </li>
                    <li>
                      <div className="label">
                        {translate(localeJson, "capacity")}
                      </div>
                      <div className="value">{capacity}</div>
                    </li>
                    <li>
                      <div className="label">
                        {translate(localeJson, "phone_number")}
                      </div>
                      <div className="value">{phoneNumber}</div>
                    </li>
                    <li>
                      <div className="label">
                        {translate(localeJson, "latitude_longitude")}
                      </div>
                      <div className="value">{coordinates}</div>
                    </li>
                    <li>
                      <div className="label">
                        {translate(localeJson, "url")}
                      </div>
                      <div className="value">
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          {url}
                        </a>
                      </div>
                    </li>
                    <li>
                      <div className="label">
                        {translate(localeJson, "smartphone_registration_url")}
                      </div>
                      <div className="value">
                        <a
                          href={registerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {registerUrl}
                        </a>
                      </div>
                    </li>
                    <li>
                      <div className="label">
                        {translate(localeJson, "altitude")}
                      </div>
                      <div className="value">{altitude}</div>
                    </li>
                    <li>
                      <div className="label">
                        {translate(localeJson, "status")}
                      </div>
                      <div className="value">{status}</div>
                    </li>
                  </ul>
                </div>

                <div
                  className="col-12 lg:col-5 p-0 pl-2"
                  style={{ maxHeight: "400px" }}
                >
                  <GoogleMapComponent
                    initialPosition={{ lat: -4.038333, lng: 21.758664 }}
                    height={"400px"}
                  />
                </div>
              </div>
              <div
                className="flex pt-3 pb-3"
                style={{ justifyContent: "center", flexWrap: "wrap" }}
              >
                <div>
                  <Button
                    buttonProps={{
                      buttonClass:
                        "text-600 border-500 evacuation_button_height",
                      bg: "bg-white",
                      type: "button",
                      hoverBg: "hover:surface-500 hover:text-white",
                      text: translate(localeJson, "return"),
                      rounded: "true",
                      severity: "primary",
                    }}
                    parentStyle={{ paddingTop: "10px", paddingLeft: "10px" }}
                  />
                </div>
                <div>
                  <Button
                    buttonProps={{
                      buttonClass: "evacuation_button_height",
                      type: "button",
                      onClick: () =>
                        router.push({
                          pathname: `/admin/place/edit`,
                          query: { id: id },
                        }),
                      text: translate(localeJson, "update"),
                      rounded: "true",
                      severity: "primary",
                    }}
                    parentStyle={{ paddingTop: "10px", paddingLeft: "10px" }}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
