import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Formik } from "formik";
import * as Yup from "yup";

import { LayoutContext } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from "@/helper";
import {
  Button,
  DND,
  InputFloatLabel,
  InputNumberFloatLabel,
  InputSwitch,
  NormalCheckBox,
  NormalLabel,
  SelectFloatLabel,
  ValidationError,
} from "@/components";
import {InputFile} from '@/components/upload'
import { mapScaleRateOptions } from "@/utils/constant";
import { AiOutlineDrag } from "react-icons/ai";
import { systemSettingServices } from "@/services";
import { setLayout } from "@/redux/layout";
import { useAppDispatch } from '@/redux/hooks';

export default function Setting() {
  const { setLoader } = useContext(LayoutContext);
  const { localeJson, locale } = useContext(LayoutContext);
  const [response, setResponse] = useState({});
  const { getList, update } = systemSettingServices;
  const dispatch = useAppDispatch();

  const public_display_order_data= [
    {
        "is_visible": "0",
        "column_id": "0",
        "column_name": "refugee_name",
        "display_order": 1
    },
    {
        "is_visible": "0",
        "column_id": "1",
        "column_name": "name",
        "display_order": 2
    },
    {
        "is_visible": "0",
        "column_id": "2",
        "column_name": "age",
        "display_order": 3
    },
    {
        "is_visible": "0",
        "column_id": "3",
        "column_name": "gender",
        "display_order": 4
    },
    {
        "is_visible": "0",
        "column_id": "4",
        "column_name": "address",
        "display_order": 5
    }
]

  const schema = Yup.object().shape({
    map_scale: Yup.string().required(translate(localeJson, "map_scale_required")),
    footer: Yup.string().required(translate(localeJson, "footer_required")).max(
      200,
      translate(localeJson, "footer_display") +
        translate(localeJson, "max_length_200")
    ),
    type_name_ja: Yup.string().required(
      translate(localeJson, "type_name_jp_required")
    ).max(
      200,
      translate(localeJson, "type_name") +
        translate(localeJson, "max_length_200")
    ),
    system_name_ja: Yup.string().required(
      translate(localeJson, "system_name_jp_required")
    ).max(
      200,
      translate(localeJson, "system_name") +
        translate(localeJson, "max_length_200")
    ),
    disclosure_info_ja: Yup.string().required(
      translate(localeJson, "disclosure_info_jp_required")
    ).max(
      255,
      translate(localeJson, "disclosure_information") +
        translate(localeJson, "max_length_255")
    ),
    type_name_en: Yup.string().required(
      translate(localeJson, "type_name_en_required")
    ).max(
      200,
      translate(localeJson, "type_name") +
        translate(localeJson, "max_length_200")
    ),
    system_name_en: Yup.string().required(
      translate(localeJson, "system_name_en_required")
    ).max(
      200,
      translate(localeJson, "system_name") +
        translate(localeJson, "max_length_200")
    ),
    disclosure_info_en: Yup.string().required(
      translate(localeJson, "disclosure_info_en_required")
    ).max(
      255,
      translate(localeJson, "disclosure_information") +
        translate(localeJson, "max_length_255")
    ),
    latitude: Yup.number().required(translate(localeJson, "latitude_required")),
    default_shelf_life: Yup.number().required(
      translate(localeJson, "default_shell_life_days_required")
    ).min(1,translate(localeJson,"default_shelf_life_min_length")).max(999,translate(localeJson,"default_shelf_life_max_length")),
    longitude: Yup.number().required(
      translate(localeJson, "longitude_required")
    ),
    file: Yup.mixed()
      .nullable()
      .test(
        "is-image",
        translate(localeJson, "logo_img_correct_format"),
        (value) => {
          if (!value) return true; // If no file is selected, the validation passes.
          const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
          const fileExtension = value.split(".").pop().toLowerCase();
          if (allowedExtensions.includes(fileExtension)) {
            // Check image size not exceeding 3MB
            if (value.size <= 3 * 1024 * 1024) {
              return true; // Pass validation
            } else {
              // Custom error message for image size exceeded
              return new Yup.ValidationError(
                translate(localeJson, "logo_img_not_greater_than_3mb"),
                null
              );
            }
          }
          return false; // Return false for invalid input.
        }
      ),
  });
  const initialValues = {
    map_scale: "",
    footer: "",
    type_name_ja: "",
    system_name_ja: "",
    disclosure_info_ja: "",
    type_name_en: "",
    system_name_en: "",
    disclosure_info_en: "",
    latitude: "",
    longitude: "",
    initial_load_status: false,
    default_shelf_life: "",
    scheduler_option: false,
    image_logo: "",
  };
  const [data, setData] = useState([]);
  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      const prepareData = [...data];
      const item = prepareData.splice(fromIndex, 1)[0];
      prepareData.splice(toIndex, 0, item);
      // Update display_order based on the new order
      prepareData.forEach((item, index) => {
        item.display_order = index + 1;
        item.column_id = index;
      });

      setData(prepareData);
    },
    nodeSelector: "li",
    handleSelector: "a",
  };

  useEffect(() => {
    const fetchData = async () => {
      await onGetSystemListOnMounting();
      setLoader(false);
    };
    fetchData();
  }, [locale]);

  const onGetSystemListOnMounting = async () => {
    getList(fetchData);
  };

  function fetchData(res) {
    if (res) {
      setLoader(true);
      const data = res.data.model;
      dispatch(setLayout(data))
      initialValues.map_scale = data?.map_scale + "" || "";
      initialValues.footer = data?.footer || "";
      initialValues.type_name_ja = data?.type_name_ja || "";
      initialValues.disclosure_info_ja = data?.disclosure_info_ja || "";
      initialValues.system_name_ja = data?.system_name_ja || "";
      initialValues.type_name_en = data?.type_name_en || "";
      initialValues.disclosure_info_en = data?.disclosure_info_en || "";
      initialValues.system_name_en = data?.system_name_en || "";
      initialValues.latitude = data?.latitude || "";
      initialValues.longitude = data?.longitude || "";
      initialValues.initial_load_status =
        data?.initial_load_status == "1" ? true : false || "";
      initialValues.default_shelf_life = data?.default_shelf_life || "",
        initialValues.scheduler_option = data?.scheduler_option == "1" ? true : false || "";
      setLoader(false);
      let public_data= data?.public_display_order||public_display_order_data
      const PublicData = public_data.map((item) => {
        let namePublic;
        if (item.column_name == "name") {
          namePublic = "name_kanji";
        } else if (item.column_name == "refuge_name") {
          namePublic = "name_phonetic";
        } else {
          namePublic = item.column_name;
        }
        return {
          title: translate(localeJson, namePublic),
          is_visible: item.is_visible,
          column_id: item.column_id,
          column_name: item.column_name,
          display_order: item.display_order,
        };
      });
      setData(PublicData);
      setResponse(data);
    }
  }

  const handleChange = (e, index) => {
    const newData = [...data]; // Create a copy of the data array
    newData[index].is_visible = e.checked; // Update the is_visible property in the copy

    setData(newData); // Update state with the modified data
  };
  const map = (
    <ol>
      {data?.map((item, index) => (
        <li key={index}>
          <NormalCheckBox
            checkBoxProps={{
              checked: item?.is_visible == 1 ? true : false,
              onChange: (e) => handleChange(e, index),
            }}
          />
          <div className="ml-1 mr-1">{item?.title}</div>
          <a href="#" className="ml-2">
            <AiOutlineDrag />
          </a>
        </li>
      ))}
    </ol>
  );

  const isUpdated = (res) => {
    if(res)
    {
      onGetSystemListOnMounting()
    }
    setLoader(false)
    
  };

  return (
    <>
      <Formik
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          setLoader(true)
          const formData = new FormData();
           // Assuming values.initial_load_status and values.scheduler_option are boolean
        formData.append('initial_load_status', values.initial_load_status ? '1' : '0');
        formData.append('scheduler_option', values.scheduler_option ? '1' : '0');

       for (const key in values) {
         if (values[key] && key !== 'initial_load_status' && key !== 'scheduler_option') {
           formData.append(key, values[key]);
         }
       }
          data.forEach((item, index) => {
            for (const key in item) {
            item.is_visible = item.is_visible==true?"1":"0"
              if (key !== "title") {
                formData.append(
                  `public_display_order[${index}][${key}]`,
                  item[key]
                );
              }
            }
          });
          update(formData, isUpdated);
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
                <h5 className="page-header1">
                  {translate(localeJson, "setting_systems")}
                </h5>
                <hr />
                <form onSubmit={handleSubmit}>
                  <div className="flex p-5 pl-0 pr-0">
                    <div className="col-4 lg:col-4 md:col-4 align-self-center"></div>
                    <div className="flex-row col-8 lg:col-8 md:col-8">
                      <div>
                        <SelectFloatLabel
                          selectFloatLabelProps={{
                            id:"map_scale",
                            name: "map_scale",
                            optionLabel: "name",
                            selectClass: "w-full",
                            options: mapScaleRateOptions,
                            value: values.map_scale,
                            onChange: (e) =>
                            { 
                              setFieldValue("map_scale",e.value||"")
                          },
                            onBlur: handleBlur,
                            text: translate(
                              localeJson,
                              "overall_map_size_setting"
                            ),
                          }}
                          parentClass={`w-full ${
                            errors.map_scale && touched.map_scale && "p-invalid pb-1"
                          }`}
                        />
                        <ValidationError
                          errorBlock={
                            errors.map_scale && touched.map_scale && errors.map_scale
                          }
                        />
                      </div>
                      <div className="pt-5">
                        <InputFloatLabel
                          inputFloatLabelProps={{
                            text: translate(localeJson, "footer_display"),
                            value: values.footer,
                            onChange: handleChange,
                            onBlur: handleBlur,
                            name: "footer",
                            inputClass: "w-full",
                          }}
                          parentClass={`w-full ${
                            errors.footer && touched.footer && "p-invalid pb-1"
                          }`}
                        />
                        <ValidationError
                          errorBlock={
                            errors.footer && touched.footer && errors.footer
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="flex p-5 pl-0 pr-0">
                    <div className="col-4 lg:col-4 md:col-4 align-self-center">
                      {translate(localeJson, "japanese_notation")}
                    </div>
                    <div className="flex-row col-8 lg:col-8 md:col-8">
                      <div>
                        <InputFloatLabel
                          inputFloatLabelProps={{
                            text: translate(localeJson, "type_name"),
                            value: values.type_name_ja,
                            onChange: handleChange,
                            onBlur: handleBlur,
                            name: "type_name_ja",
                            inputClass: "w-full",
                          }}
                          parentClass={`w-full ${
                            errors.type_name_ja &&
                            touched.type_name_ja &&
                            "p-invalid pb-1"
                          }`}
                        />
                        <ValidationError
                          errorBlock={
                            errors.type_name_ja &&
                            touched.type_name_ja &&
                            errors.type_name_ja
                          }
                        />
                      </div>
                      <div className="pt-5">
                        <InputFloatLabel
                          inputFloatLabelProps={{
                            text: translate(localeJson, "system_name"),
                            value: values.system_name_ja,
                            onChange: handleChange,
                            onBlur: handleBlur,
                            name: "system_name_ja",
                            inputClass: "w-full",
                          }}
                          parentClass={`w-full ${
                            errors.system_name_ja &&
                            touched.system_name_ja &&
                            "p-invalid pb-1"
                          }`}
                        />
                        <ValidationError
                          errorBlock={
                            errors.system_name_ja &&
                            touched.system_name_ja &&
                            errors.system_name_ja
                          }
                        />
                      </div>
                      <div className="pt-5">
                        <InputFloatLabel
                          inputFloatLabelProps={{
                            text: translate(
                              localeJson,
                              "disclosure_information"
                            ),
                            value: values.disclosure_info_ja,
                            onChange: handleChange,
                            onBlur: handleBlur,
                            name: "disclosure_info_ja",
                            inputClass: "w-full",
                          }}
                          parentClass={`${
                            errors.disclosure_info_ja &&
                            touched.disclosure_info_ja &&
                            "p-invalid pb-1"
                          }`}
                        />
                        <ValidationError
                          errorBlock={
                            errors.disclosure_info_ja &&
                            touched.disclosure_info_ja &&
                            errors.disclosure_info_ja
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="flex p-5 pl-0 pr-0">
                    <div className="col-4 lg:col-4 md:col-4 align-self-center">
                      {translate(localeJson, "english_notation")}
                    </div>
                    <div className="flex-row col-8 lg:col-8 md:col-8">
                      <div>
                        <InputFloatLabel
                          inputFloatLabelProps={{
                            text: translate(localeJson, "type_name"),
                            value: values.type_name_en,
                            onChange: handleChange,
                            onBlur: handleBlur,
                            name: "type_name_en",
                            inputClass: "w-full",
                          }}
                          parentClass={`w-full ${
                            errors.type_name_en &&
                            touched.type_name_en &&
                            "p-invalid pb-1"
                          }`}
                        />
                        <ValidationError
                          errorBlock={
                            errors.type_name_en &&
                            touched.type_name_en &&
                            errors.type_name_en
                          }
                        />
                      </div>
                      <div className="pt-5">
                        <InputFloatLabel
                          inputFloatLabelProps={{
                            text: translate(localeJson, "system_name"),
                            value: values.system_name_en,
                            onChange: handleChange,
                            onBlur: handleBlur,
                            name: "system_name_en",
                            inputClass: "w-full",
                          }}
                          parentClass={`w-full ${
                            errors.system_name_en &&
                            touched.system_name_en &&
                            "p-invalid pb-1"
                          }`}
                        />
                        <ValidationError
                          errorBlock={
                            errors.system_name_en &&
                            touched.system_name_en &&
                            errors.system_name_en
                          }
                        />
                      </div>
                      <div className="pt-5">
                        <InputFloatLabel
                          inputFloatLabelProps={{
                            text: translate(
                              localeJson,
                              "disclosure_information"
                            ),
                            value: values.disclosure_info_en,
                            onChange: handleChange,
                            onBlur: handleBlur,
                            name: "disclosure_info_en",
                            inputClass: "w-full",
                          }}
                          parentClass={`${
                            errors.disclosure_info_en &&
                            touched.disclosure_info_en &&
                            "p-invalid pb-1"
                          }`}
                        />
                        <ValidationError
                          errorBlock={
                            errors.disclosure_info_en &&
                            touched.disclosure_info_en &&
                            errors.disclosure_info_en
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="flex p-5 pl-0 pr-0">
                    <div className="col-4 lg:col-4 md:col-4 align-self-center">
                      {translate(localeJson, "map_center_coordinates")}
                    </div>
                    <div className="flex-row col-8 lg:col-8 md:col-8">
                      <div>
                        <InputNumberFloatLabel
                          inputNumberFloatProps={{
                            id: "latitude",
                            name: "latitude",
                            mode: "decimal",
                            maxFractionDigits: "10",
                            value: values.latitude,
                            onChange: (evt) => {
                              setFieldValue("latitude", evt.value);
                            },
                            onValueChange: (evt) => {
                              evt.value && setFieldValue("latitude", evt.value);
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
                      <div className="pt-5">
                        <InputNumberFloatLabel
                          inputNumberFloatProps={{
                            id: "longitude",
                            name: "longitude",
                            mode: "decimal",
                            maxFractionDigits: "10",
                            value: values.longitude,
                            onChange: (evt) => {
                              setFieldValue("longitude", evt.value);
                            },
                            onValueChange: (evt) => {
                              evt.value &&
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
                  </div>
                  <hr />
                  <div className="flex p-5 pl-0 pr-0">
                    <div className="col-4 lg:col-4 md:col-4 align-self-center">
                      {translate(localeJson, "public_information_display_list")}
                    </div>
                    <div className="flex-row col-8 lg:col-8 md:col-8">
                      <div className="flex">
                        <div className="pr-2">
                          <NormalLabel
                            text={translate(localeJson, "display_by_default")}
                          />
                        </div>
                        <div>
                          <InputSwitch
                            inputSwitchProps={{
                              name: "initial_load_status",
                              checked: values.initial_load_status,
                              onChange: handleChange,
                              switchClass: "",
                            }}
                            parentClass={"custom-switch"}
                          />
                        </div>
                      </div>
                      <div className="pt-5">
                        <div className="pb-2">
                          <NormalLabel
                            text={translate(
                              localeJson,
                              "display_items_setting"
                            )}
                          />
                        </div>
                        <div className="w-full">
                          <DND dragProps={dragProps}>{map}</DND>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="flex p-5 pl-0 pr-0">
                    <div className="col-4 lg:col-4 md:col-4  align-self-center">
                      {translate(localeJson, "stockPile_management")}
                    </div>
                    <div className="flex-row col-8 lg:col-8 md:col-8 justify-content-end">
                      <div>
                        <InputNumberFloatLabel
                          inputNumberFloatProps={{
                            id: "default_shelf_life",
                            name: "default_shelf_life",
                            mode: "decimal",
                            maxFractionDigits: "1",
                            value: values.default_shelf_life,
                            onChange: (evt) => {
                              setFieldValue("default_shelf_life", evt.value);
                            },
                            onValueChange: (evt) => {
                              evt.value &&
                                setFieldValue("default_shelf_life", evt.value);
                            },
                            onBlur: handleBlur,
                            text: translate(localeJson, "default_shelf_life_days"),
                            inputNumberClass: "w-full",
                          }}
                          parentClass={`${
                            errors.default_shelf_life &&
                            touched.default_shelf_life &&
                            "p-invalid pb-1"
                          }`}
                        />
                        <ValidationError
                          errorBlock={
                            errors.default_shelf_life &&
                            touched.default_shelf_life &&
                            errors.default_shelf_life
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="flex p-5 pl-0 pr-0">
                    <div className="col-4 lg:col-4 md:col-4 align-self-center"></div>
                    <div className="flex-row col-8 lg:col-8 md:col-8">
                      <div>
                        <NormalLabel
                          text={translate(localeJson, "logo_image")}
                        />
                      </div>
                      <div>
                        <InputFile
                          inputFileProps={{
                            onChange: (event) => {
                                setFieldValue("image_logo", event.currentTarget.files[0]);
                            },
                            name: "image_logo",
                            accept: ".jpg,.png",
                            onBlur: handleBlur,
                          }}
                          parentClass={`${
                            errors.file && touched.file && "p-invalid pb-1"
                          }`}
                        />
                        <ValidationError
                          errorBlock={
                            errors.file && touched.file && errors.file
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="flex p-5 pl-0 pr-0">
                    <div className="col-4 lg:col-4 md:col-4 align-self-center">
                      {translate(localeJson, "evacuation_history_download")}
                    </div>
                    <div className="flex-row flex-end col-8 lg:col-8 md:col-8">
                      <div>
                        <InputSwitch
                          inputSwitchProps={{
                            name: "scheduler_option",
                            checked: values.scheduler_option,
                            onChange: handleChange,
                            switchClass: "",
                          }}
                          parentClass={"custom-switch"}
                        />
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="text-center mt-2">
                    <Button
                      buttonProps={{
                        buttonClass: "w-8rem",
                        severity: "primary",
                        type: "submit",
                        text: translate(localeJson, "save"),
                      }}
                      parentClass={"inline"}
                    />
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