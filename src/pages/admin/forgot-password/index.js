import React, { useContext } from 'react';
import { classNames } from 'primereact/utils';
import { Formik } from "formik";
import * as Yup from "yup";
import { MailFilled } from '@ant-design/icons';
import { useRouter } from 'next/router';

import { LayoutContext } from '../../../layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from '@/helper'
import { ImageComponent, InputLeftRightGroup, NormalLabel, ValidationError, Button } from '@/components';
import { AuthenticationAuthorizationService } from '@/services';
import { useAppSelector } from "@/redux/hooks";

const ForgotPasswordPage = () => {
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const router = useRouter();
    // Getting storage data with help of reducers
    const settings_data = useAppSelector((state) => state?.layoutReducer?.layout);
    const containerClassName = classNames('auth_surface_ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });
    const schema = Yup.object().shape({
        email: Yup.string()
            .required(translate(localeJson, 'email_required'))
            .test('trim-and-validate', translate(localeJson, 'email_valid'), (value) => {
                // Trim the email and check its validity
                const trimmedEmail = value.trim();
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(trimmedEmail);
            }),
    });

    /* Services */
    const { forgot } = AuthenticationAuthorizationService;

    /**
     * Forgot success
     * @param {*} response 
     */
    const onForgotSuccess = (response) => {
        if (response && response.data.success) {
            router.push("/admin/login");
        } else {
            console.log(response.data);
        }
    };

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={{ email: "" }}
                onSubmit={(values) => {
                    let preparedPayload = values;
                    preparedPayload['email'] = preparedPayload.email.trim();
                    forgot('admin', preparedPayload, onForgotSuccess);
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
                                                src: settings_data.image_logo_path ? settings_data.image_logo_path : `/layout/images/telnetLogo-${layoutConfig.colorScheme !== 'light' ? 'dark' : 'dark'}.svg`,
                                                width: 280,
                                                height: 45,
                                                alt: "logo"
                                            }} />
                                        </div>
                                        <br />
                                        <div className="flex justify-content-center w-100 mb-5 auth-header">
                                            {translate(localeJson, 'password_reset')}
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
                                            <div className='flex justify-content-center mt-5'>
                                                <Button buttonProps={{
                                                    type: 'submit',
                                                    text: translate(localeJson, 'send'),
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

ForgotPasswordPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
        </React.Fragment>
    );
};

export default ForgotPasswordPage;