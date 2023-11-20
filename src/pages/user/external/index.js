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
import { Formik } from "formik";
import * as Yup from "yup";
import External from "@/components/modal/externalModal";
import { prefectures, prefectures_en , gender_jp , gender_en } from "@/utils/constant";
import { ExternalServices } from "@/services";

export default function PublicExternal() {
  const { locale, localeJson, setLoader } = useContext(LayoutContext);
  const [evacuee, setEvacuee] = useState([]);
  const [registerModalAction, setRegisterModalAction] = useState("create");
  const [specialCareEditOpen, setSpecialCareEditOpen] = useState(false);
  const [evacueeValues, setEvacueeValues] = useState("");
  const [shelterData, setShelterData] = useState([]);
  const [toggleSwitchShelterComponents, setToggleSwitchShelterComponents] = useState([]);
  const [editObj, setEditObj] = useState({});
  /* Services */
  const { getActivePlaceList, getAddressByZipCode , create } = ExternalServices;
  const [columns, setColumns] = useState([]);
  const formikRef = useRef();
  const initialValues = {
    evacuee: [],
    postalCode: "",
    prefecture_id: null,
    address: "",
    email: "",
    specific_location: "",
    toggleSwitches: Array(3).fill(false),
    toggleFoodSwitches: Array(2).fill(false),
    togglePlaceSwitches: "",
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
          if (parent.parent.toggleSwitches[0] === true && parent.parent.toggleFoodSwitches[0] === true) {
            return value.some((item) => item === true);
          } else {
            return true;
          }
        }
      ),
      postalCode: Yup.string().test(
        "required-when-toggleSwitches-true",
        translate(localeJson, "postal_code_required"),
        (value, parent) => {
          if (parent.parent.toggleSwitches[0] === true) {
            return !!value;
          } else {
            return true;
          }
        }
      ).min(8, translate(localeJson, "postal_code_length"))
      .max(8, translate(localeJson, "postal_code_length")),
      address: Yup.string().test(
        "required-when-toggleSwitches-true",
        translate(localeJson, "address_required"),
        (value, parent) => {
          if (parent.parent.toggleSwitches[0] === true) {
            return !!value;
          } else {
            return true;
          }
        }
      ).max(190, translate(localeJson, "address_max_length")),
      prefecture_id: Yup.string().nullable().test(
        "required-when-toggleSwitches-true",
        translate(localeJson, "prefecture_required"),
        (value, parent) => {
          if (parent.parent.toggleSwitches[0] === true) {
            return !!value;
          } else {
            return true;
          }
        }
      ),
      email: Yup.string()
      .test(
        "required-when-toggleSwitches-true",
        translate(localeJson, "email_required"),
        (value, parent) => {
          if (parent.parent.toggleSwitches[0] === true) {
            return !!value;
          } else {
            return true;
          }
        }
      )
      .email(translate(localeJson, "email_valid"))
      .matches(
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        translate(localeJson, "email_valid")
      ),
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
      ) .max(255, translate(localeJson, "specified_loc_max_len")),
      evacuee: Yup.array()
        .test(
          "evacuee-required-when-toggleSwitches-true",
          translate(localeJson, "c_required"),
          (value, parent) => {
            if (parent.parent.toggleSwitches[0] === true) {
              return value.length > 0;
            } else {
              return true;
            }
          }
        )
        .test(
          "evacuee-max-length",
          translate(localeJson, "table_count_max"), // Change this message as needed
          (value, parent) => {
            if (parent.parent.toggleSwitches[0] === true) {
              return value.length <= 20;
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
        parentClass={"w-15rem"}
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
        parentClass={"w-15rem"}
        onChange={() => handleFoodButtonClick(index)}
      />
    );
  });

  const cols = [
    {
      field: "name",
      header: translate(localeJson, "c_refugee_name"),
      minWidth: "16rem",
      maxWidth: "16rem",
      headerClassName: "custom-header",
    },
    {
      field: "dob",
      header: translate(localeJson, "c_dob"),
      minWidth: "6rem",
      maxWidth: "6rem",
      headerClassName: "custom-header",
    },
    {
      field: "age",
      header: translate(localeJson, "c_age"),
      minWidth: "6rem",
      maxWidth: "6rem",
      headerClassName: "custom-header",
    },
    {
      field: "gender",
      header: translate(localeJson, "c_gender"),
      minWidth: "6rem",
      maxWidth: "6rem",
      headerClassName: "custom-header",
      body: (rowData) => {
        const genderOptions = locale === 'ja' ? gender_jp : gender_en;
        const selectedGenderOption = genderOptions.find(option => option.value === rowData.gender);
        const displayedGenderName = selectedGenderOption ? selectedGenderOption.name : 'Unknown';
    
        return <span>{displayedGenderName}</span>;
      },
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
              type: "button",
              text: translate(localeJson, "edit"),
              buttonClass: "text-primary",
              bg: "bg-white",
              hoverBg: "hover:bg-primary hover:text-white",
              onClick: () => {
                setRegisterModalAction("edit");
                setSpecialCareEditOpen(true);
                let dob = new Date(rowData.dob)
                let currentData = {
                  id: rowData.id,
                  name: rowData.name,
                  dob: dob,
                  age: rowData.age,
                  gender: rowData.gender
                }
                setEditObj(currentData)
              },
            }}
          />
          <Button
            parentStyle={{ display: "inline" }}
            buttonProps={{
              type: "button",
              text: translate(localeJson, "delete"),
              buttonClass: "ml-2 delete-button",
              onClick: () => {
                setEvacuee((prevEvacuee) => {
                  let updated = prevEvacuee.filter((evacuee) => evacuee.id !== rowData.id)
                  formikRef.current?.setFieldValue("evacuee", updated);
                  return updated
                });
              }
            }}
            parentClass={"delete-button"}

          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (evacueeValues !== "") {
      setEvacuee((prevEvacuee) => {
        const evacueeIndex = prevEvacuee.findIndex((evacuee) => evacuee.id === evacueeValues.id);

        if (evacueeIndex !== -1) {
          // Update existing evacuee
          const updatedEvacuee = [...prevEvacuee];
          updatedEvacuee[evacueeIndex] = evacueeValues;
          formikRef.current?.setFieldValue("evacuee", updatedEvacuee);
          return updatedEvacuee;
        } else {
          // Add new evacuee
          formikRef.current?.setFieldValue("evacuee", [...prevEvacuee, evacueeValues]);
          return [...prevEvacuee, evacueeValues];
        }
      });
    }
  }, [evacueeValues, setEvacuee]);


  useEffect(() => {
    getDataOnMount()
  }, [locale]);

  const getDataOnMount = () => {
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
          parentClass={"w-15rem white-space-nowrap overflow-hidden text-overflow-ellipsis eli_button"}
          onChange={() => handlePlaceButtonClick(index)} // Assuming handleFoodButtonClick is your click handler
        />
      );
    });

    setToggleSwitchShelterComponents(newToggleSwitchComponents);
  }, [shelterData, placeButtonStates]); // Include other dependencies as needed

  const isCreated = (res) => {
    if(res) {
      router.push('/user/external/success');
    }
    setLoader(false)
  }

  return (
    <div>
      <External
        open={specialCareEditOpen}
        header={translate(
          localeJson,
          registerModalAction == "create"
            ? "enter_evacuee_event_registration"
            : "enter_evacuee_event_info_edit"
        )}
        close={() => setSpecialCareEditOpen(false)}
        editObj={editObj}
        buttonText={translate(
          localeJson,
          registerModalAction == "create" ? "submit" : "update"
        )}
        setEvacueeValues={setEvacueeValues}
        evacuee={evacuee}
        registerModalAction={registerModalAction}
      />
      <Formik
        innerRef={formikRef}
        validationSchema={validationSchema(localeJson)}
        initialValues={initialValues}
        enableReinitialize
        onSubmit={(values) => {
          let data = values
          let getTrueIndex = (toggleArray) => {
            for (let i = 0; i < toggleArray.length; i++) {
                if (toggleArray[i]) {
                    return i + 1;
                }
            }
            return 0; // Default value if no true found
        };
        
        let placeCategory = getTrueIndex(data.toggleSwitches);
        let convertedPayload = placeCategory === 1 ? {
          "place_category": placeCategory,
          "food_required": getTrueIndex(data.toggleFoodSwitches),
          "hinan_id": shelterData&&shelterData[getTrueIndex(data.togglePlaceSwitches)-1].id,
          "postal_code": data.postalCode.replace(/-/g, ''),
          "prefecture_id": data.prefecture_id,
          "address": data.address,
          "email": data.email,
          "person": data.evacuee.map((evacuee) => ({
              "name": evacuee.name,
              "dob": evacuee.dob.replace(/-/g, '/'),
              "age": evacuee.age,
              "gender": evacuee.gender
          }))
      } : 
      {
        "place_category": placeCategory,
        "place_detail": data.specific_location,
      };
        setLoader(true)
        create(convertedPayload,isCreated)
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
                          className="flex pb-3 mt-3"
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
                            emptyMessage={translate(localeJson, "external_table_count_message")}
                          />
                          <ValidationError
                            errorBlock={
                              errors.evacuee &&
                              touched.evacuee &&
                              errors.evacuee
                            }
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
                                id: "postalCode",
                                name: "postalCode",
                                spanText: "*",
                                spanClass: "p-error",
                                value: values.postalCode,
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
                                    setFieldValue("postalCode", val);
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
                                text: translate(localeJson, "c_postal_code"),
                                inputClass: "w-full",
                              }}
                              parentClass={`custom_input ${errors.postalCode &&
                                touched.postalCode &&
                                "p-invalid pb-1"
                                }`}
                            />
                            <ValidationError
                              errorBlock={
                                errors.postalCode &&
                                touched.postalCode &&
                                errors.postalCode
                              }
                            />
                          </div>
                          <div className="w-full">
                            <SelectFloatLabel
                              selectFloatLabelProps={{
                                name: "prefecture_id",
                                value: values.prefecture_id,
                                options: locale == "ja" ? prefectures : prefectures_en,
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
                              parentClass={`custom_input ${errors.prefecture_id &&
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
                              parentClass={`custom_input ${errors.address &&
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
                              parentClass={`${errors.email &&
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
                                  name: "specific_location",
                                  spanClass: "p-error",
                                  value: values.specific_location,
                                  onChange: handleChange,
                                  onBlur: handleBlur,
                                  inputClass:
                                    "w-full lg:w-25rem md:w-23rem sm:w-21rem ",
                                }}
                                parentClass={`${errors.specific_location &&
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
