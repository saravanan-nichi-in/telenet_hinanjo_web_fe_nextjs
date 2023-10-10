import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import { Formik } from "formik";
import * as Yup from "yup";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import {
  Button,
  DividerComponent,
  InputIcon,
  NormalLabel,
  ValidationError,
  DateCalendar,
  TimeCalendar,
  GoogleMapComponent,
  InputSwitch,
  InputNumber
} from "@/components";

export default function PlaceCreatePage() {
  const { localeJson } = useContext(LayoutContext);
  const router = useRouter();
  const schema = Yup.object().shape({
    capacity: Yup.string()
      .required(translate(localeJson, "capacity") + translate(localeJson, "is_required")),
    evacuationLocation: Yup.string().required(
      translate(localeJson, "evacuation_location") + translate(localeJson, "is_required")
    ),
    phoneNumber: Yup.string().required(
      translate(localeJson, "phone_number") + translate(localeJson, "is_required")
    ),
    latitude: Yup.string().required(
      translate(localeJson, "latitude") + translate(localeJson, "is_required")
    ),
    longitude: Yup.string().required(
      translate(localeJson, "longitude") + translate(localeJson, "is_required")
    ),
    altitude: Yup.string().required(
      translate(localeJson, "altitude") + translate(localeJson, "is_required")
    ),
    postal_code1: Yup.number(translate(localeJson, "address") + translate(localeJson, "is_required")),
    postal_code2: Yup.number(translate(localeJson, "address") + translate(localeJson, "is_required"))
  });

  const initialValues = {
    fullName: "", evacuationLocation: "", evacuationLocationFurigana: "",
    evacuationLocationEnglish: "", capacity: "", phoneNumber: "", longitude: "",
    latitude: "", altitude: "", opening_date: "", opening_time: "", closing_date: "", closing_time: "",
    foreignPublication: "", status: "", remarks: "", postal_code1: "", postal_code2: ""
  }
  return (
    <>
      <Formik
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={(values, error) => {
          console.log(values, error)
          // router.push("/admin/place");
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset,
          resetForm
        }) => (
          <div className="grid">
            <div className="col-12">
              <div className="card">
                <section className="col-12">
                  {/* Header */}
                  <h5 className="page_header">
                    {translate(localeJson, "admin_information_registration")}
                  </h5>
                  <DividerComponent />
                  <form onSubmit={handleSubmit}>
                    <div className="col-12 lg:flex p-0">
                      <div className="col-12 lg:col-7 p-0">
                        <div>

                          <div className="lg:flex lg:align-items-baseline  lg:col-12 p-0">
                            <div className="pb-1 lg:col-3">
                              <NormalLabel
                                spanClass={"p-error"}
                                spanText={"*"}
                                text={translate(localeJson, "evacuation_location")}
                              />
                            </div>
                            <div className="lg:col-9">
                              <InputIcon
                                inputIconProps={{
                                  name: "evacuationLocation",
                                  inputClass: "w-full",
                                  onChange: handleChange,
                                  onBlur: handleBlur,
                                }}
                                parentClass={`${errors.evacuationLocation &&
                                  touched.evacuationLocation &&
                                  "p-invalid pb-1"
                                  }`}
                              />
                              <ValidationError
                                errorBlock={
                                  errors.evacuationLocation &&
                                  touched.evacuationLocation &&
                                  errors.evacuationLocation
                                }
                              />
                            </div>
                          </div>
                          <div className="lg:flex lg:align-items-baseline lg:col-12 p-0">
                            <div className="pb-1 lg:col-3">
                              <NormalLabel
                                text={translate(localeJson, "evacuation_location_furigana")}
                              />
                            </div>
                            <div className="lg:col-9">
                              <InputIcon
                                inputIconProps={{
                                  name: "evacuationLocationFurigana",
                                  inputClass: "w-full",
                                  onChange: handleChange,
                                  onBlur: handleBlur,
                                }}
                              />
                            </div>
                          </div>
                          <div className="lg:flex lg:align-items-baseline  lg:col-12 p-0">
                            <div className="pb-1 lg:col-3">
                              <NormalLabel
                                text={translate(localeJson, "evacuation_location_english")}
                              />
                            </div>
                            <div className="lg:col-9">
                              <InputIcon
                                inputIconProps={{
                                  name: "evacuationLocationEnglish",
                                  inputClass: "w-full",
                                  onChange: handleChange,
                                  onBlur: handleBlur,
                                }}
                              />
                            </div>
                          </div>
                          <div className="lg:flex lg:align-items-baseline  lg:col-12 p-0">
                            <div className="pb-1 lg:col-3">
                              <NormalLabel
                                spanClass={"p-error"}
                                spanText={"*"}
                                text={translate(localeJson, "address")}
                              />
                            </div>
                            <div className="flex">
                              <div className="lg:col-6 lg:flex">
                                <label className="flex align-items-center justify-content-center">〒</label>
                                <InputNumber
                                  inputNumberProps={{
                                    name: "postal_code1",
                                    inputNumberClass: "w-full",
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                  }}
                                  parentClass={`custom-input flex flex-wrap ${errors.postal_code1 &&
                                    touched.postal_code1 &&
                                    "p-invalid pb-1"
                                    }`}
                                />
                                <ValidationError
                                  errorBlock={
                                    errors.postal_code1 &&
                                    touched.postal_code1 &&
                                    errors.postal_code1
                                  }
                                />
                              </div>
                              <div className="lg:col-1 flex align-items-center justify-content-center">-</div>
                              <div className="lg:col-5">
                                <InputNumber
                                  inputNumberProps={{
                                    name: "postal_code2",
                                    inputNumberClass: "w-full",
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                  }}
                                  parentClass={`${errors.postal_code2 &&
                                    touched.postal_code2 &&
                                    "p-invalid pb-1"
                                    }`}
                                />
                                <ValidationError
                                  errorBlock={
                                    errors.postal_code2 &&
                                    touched.postal_code2 &&
                                    errors.postal_code2
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="lg:flex lg:align-items-baseline  lg:col-12 p-0">
                            <div className="pb-1 lg:col-3">
                              <NormalLabel
                                spanClass={"p-error"}
                                spanText={"*"}
                                text={translate(localeJson, "capacity")}
                              />
                            </div>
                            <div className="lg:col-9">
                              <InputIcon
                                inputIconProps={{
                                  name: "capacity",
                                  inputClass: "w-full",
                                  onChange: handleChange,
                                  onBlur: handleBlur,
                                }}
                                parentClass={`${errors.capacity &&
                                  touched.capacity &&
                                  "p-invalid pb-1"
                                  }`}
                              />
                              <ValidationError
                                errorBlock={
                                  errors.capacity &&
                                  touched.capacity &&
                                  errors.capacity
                                }
                              />
                            </div>
                          </div>
                          <div className="lg:flex lg:align-items-baseline  lg:col-12 p-0">
                            <div className="pb-1 lg:col-3">
                              <NormalLabel
                                spanClass={"p-error"}
                                spanText={"*"}
                                text={translate(localeJson, "phone_number")}
                              />
                            </div>
                            <div className="lg:col-9">
                              <InputIcon
                                inputIconProps={{
                                  name: "phoneNumber",
                                  inputClass: "w-full",
                                  onChange: handleChange,
                                  onBlur: handleBlur,
                                }}
                                parentClass={`${errors.phoneNumber &&
                                  touched.phoneNumber &&
                                  "p-invalid pb-1"
                                  }`}
                              />
                              <ValidationError
                                errorBlock={
                                  errors.phoneNumber &&
                                  touched.phoneNumber &&
                                  errors.phoneNumber
                                }
                              />
                            </div>
                          </div>
                          <div className="lg:flex lg:align-items-baseline  lg:col-12 p-0">
                            <div className="pb-1 lg:col-3">
                              <NormalLabel
                                spanClass={"p-error"}
                                spanText={"*"}
                                text={translate(localeJson, "latitude_longitude")}
                              />
                            </div>
                            <div className="flex">
                              <div className="lg:col-6">
                                <InputIcon
                                  inputIconProps={{
                                    name: "latitude",
                                    inputClass: "w-full",
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                  }}
                                  parentClass={`${errors.latitude &&
                                    touched.latitude &&
                                    "p-invalid pb-1"
                                    }`}
                                />
                                <ValidationError
                                  errorBlock={
                                    errors.latitude &&
                                    touched.latitude &&
                                    errors.latitude
                                  }
                                />
                              </div>
                              <div className="lg:col-6">
                                <InputIcon
                                  inputIconProps={{
                                    name: "longitude",
                                    inputClass: "w-full",
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                  }}
                                  parentClass={`${errors.longitude &&
                                    touched.longitude &&
                                    "p-invalid pb-1"
                                    }`}
                                />
                                <ValidationError
                                  errorBlock={
                                    errors.longitude &&
                                    touched.longitude &&
                                    errors.longitude
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="lg:flex lg:align-items-baseline  lg:col-12 p-0">
                            <div className="pb-1 lg:col-3">
                              <NormalLabel
                                spanClass={"p-error"}
                                spanText={"*"}
                                text={translate(localeJson, "altitude")}
                              />
                            </div>
                            <div className="lg:col-9">
                              <InputIcon
                                inputIconProps={{
                                  name: "altitude",
                                  inputClass: "w-full",
                                  onChange: handleChange,
                                  onBlur: handleBlur,
                                }}
                                parentClass={`${errors.altitude &&
                                  touched.altitude &&
                                  "p-invalid pb-1"
                                  }`}
                              />
                              <ValidationError
                                errorBlock={
                                  errors.altitude &&
                                  touched.altitude &&
                                  errors.altitude
                                }
                              />
                            </div>
                          </div>
                          <div className="lg:flex lg:align-items-baseline  lg:col-12 p-0">
                            <div className="pb-1 lg:col-3">
                              <NormalLabel
                                text={translate(localeJson, "opening_date_time")}
                              />
                            </div>
                            <div className="flex">
                              <div className="lg:col-7">
                                <DateCalendar
                                  dateProps={{
                                    name: "opening_date",
                                    dateClass: "w-full",
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                  }}
                                  parentClass={`${errors.opening_date &&
                                    touched.opening_date &&
                                    "p-invalid pb-1"
                                    }`}
                                />
                                <ValidationError
                                  errorBlock={
                                    errors.opening_date &&
                                    touched.opening_date &&
                                    errors.opening_date
                                  }
                                />
                              </div>
                              <div className="lg:col-5">
                                <TimeCalendar
                                  timeProps={{
                                    name: "opening_time",
                                    inputClass: "w-full",
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                  }}
                                  parentClass={`${errors.opening_time &&
                                    touched.opening_time &&
                                    "p-invalid pb-1"
                                    }`}
                                />
                                <ValidationError
                                  errorBlock={
                                    errors.opening_time &&
                                    touched.opening_time &&
                                    errors.opening_time
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="lg:flex lg:align-items-baseline  lg:col-12 p-0">
                            <div className="pb-1 lg:col-3">
                              <NormalLabel
                                text={translate(localeJson, "closing_date_time")}
                              />
                            </div>
                            <div className="flex">
                              <div className="lg:col-7">
                                <DateCalendar
                                  dateProps={{
                                    name: "closing_date",
                                    dateClass: "w-full",
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                  }}
                                  parentClass={`${errors.closing_date &&
                                    touched.closing_date &&
                                    "p-invalid pb-1"
                                    }`}
                                />
                                <ValidationError
                                  errorBlock={
                                    errors.closing_date &&
                                    touched.closing_date &&
                                    errors.closing_date
                                  }
                                />
                              </div>
                              <div className="lg:col-5">
                                <TimeCalendar
                                  timeProps={{
                                    name: "closing_time",
                                    inputClass: "w-full",
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                  }}
                                  parentClass={`${errors.closing_time &&
                                    touched.closing_time &&
                                    "p-invalid pb-1"
                                    }`}
                                />
                                <ValidationError
                                  errorBlock={
                                    errors.closing_time &&
                                    touched.closing_time &&
                                    errors.closing_time
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="lg:flex lg:align-items-baseline  lg:col-12 p-0">
                            <div className="pb-1 lg:col-3">
                              <NormalLabel
                                text={translate(localeJson, "foreign_publication")}
                              />
                            </div>
                            <div className="lg:col-9">
                              <InputSwitch
                                inputSwitchProps={{
                                  name: "foreignPublication",
                                  checked: values.foreignPublication,
                                  switchClass: "",
                                  onChange: handleChange,
                                }}
                                parentClass={`custom-switch ${errors.foreignPublication &&
                                  touched.foreignPublication &&
                                  "p-invalid pb-1"
                                  }`}
                              />
                              <ValidationError
                                errorBlock={
                                  errors.foreignPublication &&
                                  touched.foreignPublication &&
                                  errors.foreignPublication
                                }
                              />
                            </div>
                          </div>
                          <div className="lg:flex lg:align-items-baseline  lg:col-12 p-0">
                            <div className="pb-1 lg:col-3">
                              <NormalLabel
                                text={translate(localeJson, "status")}
                              />
                            </div>
                            <div className="lg:col-9">
                              <InputSwitch
                                inputSwitchProps={{
                                  name: "status",
                                  checked: values.status,
                                  switchClass: "",
                                  onChange: handleChange,
                                }}
                                parentClass={`custom-switch ${errors.status &&
                                  touched.status &&
                                  "p-invalid pb-1"
                                  }`}
                              />
                            </div>
                          </div>
                          <div className="lg:flex lg:align-items-baseline  lg:col-12 p-0">
                            <div className="pb-1 lg:col-3">
                              <NormalLabel
                                text={translate(localeJson, "remarks")}
                              />
                            </div>
                            <div className="lg:col-9">
                              <InputIcon
                                inputIconProps={{
                                  name: "remarks",
                                  inputClass: "w-full",
                                  onChange: handleChange,
                                  onBlur: handleBlur,
                                }}
                                parentClass={`${errors.remarks &&
                                  touched.remarks &&
                                  "p-invalid pb-1"
                                  }`}
                              />
                            </div>
                          </div>


                        </div>
                      </div>
                      <div
                        className="col-12 lg:col-5 p-0 pl-2"
                        style={{ maxHeight: "300px" }}
                      >
                        <GoogleMapComponent
                          initialPosition={{ lat: -4.038333, lng: 21.758664 }}
                          height={"350px"}
                        />
                      </div>
                    </div>
                    <div
                      className="flex pt-3 justify-content-around"
                      style={{
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <Button
                          buttonProps={{
                            buttonClass:
                              "text-600 border-500 evacuation_button_height",
                            bg: "bg-white",
                            type: "reset",
                            hoverBg: "hover:surface-500 hover:text-white",
                            text: translate(localeJson, "cancel"),
                            rounded: "true",
                            severity: "primary",
                            onClick: () => {
                              resetForm()
                              handleReset()
                            } // Step 3: Call resetForm on click of cancel button

                          }}
                          parentStyle={{
                            paddingTop: "10px",
                            paddingLeft: "10px",
                          }}
                        />
                      </div>
                      <div>
                        <Button
                          buttonProps={{
                            buttonClass: "evacuation_button_height",
                            type: "submit",
                            text: translate(localeJson, "registration"),
                            rounded: "true",
                            severity: "primary",
                          }}
                          parentStyle={{
                            paddingTop: "10px",
                            paddingLeft: "10px",
                          }}
                        />
                      </div>
                    </div>
                  </form>
                </section>
              </div>
            </div>
          </div>
        )}
      </Formik >
    </>
  );
}
