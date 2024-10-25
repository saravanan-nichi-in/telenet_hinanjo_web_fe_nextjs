import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from "@/helper";
import { Button, PersonCountButton, CustomHeader, ValidationError, InputDropdown } from "@/components";
import { useAppDispatch } from "@/redux/hooks";
import { reset } from "@/redux/register";
import { Formik } from "formik";
import * as Yup from 'yup';
import { TempRegisterServices } from "@/services";

const PlaceList = () => {
    const { localeJson, locale } = useContext(LayoutContext);
    const router = useRouter()
    const dispatch = useAppDispatch()

    const [activeEvacuationOptions, setActiveEvacutaionOptions] = useState([]);
    const [pageFiveValues, setPageFiveValues] = useState({
        evacuationPlace: "",
    })
    const step5Schema = Yup.object().shape({
        evacuationPlace: Yup.string().required( translate(localeJson,"place_required"))
    });
    useEffect(() => {
        getActiveEvacuationPlace();
        dispatch(reset());
    }, [])

    const getActiveEvacuationPlace = () => {
        TempRegisterServices.getActiveEvacuationPlaceList((response) => {
            if (response) {
                const data = response.data.model;
                let placesList = [];
                let defaultValue = translate(localeJson, 'please_select');
                placesList.push({
                    name: "",
                    value: "",
                    name_en: ""
                });
                data.map((item) => {
                    let place = {
                        name: item.name,
                        name_en: item.name_en ? item.name_en : item.name,
                        value: item.id
                    }
                    placesList.push(place);
                })
                setActiveEvacutaionOptions(placesList);
            }
        })
    }

    return (
        <Formik
                key="step5"
                initialValues={pageFiveValues}
                validationSchema={step5Schema}
                onSubmit={(values) => {
                    setPageFiveValues(values);
                    const selectedPlace = activeEvacuationOptions.find(option => option.value === values.evacuationPlace);
                    localStorage.setItem("evacuationPlace", values.evacuationPlace);
                    localStorage.setItem("evacuationPlaceName", selectedPlace.name);
                    router.push('/user/qr/app/')
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue
                }) => (
                    <div>
                        <div className='grid pr-0 col-12 justify-content-center'>
                            <div className='col-12 pr-0' style={{ maxWidth: "600px" }}>
                                <div className="grid">
                                    <div className='col-12'>
                                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, 'c_evacuation_location')} />
                                    </div>
                                    <div className='col-12 pb-3'>
                                        <div className='flex'>
                                        <InputDropdown
                                            inputDropdownProps={{
                                                name: "evacuationPlace",
                                                placeholder: translate(localeJson, 'please_select'),
                                                inputDropdownParentClassName: `w-12 ${errors.evacuationPlace && touched.evacuationPlace && 'p-invalid'}`,
                                                labelProps: {
                                                    text: "",
                                                    inputDropdownLabelClassName: "font-bold",
                                                },
                                                options: activeEvacuationOptions,
                                                optionLabel: locale == 'ja' ? 'name' : 'name_en',
                                                inputDropdownClassName: "w-12",
                                                value: values.evacuationPlace,
                                                onChange: handleChange
                                            }}
                                        />
                                        </div>
                                        <ValidationError errorBlock={errors.evacuationPlace && touched.evacuationPlace && errors.evacuationPlace} />
                                    </div>
                                </div>
                                <div className='grid col-12 mt-5'>
                                    <div className='pt-3 col-12 text-center'>
                                        <Button buttonProps={{
                                            type: "submit",
                                            text: translate(localeJson, 'next'),
                                            buttonClass: "multi-form-submit w-12 sm:w-12 md:w-8 lg:w-8",
                                            rounded: true,
                                            onClick:()=>{handleSubmit()}
                                        }} parentClass={"inline"} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Formik>
    );
};

export default PlaceList;