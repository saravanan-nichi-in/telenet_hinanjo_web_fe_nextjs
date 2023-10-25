import React, { useContext } from 'react';
import { classNames } from 'primereact/utils';
import { Formik } from "formik";
import * as Yup from "yup";
import { MailFilled, LockFilled } from '@ant-design/icons';
import { useRouter } from 'next/router';

import { LayoutContext } from '../../../layout/context/layoutcontext';
import { useAppDispatch } from '@/redux/hooks';
import { setAdminValue } from '@/redux/auth';
import { AuthenticationAuthorizationService } from '@/services';
import { getValueByKeyRecursively as translate } from '@/helper'
import { ImageComponent, NormalLabel, Button, ValidationError, InputLeftRightGroup } from '@/components';
import { setLayout } from "@/redux/layout";
import { systemSettingServices } from "@/services";

const LoginPage = () => {
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { getList } = systemSettingServices;
    const containerClassName = classNames('auth_surface_ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });
    const schema = Yup.object().shape({
        email: Yup.string()
            .required(translate(localeJson, 'email_required'))
            .test('trim-and-validate', translate(localeJson, 'email_valid'), (value) => {
                // Trim the email and check its validity
                const trimmedEmail = value.trim();
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(trimmedEmail);
            }),
        password: Yup.string()
            .required(translate(localeJson, 'password_required'))
            .min(8, translate(localeJson, 'password_atLeast_8_characters')),
    });

    /* Services */
    const { login } = AuthenticationAuthorizationService;

    const onLoginSuccess = (values) => {
        if (AuthenticationAuthorizationService.adminValue) {
            localStorage.setItem('admin', JSON.stringify(values.data));
            dispatch(setAdminValue({
                admin: values.data
            }));
            getList(fetchSettingData)
            router.push("/admin/dashboard");
        }
    };

    const fetchSettingData =(res)=> {
        if(res)
        {
            const data = res.data.model;
            dispatch(setLayout(data))
        }
        
    }

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={{ email: "", password: "" }}
                onSubmit={(values) => {
                    let preparedPayload = values;
                    preparedPayload['email'] = preparedPayload.email.trim();
                    login('admin', preparedPayload, onLoginSuccess);
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
                                        <div className="flex justify-content-center w-100 mb-5 auth-header">
                                            {translate(localeJson, 'admin_login_screen')}
                                        </div>
                                        <div>
                                            <div className="field custom_inputText">
                                                <NormalLabel htmlFor="email"
                                                    labelClass={"block mb-2"}
                                                    text={translate(localeJson, 'mail_address')}
                                                    spanClass={"p-error"}
                                                    spanText={"*"} />
                                                <InputLeftRightGroup inputLrGroupProps={{
                                                    name: 'email',
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                    antdRightIcon: <MailFilled />,
                                                    value: values.email
                                                }}
                                                    parentClass={`w-full ${errors.email && touched.email && 'p-invalid'}`} />
                                                <ValidationError errorBlock={errors.email && touched.email && errors.email} />
                                            </div>
                                            <div className="field custom_inputText">
                                                <NormalLabel htmlFor="password"
                                                    labelClass={"block mb-2"}
                                                    text={translate(localeJson, 'password')}
                                                    spanClass={"p-error"}
                                                    spanText={"*"} />
                                                <InputLeftRightGroup inputLrGroupProps={{
                                                    name: 'password',
                                                    type: "password",
                                                    value: values.password,
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                    antdRightIcon: <LockFilled />,
                                                }}
                                                    parentClass={`w-full ${errors.password && touched.password && 'p-invalid'}`} />
                                                <ValidationError errorBlock={errors.password && touched.password && errors.password} />
                                            </div>
                                            <div className='flex justify-content-center mt-5'>
                                                <Button buttonProps={{
                                                    type: 'submit',
                                                    text: translate(localeJson, 'login'),
                                                    buttonClass: "custom_radiusBtn",
                                                    severity: "primary"
                                                }} />
                                            </div>
                                            <div className='w-full flex justify-content-center mt-0'>
                                                <Button buttonProps={{
                                                    type: 'button',
                                                    text: translate(localeJson, 'forgot_password_caption'),
                                                    link: "true",
                                                    onClick: () => router.push('/admin/forgot-password'),
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

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
        </React.Fragment>
    );
};

export default LoginPage;