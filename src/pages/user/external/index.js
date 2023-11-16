import React, { useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

import { LayoutContext } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from "@/helper";
import {
  Button,
  ToggleSwitch,
  NormalTable,
  InputFloatLabel,
  SelectFloatLabel,
  ValidationError,
} from "@/components";
// import { AuthenticationAuthorizationService } from '@/services';
import { Formik } from "formik";
import * as Yup from "yup";
import External from "@/components/modal/externalModal";
import { prefectures, prefectures_en } from "@/utils/constant";
import { ExternalServices } from "@/services";

export default function PublicExternal() {
  const { locale, localeJson, setLoader } = useContext(LayoutContext);
  const [evacuee, setEvacuee] = useState([]);
  const [registerModalAction, setRegisterModalAction] = useState("create");
  const [specialCareEditOpen, setSpecialCareEditOpen] = useState(false);
  const [evacueeValues, setEvacueeValues] = useState("");
  const [shelterData,setShelterData] = useState([]);
  const [toggleSwitchShelterComponents, setToggleSwitchShelterComponents] = useState([]);
  /* Services */
  const { getActivePlaceList,getAddressByZipCode } = ExternalServices;
  const [columns, setColumns] = useState([]);
  const formikRef = useRef();
  const initialValues = {
    familyCode: "",
    prefecture_id: null,
    address: "",
    email: "",
    specific_location: "",
    toggleSwitches: Array(3).fill(false),
    toggleFoodSwitches: Array(2).fill(false),
    togglePlaceSwitches:"",
  };
  const validationSchema = (localeJson) =>
  Yup.object().shape({
    toggleSwitches: Yup.array()
      .of(Yup.boolean())
      .test(
        "at-least-one-checked",
        translate(localeJson, "c_required"),
        (value) => value.includes(true)
      ),
    toggleFoodSwitches: Yup.array().test(
      "at-least-one-checked",
      translate(localeJson, "c_required"),
      (value, parent) => {
        if (parent.parent.toggleSwitches[0] === true) {
          return value.some((item) => item === true);
        } else {
          return true;
        }
      }
    ),
    togglePlaceSwitches: Yup.array().test(
      "at-least-one-checked",
      translate(localeJson, "c_required"),
      (value, parent) => {
        if (parent.parent.toggleSwitches[0] === true && parent.parent.toggleFoodSwitches[0] === true ) {
          return value.some((item) => item === true);
        } else {
          return true;
        }
      }
    ),
    familyCode: Yup.string().test(
      "required-when-toggleSwitches-true",
      translate(localeJson, "c_required"),
      (value, parent) => {
        if (parent.parent.toggleSwitches[0] === true) {
          return !!value;
        } else {
          return true;
        }
      }
    ),
    address: Yup.string().test(
      "required-when-toggleSwitches-true",
      translate(localeJson, "c_required"),
      (value, parent) => {
        if (parent.parent.toggleSwitches[0] === true) {
          return !!value;
        } else {
          return true;
        }
      }
    ),
    prefecture_id: Yup.string().nullable().test(
      "required-when-toggleSwitches-true",
      translate(localeJson, "c_required"),
      (value, parent) => {
        if (parent.parent.toggleSwitches[0] === true) {
          return !!value;
        } else {
          return true;
        }
      }
    ),
    email: Yup.string().test({
      name: "email_validation",
      message: translate(localeJson, "email_valid"),
      test: (value, parent) => {
        if (parent.parent.toggleSwitches[0] === true) {
          return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
        } else {
          return true;
        }
      },
    }),
    specific_location: Yup.string().nullable().test(
      "required-when-toggleSwitches-true",
      translate(localeJson, "c_required"),
      (value, parent) => {
        if (parent.parent.toggleSwitches[1] === true || parent.parent.toggleSwitches[2] === true) {
          return !!value;
        } else {
          return true;
        }
      }
    ),
  });


  const router = useRouter();
  // Getting storage data with help of reducers
  const [buttonStates, setButtonStates] = useState(Array(3).fill(false));

  const [foodButtonStates, setFoodButtonStates] = useState(
    Array(2).fill(false)
  );

  const [placeButtonStates, setPlaceButtonStates] = useState();

  const handleFoodButtonClick = (index) => {
    formikRef.current.setTouched({});
    const newButtonStates = [...foodButtonStates];
    newButtonStates.fill(false); // Uncheck all buttons
    newButtonStates[index] = true; // Check the clicked button
    formikRef.current?.setFieldValue("toggleFoodSwitches", newButtonStates);
  
    setFoodButtonStates(newButtonStates);
  };

  const handleButtonClick = (index) => {
    formikRef.current.setTouched({});
    const newButtonStates = [...buttonStates];
    newButtonStates.fill(false); // Uncheck all buttons
    newButtonStates[index] = true; // Check the clicked button
    formikRef.current.setFieldValue("toggleSwitches", newButtonStates);
    setButtonStates(newButtonStates);
  };

  const handlePlaceButtonClick = (index) => {
    formikRef.current.setTouched({});
    const newButtonStates = [...placeButtonStates];
    newButtonStates.fill(false); // Uncheck all buttons
    newButtonStates[index] = true; // Check the clicked button
    formikRef.current.setFieldValue("togglePlaceSwitches", newButtonStates);
    setPlaceButtonStates(newButtonStates);

  }
  const toggleSwitchComponents = buttonStates.map((checked, index) => {
    const offLabel =
      index === 0
        ? translate(localeJson, "within_city")
        : index === 1
        ? translate(localeJson, "city_outskirts")
        : translate(localeJson, "outside_prefecture");
    return (
      <ToggleSwitch
        key={index}
        checked={checked}
        onLabel={offLabel}
        offLabel={offLabel}
        parentClass={"w-11rem"}
        onChange={() => handleButtonClick(index)}
      />
    );
  });

  const toggleSwitchFoodComponents = foodButtonStates.map((checked, index) => {
    const offLabel =
      index === 0
        ? translate(localeJson, "c_yes")
        : translate(localeJson, "c_no");
    return (
      <ToggleSwitch
        key={index}
        checked={checked}
        onLabel={offLabel}
        offLabel={offLabel}
        parentClass={"w-11rem"}
        onChange={() => handleFoodButtonClick(index)}
      />
    );
  });

  const cols = [
    {
      field: "name",
      header: translate(localeJson, "c_name_furigana"),
      minWidth: "11rem",
      maxWidth: "11rem",
      headerClassName: "custom-header",
    },
    {
      field: "dob",
      header: translate(localeJson, "c_dob"),
      minWidth: "11rem",
      maxWidth: "11rem",
      headerClassName: "custom-header",
    },
    {
      field: "age",
      header: translate(localeJson, "c_age"),
      minWidth: "11rem",
      maxWidth: "11rem",
      headerClassName: "custom-header",
    },
    {
      field: "gender",
      header: translate(localeJson, "c_gender"),
      minWidth: "18rem",
      maxWidth: "18rem",
      headerClassName: "custom-header",
    },
    {
      field: "actions",
      header: translate(localeJson, "common_action"),
      textAlign: "center",
      className: "action_class",
      body: (rowData) => (
        <div>
          <Button
            parentStyle={{ display: "inline" }}
            buttonProps={{
              text: translate(localeJson, "edit"),
              buttonClass: "text-primary",
              bg: "bg-white",
              hoverBg: "hover:bg-primary hover:text-white",
              onClick: () => {
                setRegisterModalAction("edit");
                setSpecialCareEditOpen(true);
              },
            }}
          />
          <Button
            parentStyle={{ display: "inline" }}
            buttonProps={{
              type: "button",
              text: translate(localeJson, "delete"),
              buttonClass: "ml-2 delete-button",
            }}
            parentClass={"delete-button"}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (evacueeValues !== "") {
      console.log(evacueeValues);
      setEvacuee((prevEvacuee) => [...prevEvacuee, evacueeValues]);
    }
  }, [evacueeValues, setEvacuee]);

  useEffect(() => {
    getDataOnMount()
  }, [locale]);

  const getDataOnMount= ()=> {
    getActivePlaceList(isActivePlaces)
  }

  const isActivePlaces = (res) => {
    const data = res.data.model
    formikRef.current.setFieldValue("togglePlaceSwitches", Array(data.length).fill(false));
    setShelterData(data)
    setPlaceButtonStates(Array(data.length).fill(false))

  }
  useEffect(() => {
    const newToggleSwitchComponents = shelterData.map((shelter, index) => {
      const offLabel = shelter.name;

      return (
        <ToggleSwitch
          key={shelter.id}
          checked={placeButtonStates[index]} // Assuming placeButtonStates is an array of booleans
          onLabel={offLabel}
          offLabel={offLabel}
          parentClass={"w-full"}
          onChange={() => handlePlaceButtonClick(index)} // Assuming handleFoodButtonClick is your click handler
        />
      );
    });

    setToggleSwitchShelterComponents(newToggleSwitchComponents);
  }, [shelterData, placeButtonStates]); // Include other dependencies as needed



  return (
    <div>
      <External
        open={specialCareEditOpen}
        header={translate(
          localeJson,
          registerModalAction == "create"
            ? "questionnaire_event_registration"
            : "questionnaire_event_info_edit"
        )}
        close={() => setSpecialCareEditOpen(false)}
        buttonText={translate(
          localeJson,
          registerModalAction == "create" ? "submit" : "update"
        )}
        setEvacueeValues={setEvacueeValues}
      />
      <Formik
        innerRef={formikRef}
        validationSchema={validationSchema(localeJson)}
        initialValues={initialValues}
        enableReinitialize
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
        }) => (
          <div className="grid">
            <div className="col-12">
              <div className="card">
                <h5 className="page-header1 white-space-nowrap overflow-hidden text-overflow-ellipsis">
                  {translate(localeJson, "public_external")}
                </h5>
                <hr />
                <div>
                  <h5 className="page-header2 ">
                    {translate(localeJson, "not_visiting_the_shelter")}
                  </h5>

                  <form onSubmit={handleSubmit}>
                    <div className="custom-card shadow-4 flex flex-column mt-3">
                      <div className="mb-3">
                        <p>
                          {translate(
                            localeJson,
                            "which_place_Are_you_planning_to_evacuate"
                          )}
                          <span className="p-error">*</span>
                        </p>
                      </div>
                      <div className=" flex flex-wrap justify-content-start gap-3">
                        {toggleSwitchComponents}
                      </div>
                      <ValidationError
                        errorBlock={
                          errors.toggleSwitches &&
                          touched.toggleSwitches &&
                          errors.toggleSwitches
                        }
                      />
                    </div>
                    {values.toggleSwitches[0] == true && (
                      <div className="custom-card shadow-4 flex flex-column mt-3">
                        <p>
                          {translate(localeJson, "assistance_respect_food")}
                          <span className="p-error">*</span>
                        </p>
                        <div className=" flex flex-wrap justify-content-start gap-3 mb-3">
                          {toggleSwitchFoodComponents}
                        </div>
                        <ValidationError
                          errorBlock={
                            errors.toggleFoodSwitches &&
                            touched.toggleFoodSwitches &&
                            errors.toggleFoodSwitches
                          }
                        />
                         {values.toggleFoodSwitches[0] == true && (
                          <>
                          <p>
                          {translate(localeJson, "shelter_question")}
                          <span className="p-error">*</span>
                        </p>
                        <div className=" flex flex-wrap justify-content-start gap-3">
                          {toggleSwitchShelterComponents}
                        </div>
                        <ValidationError
                          errorBlock={
                            errors.togglePlaceSwitches &&
                            touched.togglePlaceSwitches &&
                            errors.togglePlaceSwitches
                          }
                        />
                        </>
                         )}
                        <div
                          className="flex pb-3"
                          style={{
                            justifyContent: "flex-end",
                            flexWrap: "wrap",
                          }}
                        >
                          <Button
                            buttonProps={{
                              type: "button",
                              rounded: "true",
                              buttonClass: "",
                              text: translate(
                                localeJson,
                                "c_enter_evacuee"
                              ),
                              onClick: () => {
                                setRegisterModalAction("create");
                                setSpecialCareEditOpen(true);
                              },
                              severity: "success",
                            }}
                            parentClass={"mr-1 mt-1"}
                          />
                        </div>
                        <div className="mb-5">
                          <NormalTable
                            lazy
                            totalRecords={5}
                            stripedRows={true}
                            className={"custom-table-cell"}
                            showGridlines={"true"}
                            value={evacuee}
                            columns={cols}
                            paginator={false}
                            paginatorLeft={false}
                          />
                        </div>
                        <p>
                          {translate(localeJson, "enter_current_address")}
                          <span className="p-error">*</span>
                        </p>
                        <div className="mt-3 mb-3 w-full flex gap-3">
                          <div className="w-full">
                            <InputFloatLabel
                              inputFloatLabelProps={{
                                id: "familyCode",
                                name: "familyCode",
                                spanText: "*",
                                spanClass: "p-error",
                                value: values.familyCode,
                                custom: "w-full custom_input",
                                hasIcon: true,
                                onChange: (evt) => {
                                  const re = /^[0-9-]+$/;
                                  let val;
                                  if (
                                    evt.target.value === "" ||
                                    re.test(evt.target.value)
                                  ) {
                                    val = evt.target.value.replace(/-/g, ""); // Remove any existing hyphens
                                    if (val.length > 3) {
                                      val =
                                        val.slice(0, 3) + "-" + val.slice(3);
                                    }
                                    setFieldValue("familyCode", val);
                                  }
                                  if (val.length >= 7) {
                                    let payload = val;
                                    getAddressByZipCode(payload, (response) => {
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
                                          address.address2 +
                                            (address.address3 || "")
                                        );
                                      } else {
                                        setFieldValue("prefecture_id", "");
                                        setFieldValue("address", "");
                                      }
                                    });
                                  }
                                },
                                onBlur: handleBlur,
                                text: translate(localeJson, "shelter_code"),
                                inputClass: "w-full",
                              }}
                              parentClass={`custom_input ${
                                errors.familyCode &&
                                touched.familyCode &&
                                "p-invalid pb-1"
                              }`}
                            />
                            <ValidationError
                              errorBlock={
                                errors.familyCode &&
                                touched.familyCode &&
                                errors.familyCode
                              }
                            />
                          </div>
                          <div className="w-full">
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

                          <div className="w-full">
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
                        <div>
                          {/* <p>
                          {translate(localeJson, "mail_address_for_reference")}
                          <span className="p-error">*</span>
                        </p> */}
                          <div className="mt-5">
                            <InputFloatLabel
                              inputFloatLabelProps={{
                                spanText: "*",
                                name: "email",
                                spanClass: "p-error",
                                value: values.email,
                                onChange: handleChange,
                                onBlur: handleBlur,
                                text: translate(
                                  localeJson,
                                  "mail_address_for_reference"
                                ),
                                inputClass:
                                  "w-full lg:w-25rem md:w-23rem sm:w-21rem ",
                              }}
                              parentClass={`${
                                errors.email &&
                                touched.email &&
                                "p-invalid pb-1"
                              }`}
                            />
                            <ValidationError
                              errorBlock={
                                errors.email && touched.email && errors.email
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {(values.toggleSwitches[1] == true ||
                      values.toggleSwitches[2] == true) && (
                      <div className="custom-card shadow-4 flex flex-column mt-3">
                        <p>
                        {translate(localeJson, "out_side_city_question")}
                        <span className="p-error">*</span>
                      </p>
                        <div>
                          <div className="">
                            <InputFloatLabel
                              inputFloatLabelProps={{
                                // spanText: "*",
                                name: "specific_location",
                                spanClass: "p-error",
                                value: values.specific_location,
                                onChange: handleChange,
                                onBlur: handleBlur,
                                // text: translate(
                                //   localeJson,
                                //   "out_side_city_question"
                                // ),
                                inputClass:
                                  "w-full lg:w-25rem md:w-23rem sm:w-21rem ",
                              }}
                              parentClass={`${
                                errors.specific_location &&
                                touched.specific_location &&
                                "p-invalid pb-1"
                              }`}
                            />
                            <ValidationError
                              errorBlock={
                                errors.specific_location &&
                                touched.specific_location &&
                                errors.specific_location
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="mt-3">
                      <Button
                        buttonProps={{
                          type: "submit",
                          buttonClass: "w-8rem",
                          text: translate(localeJson, "continue"),
                        }}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
}
