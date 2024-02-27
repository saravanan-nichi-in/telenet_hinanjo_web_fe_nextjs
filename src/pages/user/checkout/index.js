import React, { useEffect, useContext, useState, useRef } from "react";
import _ from 'lodash';
import { convertToSingleByte, getJapaneseDateTimeDisplayActualFormat, getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from "@/layout/context/layoutcontext";
import {
  Button,
  ButtonRounded,
  ValidationError,
  NormalTable, RowExpansionTable, CommonDialog
} from "@/components";
import * as Yup from "yup";
import { Formik } from "formik";
import AudioRecorder from "@/components/audio";
import { CommonServices, CheckInOutServices, TempRegisterServices } from "@/services";
import { prefectures } from '@/utils/constant';
import { useRouter } from "next/router";
import CustomHeader from "@/components/customHeader";
import QrScannerModal from "@/components/modal/qrScannerModal";
import BarcodeDialog from "@/components/modal/barcodeDialog";
import { useSelector } from "react-redux";
import CommonPage from "@/components/eventCheck.js";
import { Input, InputNumber } from "@/components/input";
import { useAppDispatch } from "@/redux/hooks";
import { setCheckOutData } from "@/redux/checkout";
import toast from "react-hot-toast";
import { setSelfID } from "@/redux/self_id";
import { YappleModal } from "@/components/modal";
export default function Admission() {
  const router = useRouter();
  const { locale, localeJson, setLoader } = useContext(LayoutContext);
  const [audioPasswordLoader, setAudioPasswordLoader] = useState(false);
  const [audioNameLoader, setAudioNameLoader] = useState(false);
  const layoutReducer = useSelector((state) => state.layoutReducer);
  const [audioFamilyCodeLoader, setAudioFamilyCodeLoader] = useState(false);
  const formikRef = useRef();
  const dispatch = useAppDispatch();
  const [tableLoading, setTableLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(false);
  const [searchFlag, setSearchFlag] = useState(false);
  const [openBasicDataInfoDialog, setOpenBasicDataInfoDialog] = useState(false);
  const [basicDataInfo, setBasicDataInfo] = useState(null);
  const schema = Yup.object().shape({
    name: Yup.string().max(100, translate(localeJson, "family_name_max")).test({
      test: function (value) {
        const { familyCode } = this.parent;
        return Boolean(familyCode) || Boolean(value);
      },
      message: translate(localeJson, "family_name_required"),
    }),
    password: Yup.string()
      .required(translate(localeJson, "family_password_required"))
      .test("is-four-digits", translate(localeJson, "family_password_min_max"), (value) => {
        return String(value).length === 4;
      }),
    familyCode: Yup.string().test({
      test: function (value) {
        const { name } = this.parent;
        return Boolean(name) || Boolean(value);
      },
      message: translate(localeJson, "family_code_required"),
    }),
  });

  const { getText } = CommonServices;
  const { getList, checkOut, eventCheckOut, placeCheckout } = CheckInOutServices;
  const { getBasicDetailsInfo, getBasicDetailsUsingUUID, getPPID } = TempRegisterServices;
  const initialValues = { name: "", password: "", familyCode: "" };

  useEffect(() => {
    const fetchData = async () => {
      setLoader(false);
      const urlParams = new URLSearchParams(window.location.search);
      const uuid = urlParams.get('uuid');
      if (uuid) {
        validateAndMoveToForm(uuid)
      }
    };
    fetchData();
  }, [locale]);

  const fetchText = (res) => {
    let newPassword = res?.data?.content;
    newPassword = parseInt(newPassword);
    if (newPassword) {
      formikRef.current.setFieldValue("password", newPassword);
    }
    setAudioPasswordLoader(false);
  };
  const fetchName = (res) => {
    let name = res?.data?.content;
    if (name) {
      formikRef.current.setFieldValue("name", name);
    }
    setAudioNameLoader(false);
  };
  const fetchFamilyCode = (res) => {
    let familyCode = res?.data?.content;
    const re = /^[0-9-]+$/;
    if (familyCode && re.test(familyCode)) {
      let val = familyCode.replace(/-/g, ""); // Remove any existing hyphens
      // Insert hyphen after the first three characters
      if (val.length > 3) {
        val = val.slice(0, 3) + "-" + val.slice(3);
      }
      formikRef.current.setFieldValue("familyCode", val);
    }
    setAudioFamilyCodeLoader(false);
  };
  const handleAudioRecorded = async (audioBlob) => {
    const fromData = new FormData();
    fromData.append("audio_sample", audioBlob);
    getText(fromData, fetchText);
  };

  const handleFamilyCodeRecordingStateChange = (isRecording) => {
    if (isRecording) {
      // Start loader
      setAudioFamilyCodeLoader(true);
    }
  };
  const handleFamilyCodeAudioRecorded = async (audioBlob) => {
    const fromData = new FormData();
    fromData.append("audio_sample", audioBlob);
    getText(fromData, fetchFamilyCode);
  };

  const handleRecordingStateChange = (isRecording) => {
    if (isRecording) {
      // Start loader
      setAudioPasswordLoader(true);
    }
  };
  const handleNameAudioRecorded = async (audioBlob) => {
    const fromData = new FormData();
    fromData.append("audio_sample", audioBlob);
    getText(fromData, fetchName);
  };

  const handleNameRecordingStateChange = (isRecording) => {
    if (isRecording) {
      // Start loader
      setAudioNameLoader(true);
    }
  };

  const getSearchResult = (res) => {
    if (res?.success && !_.isEmpty(res?.data)) {
      const data = res.data.model;
      setSearchResult(data);
      setTableLoading(false);
      dispatch(setCheckOutData(data))
      setLoader(false);
      router.push("/user/checkout/details")
    } else {
      setSearchResult([]);
      setTableLoading(false);
      setLoader(false);
    }
  };



  const [openBarcodeDialog, setOpenBarcodeDialog] = useState(false);
  const [openBarcodeConfirmDialog, setOpenBarcodeConfirmDialog] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  const [openQrPopup, setOpenQrPopup] = useState(false);
  const param = router?.query;
  const closeQrPopup = () => {
    setOpenQrPopup(false);
  }
  const qrResult = (result) => {
    alert(result);
  }

  const openMyNumberDialog = () => {
    router.push("https://login-portal-dev.biz.cityos-dev.hitachi.co.jp?screenID=HCS-100")
  };

  const validateAndMoveToForm = (id) => {
    let ppid;
    let payload = {
        "uuid":id
    }
    getPPID(payload,(res)=>
    {
      if(res)
      {
      ppid= res?.result[0];
      ppid && fetchBasicDetailsInfo(ppid);
      }
    })
  }

  const basicInfoContent = () => {
    return <div>
      <div className='mt-2'>
        <div className='flex align-items-center'>
          <div className='page-header3'>{translate(localeJson, "name_kanji")}:</div>
          <div className='page-header3-sub ml-1'>{basicDataInfo?.name}</div>
        </div>
      </div>
      <div className='mt-2'>
        <div className='flex align-items-center'>
          <div className='page-header3'>{translate(localeJson, "refugee_name")}:</div>
          <div className='page-header3-sub ml-1'>{basicDataInfo?.refugee_name}</div>
        </div>
      </div>

      <div className='mt-2'>
        <div className='flex'>
          <div className='page-header3' style={{ whiteSpace: 'nowrap' }}>{translate(localeJson, "address")}:</div>
          <div className='page-header3-sub ml-1' style={{ whiteSpace: 'normal' }}>{basicDataInfo?.address}</div>
        </div>
      </div>
      <div className='mt-2'>
        <div className='flex align-items-center'>
          <div className='page-header3'>{translate(localeJson, "tel")}:</div>
          <div className='page-header3-sub ml-1'>{basicDataInfo?.tel}</div>
        </div>
      </div>
      <div className='mt-2'>
        <div className='flex align-items-center'>
          <div className='page-header3'>{translate(localeJson, "evacuation_date_time")}:</div>
          <div className='page-header3-sub ml-1'>{basicDataInfo?.join_date ? getJapaneseDateTimeDisplayActualFormat(basicDataInfo.join_date) : ""}</div>
        </div>
      </div>
      <div className='mt-2'>
        <div className='flex align-items-center'>
          <div className='page-header3'>{translate(localeJson, "evacuation_place")}:</div>
          <div className='page-header3-sub ml-1'>{layoutReducer?.user?.place.name}</div>
        </div>
      </div>
    </div>
  }
  // alert(layoutReducer?.user?.place?.type)
  const confirmRegistrationBeforeCheckin = () => {
    if (basicDataInfo.is_registered == "1") {
      if (layoutReducer?.user?.place?.type === "event") {
        let eventID = layoutReducer?.user?.place?.type === "event" ? layoutReducer?.user?.place?.id : ""
        eventCheckOut({
          event_id: eventID,
          yapple_id: basicDataInfo.yapple_id
        }, (response) => {
          if (response.success) {
            setOpenBasicDataInfoDialog(false);
          }
        });
      } else {
        let placeId = layoutReducer?.user?.place?.type === "place" ? layoutReducer?.user?.place?.id : ""
        placeCheckout({
          place_id: basicDataInfo.place_id,
          lgwan_family_id: basicDataInfo.lgwan_familiy_id

        }, (response) => {
          if (response.success) {
            setOpenBasicDataInfoDialog(false);
          }
        });
      }
      return
    }
    displayToastAndClose()
  }

  const displayToastAndClose = () => {
    toast.error(translate(localeJson, 'notcheck_in_shelter'), {
      position: "top-right",
    });
    setOpenBasicDataInfoDialog(false);
  }

  const fetchBasicDetailsInfo = (id) => {
    let payload = {
      "ppid": id ? id : ""
    };

    getBasicDetailsUsingUUID(payload, (response) => {
      if (response.success) {
        const data = response.data;
        setBasicDataInfo(data);
        setOpenBarcodeDialog(false);
        setOpenBasicDataInfoDialog(true);
      }
    })
  }

  const openYappleModal = () => {
    // Logic for the second button click
    setImportModalOpen(true)
  };

  const handleStaffButtonClick = () => {
    // Logic for the staff button click
  };

  const [barcode, setBarcode] = useState(null);
  const onImportModalClose = () => {
    setImportModalOpen(false);
  };

  return (
    <>
      <YappleModal
        open={importModalOpen}
        close={onImportModalClose}
        barcode={barcode}
        secondButtonClick={openYappleModal}
        setBarcode={setBarcode}
        isCheckIn={false}
        successHeader={"checkout_info"}
        isEvent={true}
        callable={confirmRegistrationBeforeCheckin}
        type={layoutReducer?.user?.place?.type}
      />
      <BarcodeDialog header={translate(localeJson, "barcode_dialog_heading")}
        visible={openBarcodeDialog} setVisible={setOpenBarcodeDialog}
        title={translate(localeJson, 'barcode_mynumber_dialog_main_title')}
        subTitle={translate(localeJson, 'barcode_mynumber_dialog_sub_title')}
        validateAndMoveToTempReg={(data) => validateAndMoveToForm(data)}
      ></BarcodeDialog>

      <CommonDialog
        open={openBasicDataInfoDialog}
        dialogBodyClassName="p-0"
        header={translate(localeJson, "checkout_info")}
        content={basicInfoContent()}
        position={"center"}
        footerParentClassName={"mt-5 w-12"}
        dialogClassName={"w-10 sm:w-8 md:w-4 lg:w-4"}
        footerButtonsArray={[
          {
            buttonProps: {
              buttonClass: "w-12",
              text: translate(localeJson, "de_register"),
              onClick: () => {
                confirmRegistrationBeforeCheckin()
              },
            },
            parentClass: "mb-2",
          },
          {
            buttonProps: {
              buttonClass: "w-12 back-button",
              text: translate(localeJson, "yapple_modal_success_div_white_btn"),
              onClick: () => {
                setOpenBasicDataInfoDialog(false);
                setOpenBarcodeDialog(false)
              },
            },
            parentClass: "back-button",
          },
        ]}
        close={() => {
          setOpenBasicDataInfoDialog(false);
        }}
      />

      {layoutReducer?.user?.place?.type === "place" ?
        (
          <Formik
            innerRef={formikRef}
            validationSchema={schema}
            initialValues={initialValues}
            enableReinitialize
            onSubmit={(values) => {
              let fam_val = values.familyCode ? convertToSingleByte(values.familyCode) : "";
              let fam_pass = values.password ? convertToSingleByte(values.password) : "";
              let payload = {
                family_code: values.familyCode ? fam_val.slice(0, 3) +
                  "-" +
                  fam_val.slice(3) : "",
                refugee_name: values.name,
                password: fam_pass,
                place_id: layoutReducer?.user?.place?.id,
                ...(layoutReducer?.user?.place?.type === "place"
                  ? { place_id: layoutReducer?.user?.place?.id }
                  : layoutReducer?.user?.place?.type === "event"
                    ? { event_id: layoutReducer?.user?.place?.id }
                    : {}),
              };
              setLoader(true)
              getList(payload, getSearchResult);
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
              <div>
                <QrScannerModal
                  open={openQrPopup}
                  close={closeQrPopup}
                  callback={qrResult}>

                </QrScannerModal>
                <div className="grid">
                  <div className="col-12">
                    <div className="card">
                      <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "c_checkout_title")} />
                      <div>
                        <div className="mt-3">
                          <div
                            className="flex"
                            style={{ justifyContent: "flex-end", flexWrap: "wrap" }}
                          >
                            <Button
                              buttonProps={{
                                type: "button",
                                rounded: "true",
                                buttonClass: "back-button",
                                text: translate(localeJson, "check_out_shelter"),
                                onClick: () => {
                                  router.push({
                                    pathname: 'register/member',
                                  })
                                },
                              }}
                              parentClass={"ml-3 mr-3 mt-1 back-button"}
                              parentStyle={{ display: "none" }}
                            />
                          </div>
                        </div>
                        <div className="grid md:gap-6 lg:gap-8">
                          <div className="mt-3 col-12  md:col-5 lg:col-5" >
                            <div className="flex flex-column justify-content-start align-items-center h-full" style={{ background: "#E6E6E6" }}>
                              <div className="flex col-12 lg:col-6 w-full mt-2">
                                <ButtonRounded
                                  buttonProps={{
                                    custom: "userDashboard",
                                    buttonClass:
                                      "flex align-items-center justify-content-center  primary-button h-3rem md:h-8rem lg:h-8rem ",
                                    type: "submit",
                                    rounded: "true",
                                    text: translate(localeJson, "staff_temp_register_big_btn_one"),
                                    onClick: () => {
                                      openMyNumberDialog()
                                    }
                                  }}
                                  parentClass={
                                    "userParentDashboard back-button w-full"
                                  }
                                />
                              </div>
                              <div className="flex col-12 lg:col-3  mt-2 w-full mb-2">
                                <ButtonRounded
                                  buttonProps={{
                                    custom: "userDashboard",
                                    buttonClass:
                                      "flex align-items-center justify-content-center  primary-button h-3rem md:h-8rem lg:h-8rem ",
                                    type: "submit",
                                    rounded: "true",
                                    text: translate(localeJson, "staff_temp_register_big_btn_two"),
                                    onClick: () => {
                                      openYappleModal();
                                    }
                                  }}
                                  parentClass={
                                    "userParentDashboard back-button w-full"
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex md:hidden justify-content-center align-items-center text-gray w-full h-full mb-5 mt-5">
                            {translate(localeJson, "or")}
                          </div>
                          <div className="mt-3 col-12 md:col-6 lg:col-6">

                            <form
                              onSubmit={handleSubmit}
                              className=" lg:ml-8 md:ml-5"
                            >
                              <div className="w-full">
                                <div className="mb-3  w-12">
                                  <div className="flex w-12">
                                    <div className="w-12">
                                      <Input
                                        inputProps={{
                                          inputParentClassName: `w-full custom_input ${errors.name &&
                                            touched.name &&
                                            "p-invalid"
                                            }`,
                                          labelProps: {
                                            text: translate(localeJson, 'shelter_name'),
                                            inputLabelClassName: "block",
                                            spanText: "*",
                                            inputLabelSpanClassName: "p-error",
                                            labelMainClassName: "pb-1"
                                          },
                                          inputClassName: "w-full",
                                          id: "name",
                                          name: "name",
                                          placeholder: translate(
                                            localeJson,
                                            "placeholder_please_enter_name"
                                          ),
                                          value: values.name,
                                          onChange: handleChange,
                                          onBlur: handleBlur,
                                          isLoading: audioNameLoader,
                                          disabled: audioNameLoader,
                                          hasIcon: true,
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="w-11">
                                    <ValidationError
                                      errorBlock={
                                        errors.name && touched.name && errors.name
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="mb-3 w-full">
                                  <div className="flex w-12">
                                    <div className="w-12">
                                      <Input inputProps={{
                                        inputParentClassName: `custom_input w-full ${errors.password &&
                                          touched.password &&
                                          "p-invalid"
                                          }`,
                                        labelProps: {
                                          text: translate(localeJson, "shelter_password"),
                                          inputLabelClassName: "block",
                                          spanText: "*",
                                          inputLabelSpanClassName: "p-error",
                                          labelMainClassName: "pb-1"
                                        },
                                        inputClassName: "w-full",
                                        useGrouping: false,
                                        id: "password",
                                        name: "password",
                                        inputMode: "numeric",
                                        keyfilter: "int",
                                        placeholder: translate(
                                          localeJson,
                                          "placeholder_please_enter_password"
                                        ),
                                        value: values.password,
                                        isLoading: audioPasswordLoader,
                                        disabled: audioPasswordLoader,
                                        hasIcon: true,
                                        onChange: (evt) => {
                                          const re = /^[0-9-]+$/;
                                          if (evt.target.value == "") {
                                            setFieldValue("password", evt.target.value);
                                          }
                                          if (re.test(convertToSingleByte(evt.target.value))) {
                                            setFieldValue("password", evt.target.value);
                                          }
                                        },
                                        onValueChange: (evt) => {
                                          const re = /^[0-9-]+$/;
                                          if (evt.target.value == "") {
                                            setFieldValue("password", evt.target.value);
                                          }
                                          if (re.test(convertToSingleByte(evt.target.value))) {
                                            setFieldValue("password", evt.target.value);
                                          }
                                        },
                                        onBlur: handleBlur,
                                      }} />
                                    </div>
                                  </div>
                                  <div className="w-11">
                                    <ValidationError
                                      errorBlock={
                                        errors.password &&
                                        touched.password &&
                                        errors.password
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="mb-3 w-full">
                                  <div className="flex w-12">
                                    <div className="w-12">
                                      <Input
                                        inputProps={{
                                          inputParentClassName: `w-full custom_input ${errors.familyCode &&
                                            touched.familyCode &&
                                            "p-invalid"
                                            }`,
                                          labelProps: {
                                            text: translate(localeJson, 'shelter_code'),
                                            inputLabelClassName: "block",
                                            spanText: "*",
                                            inputLabelSpanClassName: "p-error",
                                            labelMainClassName: "pb-1"
                                          },
                                          inputClassName: "w-full",
                                          id: "familyCode",
                                          name: "familyCode",
                                          inputMode: "numeric",
                                          placeholder: translate(
                                            localeJson,
                                            "placeholder_hyphen_not_required"
                                          ),
                                          value: values.familyCode,
                                          isLoading: audioFamilyCodeLoader,
                                          disabled: audioFamilyCodeLoader,
                                          hasIcon: true,
                                          onChange: (evt) => {
                                            const re = /^[0-9-]+$/;
                                            if (
                                              evt.target.value === "" ||
                                              re.test(convertToSingleByte(evt.target.value))
                                            ) {
                                              let val = evt.target.value.replace(
                                                /-/g,
                                                ""
                                              ); // Remove any existing hyphens
                                              if (val.length > 3) {
                                                val =
                                                  val.slice(0, 3) +
                                                  val.slice(3);
                                              }
                                              setFieldValue("familyCode", val);
                                            }
                                          },
                                          onBlur: handleBlur,
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="w-11">
                                    <ValidationError
                                      errorBlock={
                                        errors.familyCode &&
                                        touched.familyCode &&
                                        errors.familyCode
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3">
                                <div
                                  className="flex"
                                  style={{
                                    justifyContent: "flex-end",
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <ButtonRounded
                                    buttonProps={{
                                      buttonClass: "w-12 h-3rem primary-button",
                                      type: "submit",
                                      rounded: "true",
                                      text: translate(localeJson, "mem_search"),
                                    }}
                                    parentClass={"w-full primary-button"}
                                  />
                                </div>
                              </div>
                            </form>
                          </div>
                          {/* </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Formik>
        )
        :
        (
          <div className="h-full flex flex-1 justify-content-center align-items-center">
            <CommonPage
              firstButtonClick={openMyNumberDialog}
              secondButtonClick={openYappleModal}
              staffButtonClick={handleStaffButtonClick}
              isChecKIn={false}
              tittle={translate(localeJson, "c_checkout_title")}
            />
          </div>
        )}
    </>
  );
}
