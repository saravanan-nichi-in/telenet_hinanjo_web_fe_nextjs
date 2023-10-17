import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  getValueByKeyRecursively as translate,
  getGeneralDateTimeDisplayFormat,
} from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { prefectures, prefectures_en } from "@/utils/constant";
import {
  Button,
  DividerComponent,
  Input,
  NormalLabel,
  ValidationError,
  DateCalendar,
  TimeCalendar,
  GoogleMapComponent,
  InputSwitch,
  InputNumber,
  Select,
  InputFloatLabel,
  InputNumberFloatLabel,
  SelectFloatLabel,
  CommonDialog,
} from "@/components";
import {
  DateCalendarFloatLabel,
  TimeCalendarFloatLabel,
} from "@/components/date&time";
import { PlaceServices } from "@/services";
import { initial } from "lodash";

export default function PlaceUpdatePage() {
  const { locale, localeJson, setLoader } = useContext(LayoutContext);
  const router = useRouter();
  const [apiResponse, setApiResponse] = useState({});
  const { id } = router.query;
  const [placeEditDialogVisible, setPlaceEditDialogVisible] = useState(false);

  /* Services */
  const { deletePlace, update, getAddressByZipCode, details } = PlaceServices;

  const [currentLattitude, setCurrentlatitude] = useState(0);
  const [currentLongitude, setCurrentlongitude] = useState(0);
  const schema = Yup.object().shape({
    name: Yup.string()
      .required(
        translate(localeJson, "evacuation_location") +
          translate(localeJson, "is_required")
      )
      .max(
        200,
        translate(localeJson, "evacuation_location") +
          translate(localeJson, "max_length_200")
      ),
    refugee_name: Yup.string().max(
      200,
      translate(localeJson, "evacuation_location_furigana") +
        translate(localeJson, "max_length_200")
    ),
    name_en: Yup.string().max(
      200,
      translate(localeJson, "evacuation_location_english") +
        translate(localeJson, "max_length_200")
    ),
    postal_code_1: Yup.string()
      .matches(/^\d+$/, translate(localeJson, "postal_code_1_validation"))
      .max(3, translate(localeJson, "postal_code_1_validation"))
      .required(
        translate(localeJson, "postal_code") +
          translate(localeJson, "is_required")
      ),
    postal_code_2: Yup.string()
      .matches(/^\d+$/, translate(localeJson, "postal_code_2_validation"))
      .max(4, translate(localeJson, "postal_code_2_validation"))
      .required(
        translate(localeJson, "postal_code") +
          translate(localeJson, "is_required")
      ),
    prefecture_id: Yup.string().required(
      translate(localeJson, "prefecture_place") +
        translate(localeJson, "is_required")
    ),
    address: Yup.string()
      .required(
        translate(localeJson, "address") + translate(localeJson, "is_required")
      )
      .max(
        255,
        translate(localeJson, "address") +
          translate(localeJson, "max_length_255")
      ),
    address_en: Yup.string().max(
      255,
      translate(localeJson, "address_en") +
        translate(localeJson, "max_length_255")
    ),
    postal_code_default_1: Yup.string()
      .matches(/^\d+$/, translate(localeJson, "postal_code_1_validation"))
      .max(3, translate(localeJson, "postal_code_1_validation"))
      .required(
        translate(localeJson, "default_prefecture_place") +
          translate(localeJson, "is_required")
      ),
    postal_code_default_2: Yup.string()
      .matches(/^\d+$/, translate(localeJson, "postal_code_2_validation"))
      .max(4, translate(localeJson, "postal_code_2_validation"))
      .required(
        translate(localeJson, "default_prefecture_place") +
          translate(localeJson, "is_required")
      ),
    prefecture_id_default: Yup.string().required(
      translate(localeJson, "default_prefecture_place") +
        translate(localeJson, "is_required")
    ),
    address_default: Yup.string()
      .required(
        translate(localeJson, "default_address") +
          translate(localeJson, "is_required")
      )
      .max(
        255,
        translate(localeJson, "default_address") +
          translate(localeJson, "max_length_255")
      ),
    address_default_en: Yup.string().max(
      255,
      translate(localeJson, "default_address_en") +
        translate(localeJson, "max_length_255")
    ),
    tel: Yup.string()
      .required(
        translate(localeJson, "phone_number") +
          translate(localeJson, "is_required")
      )
      .matches(/^[0-9]{10}$/, translate(localeJson, "phone")),
    latitude: Yup.number().required(
      translate(localeJson, "latitude") + translate(localeJson, "is_required")
    ),
    longitude: Yup.number().required(
      translate(localeJson, "longitude") + translate(localeJson, "is_required")
    ),
    altitude: Yup.string().required(
      translate(localeJson, "altitude") + translate(localeJson, "is_required")
    ),
    total_place: Yup.number()
      .required(
        translate(localeJson, "capacity") + translate(localeJson, "is_required")
      )
      .max(
        999999999,
        translate(localeJson, "capacity") +
          translate(localeJson, "capacity_max_length")
      ),
    remarks: Yup.string().max(
      255,
      translate(localeJson, "default_address_en") +
        translate(localeJson, "max_length_255")
    ),
    opening_date: Yup.date().nullable(),
    closing_date: Yup.date()
      .when("opening_date", (opening_date, schema) => {
        if (opening_date && opening_date != "" && opening_date != undefined) {
          return schema
            .default(() => new Date())
            .min(opening_date, translate(localeJson, "closing_date"))
            .test({
              name: "greaterThan",
              message: translate(localeJson, "closing_date"),
              test: function (closing_date) {
                const opening_date = this.resolve(Yup.ref("opening_date"));
                return opening_date < closing_date;
              },
            });
        }
      })
      .nullable(),
  });

  useEffect(() => {
    const fetchData = async () => {
      await onGetPlaceDetailsOnMounting();
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
  const initialValues = {
    place_id: id,
    name: "",
    refugee_name: "",
    name_en: "",
    postal_code_1: "",
    postal_code_2: "",
    prefecture_id: "",
    address: "",
    prefecture_en_id: "",
    address_en: "",
    postal_code_default_1: "",
    postal_code_default_2: "",
    prefecture_id_default: "",
    address_default: "",
    prefecture_default_en_id: "",
    address_default_en: "",
    total_place: "",
    tel: "",
    longitude: "",
    latitude: "",
    altitude: "",
    opening_date_time: "",
    closing_date_time: "",
    opening_date: "",
    opening_time: "",
    closing_date: "",
    closing_time: "",
    public_availability: "",
    active_flg: "",
    remarks: "",
  };

  function fetchData(response) {
    setLoader(true);
    const model = response.data.model;
    let openingDate = model.opening_date_time
      ? new Date(model.opening_date_time)
      : "";
    let closingDate = model.closing_date_time
      ? new Date(model.closing_date_time)
      : "";
    initialValues.name = model.name || "";
    initialValues.refugee_name = model.refugee_name || "";
    initialValues.name_en = model.name_en || "";
    initialValues.postal_code_1 = model.zip_code
      ? model.zip_code.split("-")[0]
      : "";
    initialValues.postal_code_2 = model.zip_code
      ? model.zip_code.split("-")[1]
      : "";
    initialValues.prefecture_id = model.prefecture_id || "";
    initialValues.address = model.address || "";
    initialValues.prefecture_en_id = model.prefecture_en_id || "";
    initialValues.address_en = model.address_en || "";
    initialValues.postal_code_default_1 = model.zip_code_default
      ? model.zip_code_default.split("-")[0]
      : "";
    initialValues.postal_code_default_2 = model.zip_code_default
      ? model.zip_code_default.split("-")[1]
      : "";
    initialValues.prefecture_id_default = model.prefecture_id_default || "";
    initialValues.address_default = model.address_default || "";
    initialValues.prefecture_default_en_id =
      model.prefecture_default_en_id || "";
    initialValues.address_default_en = model.address_default_en || "";
    initialValues.total_place = model.total_place || "";
    initialValues.tel = model.tel || "";
    initialValues.longitude = model?.map?.longitude || "";
    initialValues.latitude = model?.map?.latitude || "";
    initialValues.altitude = model.altitude || "";
    initialValues.opening_date = openingDate;
    initialValues.closing_date = closingDate;
    initialValues.public_availability = model.public_availability === 1;
    initialValues.active_flg = model.active_flg === 1;
    initialValues.remarks = model.remarks || "";
    setLoader(false);
    setApiResponse(model);
    setCurrentlatitude(parseFloat(model?.map?.latitude));
    setCurrentlongitude(parseFloat(model?.map?.longitude));
  }

  // map search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = (setFieldValue) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results, status) => {
      if (status === "OK" && results[0]) {
        const { location } = results[0].geometry;
        setFieldValue("latitude", location.lat());
        setFieldValue("longitude", location.lng());
        setSearchResult({
          lat: location.lat(),
          lng: location.lng(),
        });
      } else {
        alert("Location not found");
      }
    });
  };

  const updatePlace = (response) => {
    if (response) {
      router.push("/admin/place");
    }
  };

  const deleteContent = (
    <div className="text-center">
      <div className="mb-3">
        {translate(localeJson, "Place_Delete_Content_1")}
      </div>
      <div>{translate(localeJson, "Place_Delete_Content_2")}</div>
    </div>
  );

  const deleteSelectedPlace = (res) => {
    if (res) {
      router.push("/admin/place");
    }
  };
  return (
    <>
      <CommonDialog
        open={placeEditDialogVisible}
        dialogBodyClassName="p-3"
        header={translate(localeJson, "confirmation")}
        content={deleteContent}
        position={"center"}
        footerParentClassName={"text-center"}
        footerButtonsArray={[
          {
            buttonProps: {
              buttonClass: "text-600 w-8rem",
              bg: "bg-white",
              hoverBg: "hover:surface-500 hover:text-white",
              text: translate(localeJson, "cancel"),
              onClick: () => {
                setPlaceEditDialogVisible(false);
              },
            },
            parentClass: "inline",
          },
          {
            buttonProps: {
              buttonClass: "w-8rem",
              hoverBg: "hover:surface-500 hover:text-white",
              text: translate(localeJson, "ok"),
              severity: "danger",
              onClick: () => {
                setLoader(true);
                deletePlace(id, deleteSelectedPlace);
                setLoader(false);
              },
            },
            parentClass: "inline",
          },
        ]}
        close={() => {
          setPlaceEditDialogVisible(false);
        }}
      />
      <Formik
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={(values, error) => {
          const openingDate = new Date(values.opening_date);
          const closingDate = new Date(values.closing_date);

          const sourceDate = new Date(values.opening_time);
          if (!isNaN(sourceDate)) {
            const minutes = sourceDate.getMinutes();
            const hours = sourceDate.getHours();
            const openingDateMinute = openingDate.getMinutes();
            const openingDateHours = openingDate.getHours();
            if (openingDateMinute == minutes && openingDateHours == hours) {
              openingDate.setMinutes(minutes);
              openingDate.setHours(hours);
            }
          }
          const sourceDate2 = new Date(values.closing_time);
          if (!isNaN(sourceDate2)) {
            const ClosingMinutes = sourceDate2.getMinutes();
            const ClosingHours = sourceDate2.getHours();
            const closingDateMinute = openingDate.getMinutes();
            const closingDateHours = openingDate.getHours();
            if (
              closingDateMinute != ClosingMinutes &&
              closingDateHours != ClosingHours
            ) {
              closingDate.setMinutes(ClosingMinutes);
              closingDate.setHours(ClosingHours);
            }
          }
          values.public_availability = values.public_availability ? "1" : "0";
          values.active_flg = values.active_flg ? "1" : "0";
          values.opening_date_time = values.opening_date
            ? getGeneralDateTimeDisplayFormat(openingDate)
            : "";
          values.closing_date_time = values.opening_date
            ? getGeneralDateTimeDisplayFormat(closingDate)
            : "";
          update(values, updatePlace);
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
          resetForm,
          setFieldValue,
        }) => (
          <div className="grid">
            <div className="col-12">
              <div className="card">
                {/* Header */}
                <h5 className="page-header1">
                  {translate(localeJson, "edit_place")}
                </h5>
                <hr />
                <form onSubmit={handleSubmit}>
                  <div className="col-12 lg:flex p-0">
                    <div className="col-12 lg:col-6 p-0">
                      <div>
                        <div className="mb-5 mt-5">
                          <InputFloatLabel
                            inputFloatLabelProps={{
                              id: "name", // Set id to 'evacuationLocation'
                              name: "name",
                              spanText: "*",
                              spanClass: "p-error",
                              value: values.name,
                              onChange: handleChange,
                              onBlur: handleBlur,
                              text: translate(
                                localeJson,
                                "evacuation_location"
                              ),
                              inputClass: "w-full",
                            }}
                            parentClass={`custom_input ${
                              errors.name && touched.name && "p-invalid pb-1"
                            }`}
                          />
                          <ValidationError
                            errorBlock={
                              errors.name && touched.name && errors.name
                            }
                          />
                        </div>

                        <div className="mb-5">
                          <InputFloatLabel
                            inputFloatLabelProps={{
                              id: "refugee_name",
                              name: "refugee_name",
                              spanText: "",
                              spanClass: "",
                              value: values.refugee_name,
                              onChange: handleChange,
                              onBlur: handleBlur,
                              text: translate(
                                localeJson,
                                "evacuation_location_furigana"
                              ),
                              inputClass: "w-full",
                            }}
                            parentClass={`custom_input ${
                              errors.refugee_name &&
                              touched.refugee_name &&
                              "p-invalid pb-1"
                            }`}
                          />
                          <ValidationError
                            errorBlock={
                              errors.refugee_name &&
                              touched.refugee_name &&
                              errors.refugee_name
                            }
                          />
                        </div>

                        <div className="mb-5">
                          <InputFloatLabel
                            inputFloatLabelProps={{
                              id: "name_en",
                              name: "name_en",
                              spanText: "",
                              spanClass: "",
                              value: values.name_en,
                              onChange: handleChange,
                              onBlur: handleBlur,
                              text: translate(
                                localeJson,
                                "evacuation_location_english"
                              ),
                              inputClass: "w-full",
                            }}
                            parentClass={`custom_input ${
                              errors.name_en &&
                              touched.name_en &&
                              "p-invalid pb-1"
                            }`}
                          />
                          <ValidationError
                            errorBlock={
                              errors.name_en &&
                              touched.name_en &&
                              errors.name_en
                            }
                          />
                        </div>

                        <div className="mb-5">
                          <div className="lg:flex lg:mb-5">
                            <div className="lg:col-6 flex  p-0">
                              <div className="flex flex-column w-full">
                                <InputFloatLabel
                                  inputFloatLabelProps={{
                                    id: "postal_code_1",
                                    name: "postal_code_1",
                                    spanText: "*",
                                    spanClass: "p-error",
                                    value: values.postal_code_1,
                                    onChange: (evt) => {
                                      setFieldValue(
                                        "postal_code_1",
                                        evt.target.value
                                      );
                                      let val = evt.target.value;
                                      let val2 = values.postal_code_2;
                                      if (
                                        val !== undefined &&
                                        val !== null &&
                                        val2 !== undefined &&
                                        val2 !== null
                                      ) {
                                        if (
                                          val.length == 3 &&
                                          val2.length == 4
                                        ) {
                                          let payload = `${evt.target.value}-${values.postal_code_2}`;
                                          getAddressByZipCode(
                                            payload,
                                            (response) => {
                                              if (response) {
                                                let address = response[0];
                                                const selectedPrefecture =
                                                  prefectures.find(
                                                    (prefecture) =>
                                                      prefecture.value ==
                                                      address.prefcode
                                                  );
                                                setFieldValue(
                                                  "prefecture_id",
                                                  selectedPrefecture?.value
                                                );
                                                setFieldValue(
                                                  "address",
                                                  address.address2
                                                );
                                              } else {
                                                setFieldValue(
                                                  "prefecture_id",
                                                  ""
                                                );
                                                setFieldValue("address", "");
                                              }
                                            }
                                          );
                                        }
                                      }
                                    },
                                    onBlur: handleBlur,
                                    text: translate(localeJson, "postal_code"),
                                    inputClass: "w-full",
                                  }}
                                  parentClass={`custom-input flex w-full ${
                                    errors.postal_code_1 &&
                                    touched.postal_code_1 &&
                                    "p-invalid pb-1"
                                  }`}
                                />
                                <ValidationError
                                  errorBlock={
                                    errors.postal_code_1 &&
                                    touched.postal_code_1 &&
                                    errors.postal_code_1
                                  }
                                />
                              </div>
                            </div>
                            <div className="lg:col-1 flex align-items-center justify-content-center">
                              -
                            </div>
                            <div className="lg:col-5 p-0 mb-5 lg:mb-0">
                              <InputFloatLabel
                                inputFloatLabelProps={{
                                  id: "postal_code_2",
                                  name: "postal_code_2",
                                  spanText: "*",
                                  spanClass: "p-error",
                                  value: values.postal_code_2,
                                  onChange: (evt) => {
                                    setFieldValue(
                                      "postal_code_2",
                                      evt.target.value
                                    );
                                    let val = evt.target.value;
                                    let val2 = values.postal_code_1;
                                    if (
                                      val !== undefined &&
                                      val !== null &&
                                      val2 !== undefined &&
                                      val2 !== null
                                    ) {
                                      if (val.length == 4 && val2.length == 3) {
                                        let payload = `${values.postal_code_1}-${evt.target.value}`;
                                        getAddressByZipCode(
                                          payload,
                                          (response) => {
                                            if (response) {
                                              let address = response[0];
                                              const selectedPrefecture =
                                                prefectures.find(
                                                  (prefecture) =>
                                                    prefecture.value ==
                                                    address.prefcode
                                                );

                                              setFieldValue(
                                                "prefecture_id",
                                                selectedPrefecture?.value
                                              );
                                              setFieldValue(
                                                "address",
                                                address.address2
                                              );
                                            } else {
                                              setFieldValue(
                                                "prefecture_id",
                                                ""
                                              );
                                              setFieldValue("address", "");
                                            }
                                          }
                                        );
                                      }
                                    }
                                  },
                                  onBlur: handleBlur,
                                  inputClass: "w-full",
                                  text: translate(localeJson, "postal_code"),
                                }}
                                parentClass={`${
                                  errors.postal_code_2 &&
                                  touched.postal_code_2 &&
                                  "p-invalid pb-1"
                                }`}
                              />
                              <ValidationError
                                errorBlock={
                                  errors.postal_code_2 &&
                                  touched.postal_code_2 &&
                                  errors.postal_code_2
                                }
                              />
                            </div>
                          </div>
                          <div className="lg:flex">
                            <div className="lg:col-6 lg:pl-0 mb-5 lg:mb-0">
                              <SelectFloatLabel
                                selectFloatLabelProps={{
                                  name: "prefecture_id",
                                  value: values.prefecture_id,
                                  options: prefectures,
                                  optionLabel: "name",
                                  selectClass: "w-full",
                                  spanText: "*",
                                  spanClass: "p-error",
                                  onChange: handleChange,
                                  onBlur: handleBlur,
                                  text: translate(
                                    localeJson,
                                    "prefecture_places"
                                  ),
                                }}
                                parentClass={`${
                                  errors.prefecture_id &&
                                  touched.prefecture_id &&
                                  "p-invalid pb-1"
                                }`}
                              />
                              <ValidationError
                                errorBlock={
                                  errors.prefecture_id &&
                                  touched.prefecture_id &&
                                  errors.prefecture_id
                                }
                              />
                            </div>

                            <div className="lg:col-6 lg:pr-0">
                              <InputFloatLabel
                                inputFloatLabelProps={{
                                  id: "address",
                                  name: "address",
                                  spanText: "*",
                                  spanClass: "p-error",
                                  value: values.address,
                                  onChange: handleChange,
                                  onBlur: handleBlur,
                                  text: translate(localeJson, "address"),
                                  inputClass: "w-full",
                                }}
                                parentClass={`custom_input ${
                                  errors.address &&
                                  touched.address &&
                                  "p-invalid pb-1"
                                }`}
                              />
                              <ValidationError
                                errorBlock={
                                  errors.address &&
                                  touched.address &&
                                  errors.address
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <div className="lg:flex mb-5">
                          <div className="lg:col-6 mb-5 lg:mb-0 lg:pl-0">
                            <SelectFloatLabel
                              selectFloatLabelProps={{
                                name: "prefecture_en_id",
                                value: values.prefecture_en_id,
                                options: prefectures_en,
                                optionLabel: "name",
                                selectClass: "w-full",
                                onChange: handleChange,
                                onBlur: handleBlur,
                                text: translate(
                                  localeJson,
                                  "prefecture_places_en"
                                ),
                              }}
                              parentClass={`${
                                errors.prefecture_en_id &&
                                touched.prefecture_en_id &&
                                "p-invalid pb-1"
                              }`}
                            />
                            <ValidationError
                              errorBlock={
                                errors.prefecture_en_id &&
                                touched.prefecture_en_id &&
                                errors.prefecture_en_id
                              }
                            />
                          </div>
                          <div className="lg:col-6 lg:pr-0">
                            <InputFloatLabel
                              inputFloatLabelProps={{
                                id: "address_en",
                                name: "address_en",
                                value: values.address_en,
                                onChange: handleChange,
                                onBlur: handleBlur,
                                text: translate(localeJson, "address_en"),
                                inputClass: "w-full",
                              }}
                              parentClass={`custom_input ${
                                errors.address_en &&
                                touched.address_en &&
                                "p-invalid pb-1"
                              }`}
                            />
                            <ValidationError
                              errorBlock={
                                errors.address_en &&
                                touched.address_en &&
                                errors.address_en
                              }
                            />
                          </div>
                        </div>

                        <div className="mb-5">
                          <div className="lg:flex lg:mb-5">
                            <div className="lg:col-6 flex  p-0">
                              <div className="flex flex-column w-full">
                                <InputFloatLabel
                                  inputFloatLabelProps={{
                                    id: "postal_code_default_1",
                                    name: "postal_code_default_1",
                                    spanText: "*",
                                    spanClass: "p-error",
                                    value: values.postal_code_default_1,
                                    onChange: (evt) => {
                                      setFieldValue(
                                        "postal_code_default_1",
                                        evt.target.value
                                      );
                                      let val = evt.target.value;
                                      let val2 = values.postal_code_default_2;
                                      if (
                                        val !== undefined &&
                                        val !== null &&
                                        val2 !== undefined &&
                                        val2 !== null
                                      ) {
                                        if (
                                          val.length == 3 &&
                                          val2.length == 4
                                        ) {
                                          let payload = `${evt.target.value}-${values.postal_code_default_2}`;
                                          getAddressByZipCode(
                                            payload,
                                            (response) => {
                                              if (response) {
                                                let address = response[0];
                                                const selectedPrefecture =
                                                  prefectures.find(
                                                    (prefecture) =>
                                                      prefecture.value ==
                                                      address.prefcode
                                                  );
                                                setFieldValue(
                                                  "prefecture_id_default",
                                                  selectedPrefecture?.value
                                                );
                                                setFieldValue(
                                                  "address_default",
                                                  address.address2
                                                );
                                              } else {
                                                setFieldValue(
                                                  "prefecture_id_default",
                                                  ""
                                                );
                                                setFieldValue(
                                                  "address_default",
                                                  ""
                                                );
                                              }
                                            }
                                          );
                                        }
                                      }
                                    },
                                    onBlur: handleBlur,
                                    text: translate(
                                      localeJson,
                                      "default_postal_code"
                                    ),
                                    inputClass: "w-full",
                                  }}
                                  parentClass={`custom-input flex w-full ${
                                    errors.postal_code_default_1 &&
                                    touched.postal_code_default_1 &&
                                    "p-invalid pb-1"
                                  }`}
                                />
                                <ValidationError
                                  errorBlock={
                                    errors.postal_code_default_1 &&
                                    touched.postal_code_default_1 &&
                                    errors.postal_code_default_1
                                  }
                                />
                              </div>
                            </div>
                            <div className="lg:col-1 flex align-items-center justify-content-center">
                              -
                            </div>
                            <div className="lg:col-5 p-0 mb-5 lg:mb-0 mt-3 lg:mt-0">
                              <InputFloatLabel
                                inputFloatLabelProps={{
                                  id: "postal_code_default_2",
                                  name: "postal_code_default_2",
                                  spanText: "*",
                                  spanClass: "p-error",
                                  value: values.postal_code_default_2,
                                  onChange: (evt) => {
                                    setFieldValue(
                                      "postal_code_default_2",
                                      evt.target.value
                                    );
                                    let val2 = evt.target.value;
                                    let val = values.postal_code_default_1;
                                    if (
                                      val !== undefined &&
                                      val !== null &&
                                      val2 !== undefined &&
                                      val2 !== null
                                    ) {
                                      if (val.length == 3 && val2.length == 4) {
                                        let payload = `${values.postal_code_default_1}-${evt.target.value}`;
                                        getAddressByZipCode(
                                          payload,
                                          (response) => {
                                            if (response) {
                                              let address = response[0];
                                              const selectedPrefecture =
                                                prefectures.find(
                                                  (prefecture) =>
                                                    prefecture.value ==
                                                    address.prefcode
                                                );
                                              setFieldValue(
                                                "prefecture_id_default",
                                                selectedPrefecture?.value
                                              );
                                              setFieldValue(
                                                "address_default",
                                                address.address2
                                              );
                                            } else {
                                              setFieldValue(
                                                "prefecture_id_default",
                                                ""
                                              );
                                              setFieldValue(
                                                "address_default",
                                                ""
                                              );
                                            }
                                          }
                                        );
                                      }
                                    }
                                  },
                                  onBlur: handleBlur,
                                  inputClass: "w-full",
                                  text: translate(
                                    localeJson,
                                    "default_postal_code"
                                  ),
                                }}
                                parentClass={`${
                                  errors.postal_code_default_2 &&
                                  touched.postal_code_default_2 &&
                                  "p-invalid pb-1"
                                }`}
                              />
                              <ValidationError
                                errorBlock={
                                  errors.postal_code_default_2 &&
                                  touched.postal_code_default_2 &&
                                  errors.postal_code_default_2
                                }
                              />
                            </div>
                          </div>
                          <div className="lg:flex">
                            <div className="lg:col-6 lg:pl-0 mb-5 lg:mb-0">
                              <SelectFloatLabel
                                selectFloatLabelProps={{
                                  name: "prefecture_id_default",
                                  value: values.prefecture_id_default,
                                  options: prefectures,
                                  optionLabel: "name",
                                  selectClass: "w-full",
                                  spanText: "*",
                                  spanClass: "p-error",
                                  onChange: handleChange,
                                  onBlur: handleBlur,
                                  text: translate(
                                    localeJson,
                                    "default_prefecture_place"
                                  ),
                                }}
                                parentClass={`${
                                  errors.prefecture_id_default &&
                                  touched.prefecture_id_default &&
                                  "p-invalid pb-1"
                                }`}
                              />
                              <ValidationError
                                errorBlock={
                                  errors.prefecture_id_default &&
                                  touched.prefecture_id_default &&
                                  errors.prefecture_id_default
                                }
                              />
                            </div>

                            <div className="lg:col-6 lg:pr-0">
                              <InputFloatLabel
                                inputFloatLabelProps={{
                                  id: "address_default",
                                  name: "address_default",
                                  spanText: "*",
                                  spanClass: "p-error",
                                  value: values.address_default,
                                  onChange: handleChange,
                                  onBlur: handleBlur,
                                  text: translate(
                                    localeJson,
                                    "default_address"
                                  ),
                                  inputClass: "w-full",
                                }}
                                parentClass={`custom_input ${
                                  errors.address_default &&
                                  touched.address_default &&
                                  "p-invalid pb-1"
                                }`}
                              />
                              <ValidationError
                                errorBlock={
                                  errors.address_default &&
                                  touched.address_default &&
                                  errors.address_default
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="lg:flex mb-5">
                          <div className="lg:col-6 mb-5 lg:mb-0 lg:pl-0">
                            <SelectFloatLabel
                              selectFloatLabelProps={{
                                name: "prefecture_default_en_id",
                                value: values.prefecture_default_en_id,
                                options: prefectures_en,
                                optionLabel: "name",
                                selectClass: "w-full",
                                onChange: handleChange,
                                onBlur: handleBlur,
                                text: translate(
                                  localeJson,
                                  "default_prefecture_place_en"
                                ),
                              }}
                              parentClass={`${
                                errors.prefecture_default_en_id &&
                                touched.prefecture_default_en_id &&
                                "p-invalid pb-1"
                              }`}
                            />
                            <ValidationError
                              errorBlock={
                                errors.prefecture_default_en_id &&
                                touched.prefecture_default_en_id &&
                                errors.prefecture_default_en_id
                              }
                            />
                          </div>
                          <div className="lg:col-6 lg:pr-0">
                            <InputFloatLabel
                              inputFloatLabelProps={{
                                id: "address_default_en",
                                name: "address_default_en",
                                value: values.address_default_en,
                                onChange: handleChange,
                                onBlur: handleBlur,
                                text: translate(
                                  localeJson,
                                  "default_address_en"
                                ),
                                inputClass: "w-full",
                              }}
                              parentClass={`custom_input ${
                                errors.address_default_en &&
                                touched.address_default_en &&
                                "p-invalid pb-1"
                              }`}
                            />
                            <ValidationError
                              errorBlock={
                                errors.address_default_en &&
                                touched.address_default_en &&
                                errors.address_default_en
                              }
                            />
                          </div>
                        </div>
                        <div className="mb-5">
                          <InputNumberFloatLabel
                            inputNumberFloatProps={{
                              id: "total_place",
                              name: "total_place",
                              spanText: "*",
                              spanClass: "p-error",
                              value: values.total_place,
                              onChange: (evt) => {
                                setFieldValue("total_place", evt.value);
                              },
                              onBlur: handleBlur,
                              text: translate(localeJson, "capacity"),
                              inputNumberClass: "w-full",
                            }}
                            parentClass={`custom_input ${
                              errors.total_place &&
                              touched.total_place &&
                              "p-invalid pb-1"
                            }`}
                          />
                          <ValidationError
                            errorBlock={
                              errors.total_place &&
                              touched.total_place &&
                              errors.total_place
                            }
                          />
                        </div>

                        <div className="mb-5">
                          <InputFloatLabel
                            inputFloatLabelProps={{
                              id: "tel",
                              name: "tel",
                              spanText: "*",
                              spanClass: "p-error",
                              value: values.tel,
                              onChange: handleChange,
                              onBlur: handleBlur,
                              text: translate(localeJson, "phone_number"),
                              inputClass: "w-full",
                            }}
                            parentClass={`custom_input ${
                              errors.tel && touched.tel && "p-invalid pb-1"
                            }`}
                          />
                          <ValidationError
                            errorBlock={errors.tel && touched.tel && errors.tel}
                          />
                        </div>

                        <div className="lg:flex mb-5">
                          <div className="lg:col-6 mb-5 lg:mb-0 lg:pl-0 ">
                            <InputNumberFloatLabel
                              inputNumberFloatProps={{
                                id: "latitude",
                                name: "latitude",
                                mode: "decimal",
                                maxFractionDigits: "10",
                                spanText: "*",
                                spanClass: "p-error",
                                value: values.latitude,
                                onChange: (evt) => {
                                  setFieldValue("latitude", evt.value);
                                },
                                onBlur: handleBlur,
                                text: translate(localeJson, "latitude"),
                                inputNumberClass: "w-full",
                              }}
                              parentClass={` ${
                                errors.latitude &&
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
                          <div className="lg:col-6 lg:pr-0">
                            <InputNumberFloatLabel
                              inputNumberFloatProps={{
                                id: "longitude",
                                name: "longitude",
                                mode: "decimal",
                                maxFractionDigits: "10",
                                spanText: "*",
                                spanClass: "p-error",
                                value: values.longitude,
                                onChange: (evt) => {
                                  setFieldValue("longitude", evt.value);
                                },
                                onBlur: handleBlur,
                                text: translate(localeJson, "longitude"),
                                inputNumberClass: "w-full",
                              }}
                              parentClass={`${
                                errors.longitude &&
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

                        <div className="mb-5">
                          <InputNumberFloatLabel
                            inputNumberFloatProps={{
                              id: "altitude",
                              name: "altitude",
                              spanText: "*",
                              spanClass: "p-error",
                              value: values.altitude,
                              mode: "decimal",
                              maxFractionDigits: "10",
                              onChange: (evt) => {
                                setFieldValue("altitude", evt.value);
                              },
                              onBlur: handleBlur,
                              text: translate(localeJson, "altitude"),
                              inputNumberClass: "w-full",
                            }}
                            parentClass={`${
                              errors.altitude &&
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

                        <div className="lg:flex mb-5">
                          <div className="lg:col-7 mb-5 lg:mb-0 lg:pl-0">
                            <DateCalendarFloatLabel
                              date={values.opening_date}
                              dateFloatLabelProps={{
                                name: "opening_date",
                                dateClass: "w-full",
                                date: initialValues.opening_date,
                                onChange: (evt) => {
                                  setFieldValue(
                                    "opening_date",
                                    evt.target.value
                                  );
                                },
                                onBlur: handleBlur,
                                text: translate(
                                  localeJson,
                                  "opening_date_time"
                                ), // Add a label text specific to date
                              }}
                              parentClass={`${
                                errors.opening_date &&
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
                          <div className="lg:col-5 lg:pr-0">
                            <TimeCalendarFloatLabel
                              date={values.opening_date}
                              timeFloatLabelProps={{
                                name: "opening_time",
                                timeClass: "w-full",
                                onChange: handleChange,
                                onBlur: handleBlur,
                              }}
                              parentClass={`${
                                errors.opening_time &&
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
                        <div className="lg:flex mb-5">
                          <div className="lg:col-7 mb-5 lg:mb-0 lg:pl-0">
                            <DateCalendarFloatLabel
                              date={values.closing_date}
                              dateFloatLabelProps={{
                                name: "closing_date",
                                dateClass: "w-full",
                                onChange: (evt) => {
                                  setFieldValue(
                                    "closing_date",
                                    evt.target.value
                                  );
                                },
                                onBlur: handleBlur,
                                text: translate(
                                  localeJson,
                                  "closing_date_time"
                                ), // Add a label text specific to date
                              }}
                              parentClass={`${
                                errors.closing_date &&
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
                          <div className="lg:col-5 lg:pr-0">
                            <TimeCalendarFloatLabel
                              date={values.closing_date}
                              timeFloatLabelProps={{
                                name: "closing_time",
                                timeClass: "w-full",
                                onChange: handleChange,
                                onBlur: handleBlur,
                              }}
                              parentClass={`${
                                errors.closing_time &&
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
                        <div className="mb-5">
                          <div className="lg:col-12">
                            <NormalLabel
                              text={translate(
                                localeJson,
                                "foreign_publication"
                              )}
                            />
                          </div>
                          <div className="lg:col-12">
                            <InputSwitch
                              inputSwitchProps={{
                                name: "public_availability",
                                checked: values.public_availability,
                                switchClass: "",
                                onChange: handleChange,
                              }}
                              parentClass={`custom-switch ${
                                errors.public_availability &&
                                touched.public_availability &&
                                "p-invalid pb-1"
                              }`}
                            />
                            <ValidationError
                              errorBlock={
                                errors.public_availability &&
                                touched.public_availability &&
                                errors.public_availability
                              }
                            />
                          </div>
                        </div>
                        <div className="mb-5">
                          <div className="pb-1 lg:col-12">
                            <NormalLabel
                              text={translate(localeJson, "status")}
                            />
                          </div>
                          <div className="lg:col-12">
                            <InputSwitch
                              inputSwitchProps={{
                                name: "active_flg",
                                checked: values.active_flg,
                                switchClass: "",
                                onChange: handleChange,
                              }}
                              parentClass={`custom-switch ${
                                errors.active_flg &&
                                touched.active_flg &&
                                "p-invalid pb-1"
                              }`}
                            />
                          </div>
                        </div>
                        <div className="mb-5">
                          <InputFloatLabel
                            inputFloatLabelProps={{
                              id: "remarks",
                              name: "remarks",
                              spanText: "",
                              spanClass: "",
                              value: values.remarks,
                              onChange: handleChange,
                              onBlur: handleBlur,
                              text: translate(localeJson, "remarks"),
                              inputClass: "w-full",
                            }}
                            parentClass={`${
                              errors.remarks &&
                              touched.remarks &&
                              "p-invalid pb-1"
                            }`}
                          />
                          <ValidationError
                            errorBlock={
                              errors.remarks &&
                              touched.remarks &&
                              errors.remarks
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 lg:col-6 p-0 lg:pl-5 mt-5">
                      <GoogleMapComponent
                        height={"450px"}
                        search={true}
                        initialPosition={{
                          lat: currentLattitude,
                          lng: currentLongitude,
                        }}
                        searchResult={searchResult}
                      />
                      <div className="mt-5  lg:flex">
                        <div className="lg:col-9 lg:pl-0 mb-5 lg:mb-0">
                          <InputFloatLabel
                            inputFloatLabelProps={{
                              id: "searchQuery",
                              name: "searchQuery",
                              spanText: "",
                              spanClass: "",
                              value: searchQuery,
                              onChange: (e) => {
                                setSearchQuery(e.target.value);
                              },
                              onBlur: handleBlur,
                              text: translate(localeJson, "place_search"),
                              inputClass: "w-full",
                            }}
                            parentClass="custom_input"
                          />
                        </div>
                        <div className="lg:col-3 lg:pr-0">
                          <Button
                            buttonProps={{
                              buttonClass:
                                "evacuation_button_height lg:search-button  lg:w-full mobile-input",
                              text: translate(localeJson, "search_text"),
                              icon: "pi pi-search",
                              severity: "primary",
                              type: "button",
                              onClick: (evt) => {
                                evt.preventDefault();
                                handleSearch(setFieldValue);
                              },
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="lg:flex pt-3 justify-content-start">
                    <div className="flex justify-content-start mb-3 lg:mb-0">
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
                          onClick: () => {
                            router.push("/admin/place");
                          },
                        }}
                      />
                    </div>

                    <div className="flex justify-content-start lg:pl-5  mb-3 lg:mb-0">
                      <Button
                        buttonProps={{
                          buttonClass: "evacuation_button_height",
                          type: "submit",
                          text: translate(localeJson, "edit"),
                          rounded: "true",
                          severity: "primary",
                        }}
                      />
                    </div>

                    <div className="flex justify-content-start lg:pl-5  mb-3 lg:mb-0">
                      <Button
                        buttonProps={{
                          buttonClass: "text-600 evacuation_button_height",
                          bg: "bg-white",
                          hoverBg: "hover:surface-500 hover:text-white",
                          type: "button",
                          text: translate(localeJson, "delete"),
                          rounded: "true",
                          severity: "primary",
                          onClick: () => {
                            setPlaceEditDialogVisible(true);
                          },
                        }}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </>
  );
}
