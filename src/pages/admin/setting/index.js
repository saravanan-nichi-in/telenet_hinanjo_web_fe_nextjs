import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Formik } from "formik";
import * as Yup from "yup";

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from "@/helper";
import { Button, DND, InputFile, InputFloatLabel, InputNumberFloatLabel, InputSwitch, NormalCheckBox, NormalLabel, SelectFloatLabel, ValidationError } from '@/components';
import { mapScaleRateOptions } from '@/utils/constant';
import { AiOutlineDrag } from 'react-icons/ai';

export default function Setting() {
    const { setLoader } = useContext(LayoutContext);
    const { localeJson } = useContext(LayoutContext);
    const schema = Yup.object().shape({
        footerDisplay: Yup.string()
            .required(translate(localeJson, 'footer_required')),
        typeName: Yup.string()
            .required(translate(localeJson, 'type_name_jp_required')),
        systemName: Yup.string()
            .required(translate(localeJson, 'system_name_jp_required')),
        disclosureInfo: Yup.string()
            .required(translate(localeJson, 'disclosure_info_jp_required')),
        typeName_En: Yup.string()
            .required(translate(localeJson, 'type_name_en_required')),
        systemName_En: Yup.string()
            .required(translate(localeJson, 'system_name_en_required')),
        disclosureInfo_En: Yup.string()
            .required(translate(localeJson, 'disclosure_info_en_required')),
        latitude: Yup.number()
            .required(translate(localeJson, 'latitude_required')),
        defaultShelfLife: Yup.number()
            .required(translate(localeJson, 'default_shell_life_days_required')),
        longitude: Yup.number()
            .required(translate(localeJson, 'longitude_required')),
        file: Yup.mixed().nullable()
            .test('is-image', translate(localeJson, 'logo_img_correct_format'), (value) => {
                if (!value) return true; // If no file is selected, the validation passes.
                const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
                const fileExtension = value.split('.').pop().toLowerCase();
                if (allowedExtensions.includes(fileExtension)) {
                    // Check image size not exceeding 3MB
                    if (value.size <= 3 * 1024 * 1024) {
                        return true; // Pass validation
                    } else {
                        // Custom error message for image size exceeded
                        return new Yup.ValidationError(translate(localeJson, 'logo_img_not_greater_than_3mb'), null);
                    }
                }
                return false; // Return false for invalid input.
            }),

    });
    const initialValues = {
        mapScale: mapScaleRateOptions[0],
        footerDisplay: "フッター表示",
        typeName: '避難所管理システム避難所管理システム',
        systemName: '避難所管理システム避難所管理システム',
        disclosureInfo: "※テスト Disclosure information",
        typeName_En: "Evacuation center management system",
        systemName_En: "Evacuation center management system",
        disclosureInfo_En: "※Disclosure information",
        latitude: 12.9328549,
        longitude: 77.5374776,
        displayDefault: false,
        defaultShelfLife: 6,
        loadStatus: true,
        file: null
    };
    const [data, setData] = useState([
        { title: translate(localeJson, 'name_phonetic') },
        { title: translate(localeJson, 'name_kanji') },
        { title: translate(localeJson, 'age') },
        { title: translate(localeJson, 'gender') },
        { title: translate(localeJson, 'address') }]);
    const dragProps = {
        onDragEnd(fromIndex, toIndex) {
            const prepareData = [...data];
            const item = prepareData.splice(fromIndex, 1)[0];
            prepareData.splice(toIndex, 0, item);
            setData(prepareData);
        },
        nodeSelector: 'li',
        handleSelector: 'a'
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoader(false);
        };
        fetchData();
    }, []);

    const map = (
        <ol>
            {data.map((item, index) => (
                <li key={index}>
                    <NormalCheckBox checkBoxProps={{
                        checked: true,
                    }} />
                    <div className='ml-1 mr-1'>
                        {item.title}
                    </div>
                    <a className='ml-2'>
                        <AiOutlineDrag />
                    </a>
                </li>

            ))}
        </ol>
    )

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={initialValues}
                onSubmit={(values, actions) => {
                    close();
                    actions.resetForm({ values: initialValues });
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
                            <div className='card'>
                                <h5 className='page-header1'>{translate(localeJson, 'setting_systems')}</h5>
                                <hr />
                                <form onSubmit={handleSubmit}>
                                    <div className='flex p-5 pl-0 pr-0'>
                                        <div className='col-4 lg:col-4 md:col-4 align-self-center'>

                                        </div>
                                        <div className='flex-row col-8 lg:col-8 md:col-8'>
                                            <div>
                                                <SelectFloatLabel
                                                    selectFloatLabelProps={{
                                                        name: "prefecture_id",
                                                        optionLabel: "name",
                                                        selectClass: "w-full",
                                                        options: mapScaleRateOptions,
                                                        value: values.mapScale,
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                        text: translate(localeJson, 'overall_map_size_setting'),
                                                    }} parentClass="w-full" />
                                            </div>
                                            <div className='pt-5'>
                                                <InputFloatLabel
                                                    inputFloatLabelProps={{
                                                        text: translate(localeJson, 'footer_display'),
                                                        value: values.footerDisplay,
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                        name: "footerDisplay",
                                                        inputClass: "w-full",
                                                    }} parentClass={`w-full ${errors.footerDisplay && touched.footerDisplay && 'p-invalid pb-1'}`} />
                                                <ValidationError errorBlock={errors.footerDisplay && touched.footerDisplay && errors.footerDisplay} />
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className='flex p-5 pl-0 pr-0'>
                                        <div className='col-4 lg:col-4 md:col-4 align-self-center'>
                                            {translate(localeJson, 'japanese_notation')}
                                        </div>
                                        <div className='flex-row col-8 lg:col-8 md:col-8'>
                                            <div>
                                                <InputFloatLabel
                                                    inputFloatLabelProps={{
                                                        text: translate(localeJson, 'type_name'),
                                                        value: values.typeName,
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                        name: "typeName",
                                                        inputClass: "w-full",
                                                    }} parentClass={`w-full ${errors.typeName && touched.typeName && 'p-invalid pb-1'}`} />
                                                <ValidationError errorBlock={errors.typeName && touched.typeName && errors.typeName} />
                                            </div>
                                            <div className='pt-5'>
                                                <InputFloatLabel
                                                    inputFloatLabelProps={{
                                                        text: translate(localeJson, 'system_name'),
                                                        value: values.systemName,
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                        name: "systemName",
                                                        inputClass: "w-full",
                                                    }} parentClass={`w-full ${errors.systemName && touched.systemName && 'p-invalid pb-1'}`} />
                                                <ValidationError errorBlock={errors.systemName && touched.systemName && errors.systemName} />
                                            </div>
                                            <div className='pt-5'>
                                                <InputFloatLabel
                                                    inputFloatLabelProps={{
                                                        text: translate(localeJson, 'disclosure_information'),
                                                        value: values.disclosureInfo,
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                        name: "disclosureInfo",
                                                        inputClass: "w-full",
                                                    }} parentClass={`${errors.disclosureInfo && touched.disclosureInfo && 'p-invalid pb-1'}`} />
                                                <ValidationError errorBlock={errors.disclosureInfo && touched.disclosureInfo && errors.disclosureInfo} />
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className='flex p-5 pl-0 pr-0'>
                                        <div className='col-4 lg:col-4 md:col-4 align-self-center'>
                                            {translate(localeJson, 'english_notation')}
                                        </div>
                                        <div className='flex-row col-8 lg:col-8 md:col-8'>
                                            <div>
                                                <InputFloatLabel
                                                    inputFloatLabelProps={{
                                                        text: translate(localeJson, 'type_name'),
                                                        value: values.typeName_En,
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                        name: "typeName_En",
                                                        inputClass: "w-full",
                                                    }} parentClass={`w-full ${errors.typeName_En && touched.typeName_En && 'p-invalid pb-1'}`} />
                                                <ValidationError errorBlock={errors.typeName_En && touched.typeName_En && errors.typeName_En} />
                                            </div>
                                            <div className='pt-5'>
                                                <InputFloatLabel
                                                    inputFloatLabelProps={{
                                                        text: translate(localeJson, 'system_name'),
                                                        value: values.systemName_En,
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                        name: "systemName_En",
                                                        inputClass: "w-full",
                                                    }} parentClass={`w-full ${errors.systemName_En && touched.systemName_En && 'p-invalid pb-1'}`} />
                                                <ValidationError errorBlock={errors.systemName_En && touched.systemName_En && errors.systemName_En} />
                                            </div>
                                            <div className='pt-5'>
                                                <InputFloatLabel
                                                    inputFloatLabelProps={{
                                                        text: translate(localeJson, 'disclosure_information'),
                                                        value: values.disclosureInfo_En,
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                        name: "disclosureInfo_En",
                                                        inputClass: "w-full",
                                                    }} parentClass={`${errors.disclosureInfo_En && touched.disclosureInfo_En && 'p-invalid pb-1'}`} />
                                                <ValidationError errorBlock={errors.disclosureInfo_En && touched.disclosureInfo_En && errors.disclosureInfo_En} />
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className='flex p-5 pl-0 pr-0'>
                                        <div className='col-4 lg:col-4 md:col-4 align-self-center'>
                                            {translate(localeJson, 'map_center_coordinates')}
                                        </div>
                                        <div className='flex-row col-8 lg:col-8 md:col-8'>
                                            <div>
                                                <InputNumberFloatLabel
                                                    inputNumberFloatProps={{
                                                        mode: "decimal",
                                                        value: values.latitude,
                                                        onChange: (evt) => {
                                                            setFieldValue("latitude", evt.value);
                                                        },
                                                        onValueChange: (evt) => {
                                                            setFieldValue("latitude", evt.value);
                                                        },
                                                        onBlur: handleBlur,
                                                        name: "latitude",
                                                        maxFractionDigits: "10",
                                                        text: translate(localeJson, 'lat'),
                                                        inputNumberClass: "w-full",
                                                    }} parentClass={`w-full ${errors.latitude && touched.latitude && 'p-invalid pb-1'}`} />
                                                <ValidationError errorBlock={errors.latitude && touched.latitude && errors.latitude} />
                                            </div>
                                            <div className='pt-5'>
                                                <InputNumberFloatLabel
                                                    inputNumberFloatProps={{
                                                        mode: "decimal",
                                                        value: values.longitude,
                                                        onChange: (evt) => {
                                                            setFieldValue("longitude", evt.value);
                                                        },
                                                        onValueChange: (evt) => {
                                                            setFieldValue("longitude", evt.value);
                                                        },
                                                        onBlur: handleBlur,
                                                        name: "longitude",

                                                        maxFractionDigits: "10",
                                                        text: translate(localeJson, 'lng'),
                                                        inputNumberClass: "w-full",
                                                    }} parentClass={`w-full ${errors.longitude && touched.longitude && 'p-invalid pb-1'}`} />
                                                <ValidationError errorBlock={errors.longitude && touched.longitude && errors.longitude} />
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className='flex p-5 pl-0 pr-0'>
                                        <div className='col-4 lg:col-4 md:col-4 align-self-center'>
                                            {translate(localeJson, 'public_information_display_list')}
                                        </div>
                                        <div className='flex-row col-8 lg:col-8 md:col-8'>
                                            <div className='flex'>
                                                <div className='pr-2'>
                                                    <NormalLabel
                                                        text={translate(localeJson, 'display_by_default')}
                                                    />
                                                </div>
                                                <div>
                                                    <InputSwitch
                                                        inputSwitchProps={{
                                                            name: "displayDefault",
                                                            checked: values.displayDefault,
                                                            onChange: handleChange,
                                                            switchClass: "",
                                                        }}
                                                        parentClass={'custom-switch'}
                                                    />
                                                </div>
                                            </div>
                                            <div className='pt-5'>
                                                <div className='pb-2'>
                                                    <NormalLabel
                                                        text={translate(localeJson, 'display_items_setting')}
                                                    />
                                                </div>
                                                <div className='w-full'>
                                                    <DND dragProps={dragProps}
                                                    >
                                                        {map}
                                                    </DND>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className='flex p-5 pl-0 pr-0'>
                                        <div className='col-4 lg:col-4 md:col-4  align-self-center'>
                                            {translate(localeJson, 'stockPile_management')}
                                        </div>
                                        <div className='flex-row col-8 lg:col-8 md:col-8 justify-content-end'>
                                            <div>
                                                <InputNumberFloatLabel
                                                    inputNumberFloatProps={{
                                                        mode: "decimal",
                                                        value: values.defaultShelfLife,
                                                        name: "defaultShelfLife",
                                                        maxFractionDigits: "1",
                                                        onChange: (evt) => {
                                                            setFieldValue("defaultShelfLife", evt.value);
                                                        },
                                                        onValueChange: (evt) => {
                                                            setFieldValue("defaultShelfLife", evt.value);
                                                        },
                                                        onBlur: handleBlur,
                                                        text: translate(localeJson, 'default_shelf_life_days'),
                                                        inputNumberClass: "w-full",
                                                    }} parentClass={`${errors.defaultShelfLife && touched.defaultShelfLife && 'p-invalid pb-1'}`} />
                                                <ValidationError errorBlock={errors.defaultShelfLife && touched.defaultShelfLife && errors.defaultShelfLife} />
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className='flex p-5 pl-0 pr-0'>
                                        <div className='col-4 lg:col-4 md:col-4 align-self-center'>
                                        </div>
                                        <div className='flex-row col-8 lg:col-8 md:col-8'>
                                            <div>
                                                <NormalLabel
                                                    text={translate(localeJson, 'logo_image')}
                                                />
                                            </div>
                                            <div>
                                                <InputFile inputFileProps={{
                                                    onChange: handleChange,
                                                    name: "file",
                                                    accept: ".jpg",
                                                    onBlur: handleBlur,
                                                }} parentClass={`${errors.file && touched.file && 'p-invalid pb-1'}`} />
                                                <ValidationError errorBlock={errors.file && touched.file && errors.file} />
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className='flex p-5 pl-0 pr-0'>
                                        <div className='col-4 lg:col-4 md:col-4 align-self-center'>
                                            {translate(localeJson, 'evacuation_history_download')}
                                        </div>
                                        <div className='flex-row flex-end col-8 lg:col-8 md:col-8'>
                                            <div>
                                                <InputSwitch
                                                    inputSwitchProps={{
                                                        name: "loadStatus",
                                                        checked: values.loadStatus,
                                                        onChange: handleChange,
                                                        switchClass: "",
                                                    }}
                                                    parentClass={'custom-switch'}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="text-center mt-2">
                                        <Button buttonProps={{
                                            buttonClass: "w-8rem",
                                            severity: "primary",
                                            type: "submit",
                                            text: translate(localeJson, 'save'),
                                        }} parentClass={"inline"} />
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
