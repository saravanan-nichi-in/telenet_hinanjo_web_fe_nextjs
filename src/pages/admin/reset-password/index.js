import React, { useContext } from 'react';
import { classNames } from 'primereact/utils';
import { Formik } from "formik";
import * as Yup from "yup";
import { LockFilled } from '@ant-design/icons';

import { LayoutContext } from '../../../layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from '@/helper'
import { ImageComponent, InputLeftRightGroup, NormalLabel, ValidationError, Button } from '@/components';

const ResetPasswordPage = () => {
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const containerClassName = classNames('auth_surface_ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });
    const schema = Yup.object().shape({
        password: Yup.string()
            .required(translate(localeJson, 'password_required'))
            .min(8, translate(localeJson, 'password_atLeast_8_characters')),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], translate(localeJson, 'confirm_password_notMatch'))
            .required(translate(localeJson, 'password_required'))
            .min(8, translate(localeJson, 'password_atLeast_8_characters')),
    });

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={{ password: "", confirmPassword: '' }}
                onSubmit={(values) => {
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                }) => (
                    <div className={containerClassName}>
                        <div className="flex flex-column align-items-center justify-content-center">
                            <div className="card w-full surface-card py-2 px-2" >
                                <div className='auth_view py-4 px-4 auth_surface_ground_border'>
                                    <form onSubmit={handleSubmit}>
                                        <div className="flex justify-content-center w-100 mt-3">
                                            <ImageComponent imageProps={{
                                                src: `/layout/images/telnetLogo-${layoutConfig.colorScheme !== 'light' ? 'dark' : 'dark'}.svg`,
                                                width: 150,
                                                height: 35,
                                                alt: "logo"
                                            }} />
                                        </div>
                                        <br />
                                        <div className="flex justify-content-center w-100 mb-5">
                                            {translate(localeJson, 'password_reset')}
                                        </div>
                                        <div>
                                            <div className="field custom_inputText">
                                                <NormalLabel htmlFor="password"
                                                    labelClass={"block mb-2"}
                                                    text={translate(localeJson, 'new_password')}
                                                    spanClass={"p-error"}
                                                    spanText={"*"} />
                                                <InputLeftRightGroup inputLrGroupProps={{
                                                    name: 'password',
                                                    type: "password",
                                                    value: values.password,
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                    antdRightIcon: <LockFilled />,
                                                    placeholder: translate(localeJson, 'new_password'),
                                                }}
                                                    parentClass={`w-full ${errors.password && touched.password && 'p-invalid'}`} />
                                                <ValidationError errorBlock={errors.password && touched.password && errors.password} />
                                            </div>
                                            <div className="field custom_inputText">
                                                <NormalLabel htmlFor="confirmPassword"
                                                    labelClass={"block mb-2"}
                                                    text={translate(localeJson, 'new_password_confirm')}
                                                    spanClass={"p-error"}
                                                    spanText={"*"} />
                                                <InputLeftRightGroup inputLrGroupProps={{
                                                    name: 'confirmPassword',
                                                    value: values.confirmPassword,
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                    antdRightIcon: <LockFilled />,
                                                    placeholder: translate(localeJson, 'new_password_confirm'),
                                                }}
                                                    parentClass={`w-full ${errors.confirmPassword && touched.confirmPassword && 'p-invalid'}`} />
                                                <ValidationError errorBlock={errors.confirmPassword && touched.confirmPassword && errors.password} />
                                            </div>
                                            <div className='flex justify-content-center mt-5'>
                                                <Button buttonProps={{
                                                    type: 'submit',
                                                    text: translate(localeJson, 'save'),
                                                    buttonClass: "custom_radiusBtn",
                                                    severity: "primary"
                                                }} />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Formik>
        </>
    );
};

ResetPasswordPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
        </React.Fragment>
    );
};

export default ResetPasswordPage;