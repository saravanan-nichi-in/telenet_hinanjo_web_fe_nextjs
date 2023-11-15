"use client";
import React, { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { Button, GoogleMapComponent } from "@/components";
import { AdminPlaceDetailService } from "@/helper/adminPlaceDetailService";
import { PlaceServices, CommonServices } from "@/services";
import { useAppSelector } from "@/redux/hooks";

export default function StaffManagementEditPage() {
  const { locale, localeJson, setLoader } = useContext(LayoutContext);
  const [admin, setAdmins] = useState([]);
  const router = useRouter();
  const Place = useAppSelector((state) => state.placeReducer.place);
  const id = Place?.id;
  const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

  const [apiResponse, setApiResponse] = useState({});
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
  const [altitude, setAltitude] = useState("-");
  const [status, setStatus] = useState("");
  const [longitude, setLangitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [totalPerson, setTotalPerson] = useState("");
  const [percent, setPercentage] = useState("");
  const settings_data = useAppSelector((state) => state?.layoutReducer?.layout);

  /* Services */
  const { details } = PlaceServices;
  const { encrypt } = CommonServices;

  useEffect(() => {
    const fetchData = async () => {
      await onGetPlaceDetailsOnMounting();
      setLoader(false);
    };
    fetchData();
  }, [locale]);

  useEffect(() => {
    setLangitude(longitude);
    setLatitude(latitude);
  }, [longitude, latitude]);

  /**
   * Get place list on mounting
   */
  const onGetPlaceDetailsOnMounting = async () => {
    // Get places list
    details(id, fetchData);
  };

  function fetchData(response) {
    setLoader(true);
    const model = response.data.model;

    setPlaceName(model.name);
    setZipCode(model.zip_code);
    setAddress(model.address);
    setDefaultZipCode(model.zip_code_default);
    setAddressDefault(model.address_default);
    setCapacity(`${model.total_place}人`);
    setPhoneNumber(model.tel);
    setCoordinates(`${model.map.latitude} / ${model.map.longitude}`);
    setUrl(`${window?.location?.origin}/dashboard?hinan=${encrypt(id, ENCRYPTION_KEY)}`);
    setRegisterUrl(`${window?.location?.origin}/temp_register_member?hinan=${encrypt(id, ENCRYPTION_KEY)}`);
    model.altitude && setAltitude(`${model.altitude}m`);
    setStatus(model.active_flg === 1 ? "有効" : "無効");
    setTotalPerson(model.total_person);
    setPercentage(model.percent);
    setApiResponse(model);
    setLangitude(parseFloat(model.map.longitude));
    setLatitude(parseFloat(model.map.latitude));
    setLoader(false);
  }

  useEffect(() => {
    AdminPlaceDetailService.getAdminsPlaceDetailMedium().then((data) =>
      setAdmins(data)
    );
  }, []);

  const popoverContent = (
    <div>
      <p>
        <strong>避難所名:</strong> {placeName}
      </p>
      <p>
        <strong>避難所住所:</strong> {zipCode}
        {address2}
      </p>
      <p>
        <strong>収容人数:</strong> {capacity} / {totalPerson}人
      </p>
      <p>
        <strong>避難者数:</strong> {percent}%
      </p>
    </div>
  );

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          {/* Header */}
          <h5 className="page-header1">
            {translate(localeJson, "details_place")}
          </h5>
          <hr />
          <div>
            <div
              className="col-12 lg:flex p-0"
              style={{ justifyContent: "start", flexWrap: "wrap" }}
            >
              <div
                className="col-12 lg:col-7 pb-20px  lg:p-0 pr-2"
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
                      {translate(localeJson, "default_postal_code")}
                    </div>
                    <div className="value">{defaultZipCode}</div>
                  </li>
                  <li>
                    <div className="label">
                      {translate(localeJson, "default_address")}
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
                    <div className="label">{translate(localeJson, "url")}</div>
                    <div className="value text-link-class cursor-pointer">
                      <a
                        className="text-link-class cursor-pointer"
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {url}
                      </a>
                    </div>
                  </li>
                  <li>
                    <div className="label">
                      {translate(localeJson, "smartphone_registration_url")}
                    </div>
                    <div className="value text-link-class cursor-pointer">
                      <a
                        href={registerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-link-class cursor-pointer"
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

              <div className="col-12 lg:col-5 lg:p-0 lg:pl-2 info-window">
                <GoogleMapComponent
                  initialPosition={{ lat: latitude, lng: longitude }}
                  height={"455px"}
                  popoverContent={popoverContent}
                  mapScale={settings_data?.map_scale}
                />
              </div>
            </div>
            <div
              className="flex pt-3 pb-3 gap-2"
              style={{ justifyContent: "start", flexWrap: "wrap" }}
            >
              <div>
                <Button
                  buttonProps={{
                    buttonClass: "text-600 border-500 evacuation_button_height",
                    bg: "bg-white",
                    type: "button",
                    hoverBg: "hover:surface-500 hover:text-white",
                    text: translate(localeJson, "back"),
                    rounded: "true",
                    severity: "primary",
                    onClick: () => router.push("/admin/place"),
                  }}
                  parentStyle={{ paddingTop: "10px" }}
                />
              </div>
              <div className="">
                <Button
                  buttonProps={{
                    buttonClass: "evacuation_button_height",
                    type: "button",
                    onClick: () =>
                      router.push({
                        pathname: `/admin/place/edit`,
                      }),
                    text: translate(localeJson, "edit"),
                    rounded: "true",
                    severity: "primary",
                  }}
                  parentStyle={{ paddingTop: "10px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
