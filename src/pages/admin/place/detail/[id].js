"use client";
import React, { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { Button, DividerComponent, GoogleMapComponent } from "@/components";
import { AdminPlaceDetailService } from "@/helper/adminPlaceDetailService";

export default function StaffManagementEditPage() {
  const { layoutConfig, localeJson } = useContext(LayoutContext);
  const [admin, setAdmins] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  const [placeName, setPlaceName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressDefault1, setAddressDefault1] = useState("");
  const [addressDefault2, setAddressDefault2] = useState("");
  const [capacity, setCapacity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [url, setUrl] = useState("");
  const [registerUrl, setRegisterUrl] = useState("");
  const [altitude, setAltitude] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    AdminPlaceDetailService.getAdminsPlaceDetailMedium().then((data) =>
      setAdmins(data)
    );
  }, []);

  useEffect(() => {
    // Simulated API call
    setTimeout(() => {
      setPlaceName("Fetched place");
      setAddress1("200-0022");
      setAddress2("東京都 中野区");
      setAddressDefault1("200-0022");
      setAddressDefault2("東京都 中野区");
      setCapacity("20人");
      setPhoneNumber("0987654321");
      setCoordinates("-3.038333 / 22.758664");
      setUrl("https://example.com");
      setRegisterUrl("https://example.com/register");
      setAltitude("20m");
      setStatus("無効");
    }, 1000);
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
                      <div className="value">{address1}</div>
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
                      <div className="value">{addressDefault1}</div>
                    </li>
                    <li>
                      <div className="label">
                        {translate(localeJson, "initial_address")}
                      </div>
                      <div className="value">{addressDefault2}</div>
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
                      text: translate(localeJson, "cancel"),
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
                        router.push("/admin/admin-management/edit/1"),
                      text: translate(localeJson, "renew"),
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
